import { LogoMark } from "@/components/ui/Logo";

/**
 * Route-transition loading state for the dynamic member pages.
 * Deliberately minimal — a soft pulse instead of a spinner so it never
 * interrupts the browsing flow.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-brand-radial px-6">
      <div className="relative">
        <div
          className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-pink/50 via-transparent to-sky/50 blur-2xl animate-pulse"
          aria-hidden="true"
        />
        <span className="animate-pulse">
          <LogoMark className="h-12 w-12" />
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="h-1 w-32 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-1/2 animate-[shimmer_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-pink-deep to-sky-deep" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ink-mute">
          Loading
        </p>
      </div>
    </div>
  );
}
