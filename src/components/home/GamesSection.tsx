import Link from "next/link";
import { ArrowRight, Trophy, Users } from "lucide-react";
import { Badge, SectionHeading } from "@/components/ui/Primitives";
import { Media } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

import { GameLogo } from "@/components/games/GameLogo";

import { getGames, getMembers } from "@/lib/collections";
import { getAchievementsByGame } from "@/lib/collections";
import { cn } from "@/lib/utils";

export async function GamesSection() {
  const allMembers = await getMembers();
  const games = await getGames();
  const resultsByGame = {
    rov: await getAchievementsByGame("rov"),
    freefire: await getAchievementsByGame("freefire"),
  };
  return (
    <section
      id="games"
      className="relative overflow-hidden bg-sky-soft/45 py-20 lg:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-30 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Game type"
            title={
              <>
                แต่ละ{" "}
                <span className="text-gradient-soft">สายเกม</span>
              </>
            }
            description=""
            action={
              <Link
                href="/games"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-ink-soft"
              >
                ทุกสายเกม
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-white transition-all duration-300 group-hover:border-ink/25 group-hover:bg-gradient-to-br group-hover:from-pink-soft group-hover:to-sky-soft">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            }
          />
        </Reveal>

        <div className="mt-14 grid gap-7 lg:grid-cols-2">
          {games.map((game, index) => {
            const roster = allMembers.filter((m) => m.game === game.slug);
            const results = resultsByGame[game.slug];
            const best = results.find((r) => r.tier === "champion");

            return (
              <Reveal key={game.slug} delay={index * 0.1} amount={0.15}>
                <article
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-ink/[0.08] bg-white shadow-soft transition-all duration-500",
                    "hover:-translate-y-1.5 hover:border-ink/15 hover:shadow-lift",
                  )}
                >
                  {/* Cover */}
                  <div className="relative overflow-hidden">
                    <Media
                      src={game.cover}
                      alt={`${game.fullName} cover — ภาพตัวอย่าง`}
                      ratio="wide"
                      tone={game.accent === "pink" ? "pink" : "sky"}
                      label={`${game.fullName} cover`}
                      priority={index === 0}
                      imgClassName="transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 via-ink/5 to-transparent"
                      aria-hidden="true"
                    />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 sm:p-6">
                      <div className="flex items-center gap-3">
                        <GameLogo game={game} size="md" className="bg-white" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white">
                            {game.code}
                          </p>
                          <p className="font-display text-lg font-extrabold leading-tight text-white sm:text-xl">
                            {game.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        tone="outline"
                        className="bg-white/90 text-ink-soft ring-ink/10 backdrop-blur"
                      >
                        {game.tagline}
                      </Badge>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
                    <p className="text-[14px] leading-relaxed text-ink-mute">
                      {game.description}
                    </p>

                    {/* Roles */}
                    <div className="flex flex-wrap gap-1.5">
                      {game.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-ink/[0.045] px-2.5 py-1 text-[11px] font-semibold text-ink-soft"
                        >
                          {role}
                        </span>
                      ))}
                    </div>

                    {/* Roster + results */}
                    <div className="mt-auto grid gap-4 border-t border-ink/[0.07] pt-5 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-soft text-[#1B6E96]">
                          <Users className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-mute">
                            จำนวนนักกีฬา
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-ink">
                            {roster.length} คน
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-soft text-[#A8447A]">
                          <Trophy className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-mute">
                            ผลงานที่ดีที่สุด
                          </p>
                          <p className="mt-0.5 text-sm font-semibold text-ink">
                            {best ? best.rank : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <Link
                        href={`/games/${game.slug}`}
                        className="group/btn inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#1b3767]"
                      >
                        ดูรายชื่อนักกีฬา
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* ------------------------------ หลักการทำงาน ------------------------------ */}
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-3" stagger={0.08}>
          {[
            {
              title: "ซ้อมเป็นระบบ",
              desc: "ตารางซ้อมประจำสัปดาห์และรีวิวเกมหลังจบการแข่งขัน",
            },
            {
              title: "พัฒนานักกีฬา",
              desc: "เส้นทางพัฒนาที่ชัดเจนตั้งแต่ทีมสำรองจนถึงตัวหลัก",
            },
            {
              title: "ภูมิใจในโรงเรียน",
              desc: "ทุกเกมที่ลงสนามคือชื่อของโรงเรียนพิจิตรพิทยาคม",
            },
          ].map((item) => (
            <RevealItem key={item.title}>
              <div className="rounded-2xl border border-ink/[0.07] bg-white/80 p-5 backdrop-blur">
                <h3 className="font-display text-[15px] font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-mute">
                  {item.desc}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
