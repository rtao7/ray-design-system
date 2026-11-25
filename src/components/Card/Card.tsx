import type { ElementType, HTMLAttributes, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "surface" | "outline" | "elevated" | "ghost";

export type CardPadding = "none" | "sm" | "md" | "lg";

const variantClass = {
  surface: styles.surface,
  outline: styles.outline,
  elevated: styles.elevated,
  ghost: styles.ghost,
} as const satisfies Record<CardVariant, string>;

const paddingClass = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
} as const satisfies Record<CardPadding, string>;

export type CardProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  as?: ElementType;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children">;

export type CardSlotProps = {
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

export function Card({
  variant = "surface",
  padding = "md",
  as,
  href,
  type,
  disabled,
  className,
  children,
  ...props
}: CardProps) {
  const Tag = as ?? (href != null ? "a" : "div");
  const interactive = Tag === "a" || Tag === "button";

  return (
    <Tag
      {...props}
      className={[
        styles.card,
        variantClass[variant],
        paddingClass[padding],
        interactive ? styles.interactive : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      href={Tag === "a" ? href : undefined}
      type={Tag === "button" ? (type ?? "button") : undefined}
      disabled={Tag === "button" ? disabled : undefined}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ className, children, ...props }: CardSlotProps) {
  return (
    <div
      className={[styles.header, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({ className, children, ...props }: CardSlotProps) {
  return (
    <div className={[styles.body, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: CardSlotProps) {
  return (
    <div
      className={[styles.footer, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardMedia({ className, children, ...props }: CardSlotProps) {
  return (
    <div
      className={[styles.media, className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
