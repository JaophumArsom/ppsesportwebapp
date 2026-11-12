import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  Button                                    */
/* -------------------------------------------------------------------------- */

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_10px_30px_-12px_rgba(20,43,80,0.55)] hover:bg-[#1b3767]",
  secondary:
    "bg-gradient-to-r from-pink to-sky text-ink shadow-[0_10px_30px_-14px_rgba(46,155,209,0.6)] hover:from-[#f8cde0] hover:to-[#b6e4f8]",
  outline:
    "border border-ink/15 bg-white/80 text-ink hover:border-ink/30 hover:bg-white",
  ghost: "text-ink hover:bg-ink/[0.05]",
};

const sizeClass: Record<Size, string> = {
  sm: "h-9 px-4 text-[13px] gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-[52px] px-7 text-[15px] gap-2.5",
};

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  external?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  ariaLabel?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon,
  iconPosition = "right",
  external,
  onClick,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "group inline-flex select-none items-center justify-center rounded-full font-semibold tracking-tight",
    "transition-all duration-300 ease-out active:scale-[0.98]",
    variantClass[variant],
    sizeClass[size],
    className,
  );

  const inner = (
    <>
      {icon && iconPosition === "left" ? (
        <span className="transition-transform duration-300 group-hover:-translate-x-0.5">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
      {icon && iconPosition === "right" ? (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5">
          {icon}
        </span>
      ) : null}
    </>
  );

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={classes}
          aria-label={ariaLabel}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
      {inner}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Badge                                    */
/* -------------------------------------------------------------------------- */

export function Badge({
  children,
  className,
  tone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  tone?: "neutral" | "pink" | "sky" | "ink" | "outline";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/[0.05] text-ink-soft ring-ink/10",
    pink: "bg-pink-soft text-[#A8447A] ring-pink/50",
    sky: "bg-sky-soft text-[#1B6E96] ring-sky/60",
    ink: "bg-ink text-white ring-ink/20",
    outline: "bg-white/70 text-ink-soft ring-ink/10",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Section head                                 */
/* -------------------------------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-5",
        align === "center" ? "items-center text-center" : "items-start text-left",
        action && "lg:flex-row lg:items-end lg:justify-between lg:gap-10",
        className,
      )}
    >
      <div className={cn("flex flex-col gap-4", align === "center" && "items-center")}>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft ring-1 ring-ink/10 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-deep to-sky-deep" />
            {eyebrow}
          </span>
        ) : null}
        <h2
          className={cn(
            "text-3xl font-extrabold leading-[1.1] text-ink sm:text-4xl lg:text-[2.75rem]",
            align === "center" && "mx-auto max-w-3xl",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "max-w-2xl text-[15px] leading-relaxed text-ink-mute sm:text-base",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Divider / accents                             */
/* -------------------------------------------------------------------------- */

export function GradientRule({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-pink/60 to-transparent",
        className,
      )}
    />
  );
}

/** Small uppercase label used above section titles. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-sky-deep">
      {children}
    </span>
  );
}

export type { ComponentProps };
