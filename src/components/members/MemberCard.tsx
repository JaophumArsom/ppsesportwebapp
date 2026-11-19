import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { categoryLabel, rosterTypeLabel, rosterTypeTone } from "@/data/member-meta";
import type { Member } from "@/types";
import { cn } from "@/lib/utils";

export function MemberCard({
  member,
  className,
}: {
  member: Member;
  className?: string;
}) {
  const isPink = member.game === "rov";

  return (
    <Link
      href={`/members/${member.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink/[0.08] bg-white p-5 text-left shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:border-ink/15 hover:shadow-lift",
        className,
      )}
    >
      {/* Hover wash */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-soft/0 via-white/0 to-sky-soft/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4">
        <div className="relative shrink-0">
          <div
            className={cn(
              "absolute -inset-1.5 rounded-[1.4rem] bg-gradient-to-br opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100",
              isPink ? "from-pink/70" : "from-sky/70",
            )}
            aria-hidden="true"
          />
          <Media
            src={member.image}
            alt={`${member.realName} — ภาพโปรไฟล์`}
            ratio="square"
            tone={member.game === "freefire" ? "sky" : "pink"}
            compact
            className="relative h-20 w-20 rounded-2xl border border-white shadow-soft"
            sizes="80px"
          />
          <span
            className={cn(
              "absolute -bottom-1 -right-1 inline-flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold uppercase shadow-soft",
              member.game === "rov"
                ? "bg-pink text-ink"
                : member.game === "freefire"
                  ? "bg-sky text-ink"
                  : "bg-ink text-white",
            )}
            title={categoryLabel[member.category]}
          >
            {member.game === "rov" ? "R" : member.game === "freefire" ? "F" : "S"}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-[15px] font-bold leading-tight text-ink">
            {member.realName}
          </h3>
          {member.inGameName && member.inGameName !== "—" ? (
            <p className="mt-0.5 truncate font-display text-[12.5px] font-semibold text-sky-deep">
              {member.inGameName}
            </p>
          ) : null}
          <p className="mt-1.5 text-[12px] font-medium uppercase tracking-[0.08em] text-ink-mute">
            {member.role}
          </p>
          {member.rosterType ? (
            <span
              className={`mt-2 inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ring-1 ${rosterTypeTone[member.rosterType]}`}
            >
              {rosterTypeLabel[member.rosterType]}
            </span>
          ) : null}
        </div>

        <ArrowUpRight className="h-4 w-4 shrink-0 text-ink-mute/70 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink" />
      </div>

      <p className="relative mt-4 line-clamp-3 text-[13px] leading-relaxed text-ink-mute">
        {member.bio}
      </p>
    </Link>
  );
}
