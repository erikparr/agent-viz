"use client";

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "xs" | "sm" | "md";

const VARIANT: Record<Variant, string> = {
  primary:
    "border border-border-accent bg-border-accent text-bg-primary font-bold " +
    "hover:brightness-110 focus-visible:ring-2 focus-visible:ring-text-primary " +
    "focus-visible:ring-offset-1 focus-visible:ring-offset-bg-primary",
  secondary:
    "border border-border-muted text-text-secondary " +
    "hover:border-border-accent hover:text-text-primary " +
    "focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none",
  ghost:
    "text-text-secondary hover:text-text-primary " +
    "focus-visible:ring-2 focus-visible:ring-border-accent focus-visible:outline-none",
};

const SIZE: Record<Size, string> = {
  xs: "text-[10px] px-2 py-1",
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
};

const BASE =
  "inline-flex items-center justify-center gap-1.5 " +
  "transition-colors select-none " +
  "disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none";

function classes(variant: Variant, size: Size, className?: string) {
  return [BASE, VARIANT[variant], SIZE[size], className].filter(Boolean).join(" ");
}

function Spinner() {
  return (
    <span aria-hidden className="cursor-blink leading-none" style={{ width: "1ch" }}>
      ●
    </span>
  );
}

// ─── Button ─────────────────────────────────────────────────────────────────

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "prefix"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "sm",
  loading = false,
  disabled,
  prefix,
  suffix,
  className,
  type = "button",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes(variant, size, className)}
      {...rest}
    >
      {loading ? <Spinner /> : prefix}
      {children}
      {suffix}
    </button>
  );
}

// ─── ButtonLink ─────────────────────────────────────────────────────────────

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "prefix"> {
  variant?: Variant;
  size?: Size;
  external?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  children: ReactNode;
}

export function ButtonLink({
  variant = "secondary",
  size = "sm",
  external,
  prefix,
  suffix,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <a className={classes(variant, size, className)} {...externalProps} {...rest}>
      {prefix}
      {children}
      {suffix}
    </a>
  );
}
