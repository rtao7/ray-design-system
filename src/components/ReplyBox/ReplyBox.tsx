import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "../Button/index.ts";
import styles from "./ReplyBox.module.css";

export type ReplyBoxProps = {
  recipient: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

const sendDelay = 700;

function readMotion(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function readMotionMs(name: string) {
  const raw = readMotion(name);
  if (raw.endsWith("ms")) return Number.parseFloat(raw);
  if (raw.endsWith("s")) return Number.parseFloat(raw) * 1000;
  return 0;
}

function isEditorEmpty(root: HTMLElement) {
  return (root.textContent ?? "").replace(/\u00a0/g, " ").trim() === "";
}

function htmlForValue(root: HTMLElement) {
  return isEditorEmpty(root) ? "" : root.innerHTML;
}

function isHtmlEmpty(html: string) {
  if (!html) return true;
  const template = document.createElement("template");
  template.innerHTML = html;
  return (template.content.textContent ?? "").replace(/\u00a0/g, " ").trim() === "";
}

function SendIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2.75 8.15 13.25 2.75 9.15 13.25 7.65 8.85Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7.65 8.85 13.25 2.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className={styles.spinner} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M8 2.5a5.5 5.5 0 1 1-4.6 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className={styles.success} viewBox="0 0 16 16" aria-hidden="true">
      <circle
        cx="8"
        cy="8"
        r="5.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M5.2 8.2 7.1 10.1 10.9 6.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 3.5H3.5V6M10 3.5h2.5V6M6 12.5H3.5V10M10 12.5h2.5V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReplyBox({
  recipient,
  value,
  defaultValue = "",
  onChange,
  onSend,
  placeholder = "Write a reply",
  disabled = false,
}: ReplyBoxProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLFormElement>(null);
  const initialHtml = useRef(value ?? defaultValue);
  const sendTimer = useRef<number | null>(null);
  const pendingHeight = useRef<number | null>(null);
  const motion = useRef<Animation | null>(null);
  const [empty, setEmpty] = useState(() => isHtmlEmpty(value ?? defaultValue));
  const [phase, setPhase] = useState<"compose" | "sending" | "sent">("compose");

  const clearEditor = useCallback(() => {
    const root = editorRef.current;
    if (!root || value !== undefined || isEditorEmpty(root)) return;
    root.innerHTML = "";
    setEmpty(true);
    onChange?.("");
  }, [onChange, value]);

  useEffect(() => {
    return () => {
      if (sendTimer.current != null) window.clearTimeout(sendTimer.current);
      motion.current?.cancel();
    };
  }, []);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const from = pendingHeight.current;
    pendingHeight.current = null;
    if (!box || from == null) return;

    motion.current?.cancel();
    motion.current = null;
    box.classList.remove(styles.resizing);
    const to = box.getBoundingClientRect().height;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || Math.abs(from - to) < 1) {
      if (box.dataset.phase === "sent") clearEditor();
      return;
    }

    box.classList.add(styles.resizing);
    const animation = box.animate(
      [{ height: `${from}px` }, { height: `${to}px` }],
      {
        duration: readMotionMs("--duration-slow"),
        easing: readMotion("--ease-decelerate"),
        fill: "forwards",
      },
    );
    motion.current = animation;
    animation.onfinish = () => {
      box.classList.remove(styles.resizing);
      animation.cancel();
      if (motion.current === animation) motion.current = null;
      if (box.dataset.phase === "sent") clearEditor();
    };
  }, [clearEditor, phase]);

  useLayoutEffect(() => {
    const root = editorRef.current;
    if (!root || !initialHtml.current) return;
    root.innerHTML = initialHtml.current;
    setEmpty(isEditorEmpty(root));
  }, []);

  useLayoutEffect(() => {
    const root = editorRef.current;
    if (!root || value === undefined) return;
    if (htmlForValue(root) !== value) {
      root.innerHTML = value;
      setEmpty(isEditorEmpty(root));
    }
  }, [value]);

  function publish() {
    const root = editorRef.current;
    if (!root) return;
    setEmpty(isEditorEmpty(root));
    onChange?.(htmlForValue(root));
  }

  function submit() {
    const root = editorRef.current;
    if (!root || disabled || phase !== "compose" || isEditorEmpty(root)) return;

    const html = root.innerHTML;
    setPhase("sending");

    sendTimer.current = window.setTimeout(() => {
      onSend?.(html);
      const box = boxRef.current;
      pendingHeight.current = box ? box.getBoundingClientRect().height : null;
      setPhase("sent");
    }, sendDelay);
  }

  function expand() {
    const box = boxRef.current;
    pendingHeight.current = box ? box.getBoundingClientRect().height : null;
    clearEditor();
    setPhase("compose");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function onEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled || phase !== "compose") return;

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled || phase !== "compose") return;
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    publish();
  }

  const sending = phase === "sending";
  const sent = phase === "sent";

  return (
    <form
      ref={boxRef}
      className={styles.box}
      data-phase={phase}
      aria-disabled={disabled || undefined}
      aria-busy={sending || undefined}
      onSubmit={onSubmit}
    >
      <div className={styles.composeClip} inert={sent || undefined}>
        <div className={styles.compose}>
          <p className={styles.recipient}>
            Replying to <span className={styles.name}>{recipient}</span>
          </p>
          <div
            ref={editorRef}
            className={styles.editor}
            role="textbox"
            aria-multiline="true"
            aria-label={`Reply to ${recipient}`}
            aria-disabled={disabled || sending || undefined}
            aria-placeholder={placeholder}
            data-placeholder={placeholder}
            data-empty={empty ? "true" : "false"}
            contentEditable={!disabled && !sending && !sent}
            tabIndex={disabled || sent ? -1 : 0}
            onInput={publish}
            onKeyDown={onEditorKeyDown}
            onPaste={onPaste}
          />
          <div className={styles.footer}>
            <Button
              className={[styles.action, sending ? styles.sending : ""]
                .filter(Boolean)
                .join(" ")}
              type="submit"
              icon={sending ? <SpinnerIcon /> : <SendIcon />}
              aria-label={sending ? "Sending" : "Send"}
              disabled={disabled || empty || sending}
            />
          </div>
        </div>
      </div>
      <div className={styles.sentClip} inert={!sent || undefined} aria-hidden={!sent}>
        <div className={styles.sentRow} role={sent ? "status" : undefined}>
          <SuccessIcon />
          <p className={styles.sentMessage}>
            Message sent to <span className={styles.name}>{recipient}</span>
          </p>
          <Button
            className={styles.expand}
            variant="ghost"
            icon={<ExpandIcon />}
            aria-label="Expand reply"
            onClick={expand}
          />
        </div>
      </div>
    </form>
  );
}
