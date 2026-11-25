import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import styles from "./Card.module.css";

export type CardVariant = "outlined" | "elevated" | "ghost";

export type CardPadding = "none" | "sm" | "md" | "lg";

type CardOwnProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  children?: ReactNode;
};

export type CardProps<E extends ElementType = "div"> = CardOwnProps & {
  as?: E;
} & Omit<ComponentPropsWithoutRef<E>, keyof CardOwnProps | "as">;

const variantClass = {
  outlined: styles.outlined,
  elevated: styles.elevated,
  ghost: styles.ghost,
} as const satisfies Record<CardVariant, string>;

const paddingClass = {
  none: styles.padNone,
  sm: styles.padSm,
  md: styles.padMd,
  lg: styles.padLg,
} as const satisfies Record<CardPadding, string>;

function classNames(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function CardHeader({
  className,
  ...props
}: ComponentPropsWithoutRef<"header">) {
  return <header className={classNames(styles.header, className)} {...props} />;
}

export function CardBody({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={classNames(styles.body, className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: ComponentPropsWithoutRef<"footer">) {
  return <footer className={classNames(styles.footer, className)} {...props} />;
}

export function CardMedia({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return <div className={classNames(styles.media, className)} {...props} />;
}

export function Card<E extends ElementType = "div">({
  as,
  variant = "outlined",
  padding = "md",
  className,
  children,
  ...props
}: CardProps<E>) {
  const Tag = (as ?? ("href" in props ? "a" : "div")) as ElementType;
  const interactive = Tag === "a" || Tag === "button";
  const buttonType =
    Tag === "button" && !("type" in props) ? { type: "button" as const } : {};

  return (
    <Tag
      className={classNames(
        styles.card,
        variantClass[variant],
        paddingClass[padding],
        interactive && styles.interactive,
        className,
      )}
      {...buttonType}
      {...props}
    >
      {children}
    </Tag>
  );
}
