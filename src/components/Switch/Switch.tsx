import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Switch.module.css";

type SwitchBaseProps = {
  icon?: ReactNode;
  checkedIcon?: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "role" | "children" | "aria-label"
>;

type LabeledSwitchProps = SwitchBaseProps & {
  children: ReactNode;
  "aria-label"?: string;
};

type UnlabeledSwitchProps = SwitchBaseProps & {
  children?: never;
  "aria-label": string;
};

export type SwitchProps = LabeledSwitchProps | UnlabeledSwitchProps;

export function Switch({
  icon,
  checkedIcon,
  className,
  children,
  ...props
}: SwitchProps) {
  return (
    <label className={[styles.switch, className].filter(Boolean).join(" ")}>
      <input
        {...props}
        type="checkbox"
        role="switch"
        className={styles.input}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb}>
          {icon != null ? (
            <span
              className={checkedIcon != null ? styles.iconOff : styles.icon}
            >
              {icon}
            </span>
          ) : null}
          {checkedIcon != null ? (
            <span className={styles.iconOn}>{checkedIcon}</span>
          ) : null}
        </span>
      </span>
      {children != null ? <span className={styles.label}>{children}</span> : null}
    </label>
  );
}
