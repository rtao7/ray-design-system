import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "../Button/index.ts";
import styles from "./ChatComposer.module.css";

export type ChatComposerProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSend?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

function readMotion(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function readMotionMs(name: string) {
  const raw = readMotion(name);
  if (raw.endsWith("ms")) return Number.parseFloat(raw);
  if (raw.endsWith("s")) return Number.parseFloat(raw) * 1000;
  return 0;
}

function isBlank(value: string) {
  return value.trim() === "";
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

export function ChatComposer({
  value,
  defaultValue = "",
  onChange,
  onSend,
  placeholder = "Message…",
  disabled = false,
  "aria-label": ariaLabel = "Message",
}: ChatComposerProps) {
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const motion = useRef<Animation | null>(null);
  const composing = useRef(false);
  const composeTimer = useRef<number | null>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const text = value ?? uncontrolled;
  const empty = isBlank(text);

  useEffect(() => {
    return () => {
      motion.current?.cancel();
      if (composeTimer.current != null) window.clearTimeout(composeTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const style = getComputedStyle(field);
    const max = Number.parseFloat(style.maxHeight);
    const min = Number.parseFloat(style.minHeight);
    const from = field.getBoundingClientRect().height;
    const first = field.style.height === "";

    motion.current?.cancel();
    motion.current = null;

    field.style.overflowY = "hidden";
    field.style.height = "0px";
    const full = field.scrollHeight;
    const ceiling = Number.isFinite(max) ? max : full;
    const floor = Number.isFinite(min) ? min : 0;
    const to = Math.min(Math.max(full, floor), ceiling);
    field.style.overflowY = full > ceiling ? "auto" : "hidden";
    field.style.height = `${to}px`;

    const duration = readMotionMs("--duration-fast");
    if (first || duration === 0 || Math.abs(from - to) < 1) return;

    motion.current = field.animate([{ height: `${from}px` }, { height: `${to}px` }], {
      duration,
      easing: readMotion("--ease-decelerate") || "ease",
    });
  }, [text]);

  function publish(next: string) {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  }

  function send() {
    const field = fieldRef.current;
    if (!field || disabled || isBlank(field.value)) return;

    const message = field.value.trim();
    if (value === undefined) {
      setUncontrolled("");
      field.value = "";
    }
    onChange?.("");
    onSend?.(message);
    field.focus();
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send();
  }

  function onFieldChange(event: ChangeEvent<HTMLTextAreaElement>) {
    publish(event.target.value);
  }

  function onFieldKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    // keyCode 229 and the composing flag cover IME confirmation, including
    // Safari, which fires compositionend before the confirming Enter.
    if (event.nativeEvent.isComposing || composing.current || event.keyCode === 229) {
      return;
    }
    event.preventDefault();
    send();
  }

  function onCompositionStart() {
    if (composeTimer.current != null) {
      window.clearTimeout(composeTimer.current);
      composeTimer.current = null;
    }
    composing.current = true;
  }

  function onCompositionEnd() {
    composeTimer.current = window.setTimeout(() => {
      composing.current = false;
      composeTimer.current = null;
    }, 0);
  }

  return (
    <form
      className={styles.composer}
      aria-disabled={disabled || undefined}
      onSubmit={onSubmit}
    >
      <textarea
        ref={fieldRef}
        className={styles.field}
        value={text}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label={ariaLabel}
        enterKeyHint="send"
        onChange={onFieldChange}
        onKeyDown={onFieldKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
      <Button
        className={styles.send}
        type="submit"
        icon={<SendIcon />}
        aria-label="Send"
        disabled={disabled || empty}
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      />
    </form>
  );
}
