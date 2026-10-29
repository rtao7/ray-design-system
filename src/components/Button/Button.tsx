import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "outline" | "ghost";

type ButtonBaseProps = {
  variant?: ButtonVariant;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-label">;

type LabeledButtonProps = ButtonBaseProps & {
  children: ReactNode;
  icon?: ReactNode;
  "aria-label"?: string;
};

type IconOnlyButtonProps = ButtonBaseProps & {
  icon: ReactNode;
  children?: never;
  "aria-label": string;
};

export type ButtonProps = LabeledButtonProps | IconOnlyButtonProps;

export function Button({
  variant = "primary",
  icon,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  const iconOnly = icon != null && children == null;

  return (
    <button
      type={type}
      className={[
        styles.button,
        styles[variant],
        iconOnly && styles.iconOnly,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
    </button>
  );
}
