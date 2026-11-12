"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  Media
 * ----------------------------------------------------------------------------
 *  Renders either a real photo (next/image) or — when `src` is `null` — a
 *  branded, animated placeholder frame. Every image in the site flows through
 *  this component, so swapping the demo placeholders for real photography is
 *  a pure data change.
 * ============================================================================
 */

export type MediaRatio = "portrait" | "square" | "landscape" | "wide";

interface MediaProps {
  src?: string | null;
  alt: string;
  /** Aspect ratio of the frame. */
  ratio?: MediaRatio;
  /** Tailwind classes applied to the wrapper. */
  className?: string;
  /** Tailwind classes applied to the inner image. */
  imgClassName?: string;
  /** Priority loading for above-the-fold imagery. */
  priority?: boolean;
  /** Short label rendered inside the placeholder frame. */
  label?: string;
  /** `object-position` for the real image. */
  position?: string;
  sizes?: string;
  /** Tone of the placeholder gradient. */
  tone?: "pink" | "sky" | "mix";
  /** Hide the small "Placeholder" chip (useful for tiny frames like avatars). */
  showChip?: boolean;
  /** Compact mode for small frames (avatars): smaller glyph, no label. */
  compact?: boolean;
}

const ratioClass: Record<MediaRatio, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/9]",
};

const toneClass = {
  pink: "from-[#FDEBF4] via-[#FBF1F6] to-[#EAF6FC]",
  sky: "from-[#EAF6FC] via-[#F4FAFD] to-[#FDEBF4]",
  mix: "from-[#FDEBF4] via-white to-[#EAF6FC]",
};

export function Media({
  src,
  alt,
  ratio = "landscape",
  className,
  imgClassName,
  priority = false,
  label,
  position = "center",
  sizes = "(max-width: 1024px) 100vw, 50vw",
  tone = "mix",
  showChip = true,
  compact = false,
}: MediaProps) {
  const frame = cn("relative overflow-hidden bg-sky-soft", ratioClass[ratio], className);

  if (src) {
    return (
      <div className={frame}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imgClassName)}
          style={{ objectPosition: position }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(frame, "group/media")}
      role="img"
      aria-label={alt}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br",
          toneClass[tone],
        )}
      />
      {/* Decorative arcs give the placeholder a designed, on-brand feel. */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.55]"
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="pp-mesh" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#142B50" fillOpacity="0.14" />
          </pattern>
        </defs>
        <rect width="400" height="300" fill="url(#pp-mesh)" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <div
          className={cn(
            "flex items-center justify-center rounded-xl border border-white/70 bg-white/70 text-ink shadow-soft backdrop-blur",
            compact ? "h-8 w-8" : "h-11 w-11",
          )}
        >
          <svg viewBox="0 0 24 24" className={compact ? "h-4 w-4" : "h-5 w-5"} fill="none" aria-hidden="true">
            <path
              d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </div>
        {label && !compact ? (
          <p className="max-w-[85%] text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute">
            {label}
          </p>
        ) : null}
        {showChip && !compact ? (
          <span className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-mute ring-1 ring-white/80">
            Placeholder
          </span>
        ) : null}
      </div>
    </div>
  );
}
