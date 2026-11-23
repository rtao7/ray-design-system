import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Text.module.css";

export type TextVariant =
  | "display"
  | "heading-lg"
  | "heading-md"
  | "heading-sm"
  | "body-lg"
  | "body"
  | "body-sm"
  | "label"
  | "caption"
  | "code";

export type TextTone = "default" | "muted";

const defaultElement = {
  display: "h1",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  label: "span",
  caption: "span",
  code: "code",
} as const satisfies Record<TextVariant, ElementType>;

const variantClass = {
  display: styles.display,
  "heading-lg": styles.headingLg,
  "heading-md": styles.headingMd,
  "heading-sm": styles.headingSm,
  "body-lg": styles.bodyLg,
  body: styles.body,
  "body-sm": styles.bodySm,
  label: styles.label,
  caption: styles.caption,
  code: styles.code,
} as const satisfies Record<TextVariant, string>;

export type TextProps = {
  variant?: TextVariant;
  as?: ElementType;
  tone?: TextTone;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export function Text({
  variant = "body",
  as,
  tone = "default",
  className,
  children,
  ...props
}: TextProps) {
  const Tag = as ?? defaultElement[variant];

  return (
    <Tag
      className={[
        styles.text,
        variantClass[variant],
        tone === "muted" && styles.muted,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </Tag>
  );
}
