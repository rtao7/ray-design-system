import {
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
  const initialHtml = useRef(value ?? defaultValue);
  const [empty, setEmpty] = useState(() => isHtmlEmpty(value ?? defaultValue));

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
    if (!root || disabled || isEditorEmpty(root)) return;

    onSend?.(root.innerHTML);

    if (value === undefined) {
      root.innerHTML = "";
      setEmpty(true);
      onChange?.("");
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function onEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;

    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  }

  function onPaste(event: ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    const text = event.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
    publish();
  }

  return (
    <form
      className={styles.box}
      aria-disabled={disabled || undefined}
      onSubmit={onSubmit}
    >
      <p className={styles.recipient}>
        Replying to <span className={styles.name}>{recipient}</span>
      </p>
      <div
        ref={editorRef}
        className={styles.editor}
        role="textbox"
        aria-multiline="true"
        aria-label={`Reply to ${recipient}`}
        aria-disabled={disabled || undefined}
        aria-placeholder={placeholder}
        data-placeholder={placeholder}
        data-empty={empty ? "true" : "false"}
        contentEditable={!disabled}
        tabIndex={disabled ? -1 : 0}
        onInput={publish}
        onKeyDown={onEditorKeyDown}
        onPaste={onPaste}
      />
      <div className={styles.footer}>
        <Button
          className={styles.action}
          type="submit"
          icon={<SendIcon />}
          aria-label="Send"
          disabled={disabled || empty}
        />
      </div>
    </form>
  );
}
