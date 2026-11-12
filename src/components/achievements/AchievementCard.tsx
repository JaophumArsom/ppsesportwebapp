import { CalendarDays, Users } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { scopeLabel, tierMeta } from "@/data/achievement-meta";
import type { Achievement } from "@/types";
import { formatDate } from "@/lib/utils";

export function AchievementCard({
  achievement,
  className = "",
  compact = false,
}: {
  achievement: Achievement;
  className?: string;
  compact?: boolean;
}) {
  const tier = tierMeta[achievement.tier];

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-soft transition-all duration-400 hover:-translate-y-1 hover:border-ink/15 hover:shadow-lift ${className}`}
    >
      <div className="relative">
        <Media
          src={achievement.image}
          alt={`${achievement.tournament} — ${achievement.rank}`}
          ratio={compact ? "wide" : "landscape"}
          tone={achievement.game === "rov" ? "pink" : "sky"}
          label="ภาพถ้วยรางวัล / เวที"
          imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent"
          aria-hidden="true"
        />

        {/* ป้ายอันดับ — จุดเด่นของการ์ด */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] ring-1 ${tier.className}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} />
            {achievement.rank}
          </div>
          <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
            {tier.label}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ring-1 ${
              achievement.game === "rov"
                ? "bg-pink-soft text-[#A8447A] ring-pink/50"
                : "bg-sky-soft text-[#1B6E96] ring-sky/60"
            }`}
          >
            {achievement.game === "rov" ? "RoV" : "Free Fire"}
          </span>
          <span className="rounded-full bg-ink/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-mute">
            {scopeLabel[achievement.scope]}
          </span>
        </div>

        <h3 className="font-display text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-ink-soft">
          {achievement.tournament}
        </h3>

        <dl className="mt-auto grid gap-1.5 border-t border-ink/[0.07] pt-3 text-[12.5px] text-ink-mute">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-ink-mute" />
            <dt className="sr-only">วันที่</dt>
            <dd>
              <time dateTime={achievement.date}>{formatDate(achievement.date)}</time>
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-ink-mute" />
            <dt className="sr-only">ทีม</dt>
            <dd className="truncate">{achievement.teamName}</dd>
          </div>
        </dl>


      </div>
    </article>
  );
}
