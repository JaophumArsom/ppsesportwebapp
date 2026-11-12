import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

/**
 * Shared hero header for every sub page. Keeps the rhythm of the site
 * consistent: eyebrow → title → description → optional meta row.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
  children,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: { label: string; value: string }[];
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-brand-radial pb-14 pt-14 sm:pb-16 sm:pt-20 lg:pb-20 lg:pt-24",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-30 [mask-image:radial-gradient(65%_60%_at_40%_20%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page">
        <Reveal>
          <div
            className={cn(
              "flex flex-col gap-6",
              align === "center" ? "items-center text-center" : "items-start",
            )}
          >
            {eyebrow ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-soft shadow-soft backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-deep to-sky-deep" />
                {eyebrow}
              </span>
            ) : null}

            <h1 className="max-w-4xl text-[clamp(2.1rem,5.6vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink">
              {title}
            </h1>

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

            {children}

            {meta && meta.length ? (
              <dl className="mt-2 flex flex-wrap gap-x-10 gap-y-4">
                {meta.map((item) => (
                  <div key={item.label} className="flex flex-col">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-mute">
                      {item.label}
                    </dt>
                    <dd className="mt-1 font-display text-lg font-extrabold text-ink">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
