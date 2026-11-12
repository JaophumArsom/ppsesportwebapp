import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Quote,
  Target,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { Button, SectionHeading } from "@/components/ui/Primitives";
import { Media } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { GameLogo } from "@/components/games/GameLogo";
import { MemberCard } from "@/components/members/MemberCard";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { games } from "@/data/games-static";
import {
  getAchievementsByGame,
  getGame,
  getGames,
  getMembers,
} from "@/lib/collections";
import { isPlayerMember, isStaffMember } from "@/lib/profile";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return games.map((game) => ({ slug: game.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) {
    return { title: "ไม่พบสายเกม" };
  }

  return {
    title: game.fullName,
    description: `${game.fullName} — ${game.tagline}. ${game.description}`,
    openGraph: {
      title: `${game.fullName} · PPSESPORT`,
      description: game.description,
    },
  };
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const game = await getGame(slug);

  if (!game) notFound();

  const roster = (await getMembers()).filter((m) => m.game === game.slug);

  // แยกตามประเภทผู้เล่น: นักกีฬาในสนาม กับ โค้ช/ผู้ควบคุมทีม
  const players = roster.filter((member) => isPlayerMember(member));
  const support = roster.filter((member) => isStaffMember(member));
  const results = await getAchievementsByGame(game.slug);
  const otherGame = (await getGames()).find((g) => g.slug !== game.slug);


  return (
    <>
      {/* --------------------------------- Hero ------------------------------- */}
      <section className="relative overflow-hidden bg-brand-radial pb-16 pt-14 sm:pb-20 sm:pt-20">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_30%_10%,black,transparent)]"
          aria-hidden="true"
        />

        <div className="container-page">
          <Link
            href="/games"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink-mute transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            ทุกสายเกม
          </Link>

          <div className="mt-8 grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <div className="flex items-center gap-4">
                <GameLogo game={game} size="lg" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-ink-mute">
                    {game.code}
                  </p>
                  <h1 className="font-display text-[clamp(1.9rem,5vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink">
                    {game.name}
                  </h1>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-deep">
                    {game.tagline}
                  </p>
                </div>
              </div>

              <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ink-mute sm:text-base">
                {game.description}
              </p>

              <div className="mt-7 flex flex-wrap gap-1.5">
                {game.roles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-ink-soft ring-1 ring-ink/[0.08]"
                  >
                    {role}
                  </span>
                ))}
              </div>

              <dl className="mt-9 grid max-w-lg grid-cols-3 gap-4 border-t border-ink/[0.08] pt-7">
                {[
                  { icon: Users, label: "สมาชิก", value: roster.length },
                  { icon: Target, label: "นักกีฬา", value: players.length },
                  { icon: UserCheck, label: "โค้ช/ผู้ควบคุมทีม", value: support.length },
                  { icon: Trophy, label: "ผลแข่งขัน", value: results.length },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-mute">
                      <stat.icon className="h-3.5 w-3.5" />
                      {stat.label}
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-extrabold text-ink">
                      {String(stat.value).padStart(2, "0")}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#roster" icon={<Users className="h-4 w-4" />}>
                  ดูรายชื่อนักกีฬา
                </Button>
                <Button
                  href="#results"
                  variant="outline"
                  icon={<Trophy className="h-4 w-4" />}
                >
                  ดูผลการแข่งขัน
                </Button>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                <div
                  className={`absolute -inset-5 -z-10 rounded-[2.5rem] blur-2xl ${
                    game.accent === "pink" ? "bg-pink/40" : "bg-sky/50"
                  }`}
                  aria-hidden="true"
                />
                <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-lift">
                  <Media
                    src={game.cover}
                    alt={`${game.fullName} — ภาพประจำเกมตัวอย่าง`}
                    ratio="landscape"
                    tone={game.accent === "pink" ? "pink" : "sky"}
                    label={`${game.fullName} cover`}
                    priority
                    className="rounded-[1.5rem]"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* -------------------------------- Roster ------------------------------ */}
      <section id="roster" className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="รายชื่อนักกีฬา"
              title={
                <>
                  ทีม <span className="text-gradient-soft">{game.name}</span>
                </>
              }
              description="รายชื่อนักกีฬา โค้ช และผู้จัดการทีมของสายเกมนี้"
              align="left"
            />
          </Reveal>

          <Reveal delay={0.06}>
            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-ink/[0.08] bg-sky-soft/50 px-5 py-4 sm:flex-row sm:items-center sm:gap-3">
              <Gamepad2 className="h-4 w-4 shrink-0 text-sky-deep" />
              <p className="text-[13px] leading-relaxed text-ink-soft">
                ตำแหน่งที่สายเกมนี้คัดเลือกไว้:{" "}
                <span className="font-semibold text-ink">
                  {game.roles.join(" · ")}
                </span>
              </p>
            </div>
          </Reveal>

          <RevealGroup
            className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.06}
          >
            {roster.map((member) => (
              <RevealItem key={member.slug}>
                <MemberCard member={member} />
              </RevealItem>
            ))}
          </RevealGroup>

          {support.length ? (
            <Reveal delay={0.08}>
              <div className="mt-12">
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink-mute">
                  โค้ชและผู้ควบคุมทีม
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {support.map((member) => (
                    <Link
                      key={member.slug}
                      href={`/members/${member.slug}`}
                      className="group flex items-center gap-4 rounded-2xl border border-ink/[0.08] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
                    >
                      <Media
                        src={member.image}
                        alt={`${member.realName} — ภาพตัวอย่าง`}
                        ratio="square"
                        tone="sky"
                        compact
                        className="h-14 w-14 shrink-0 rounded-xl"
                        sizes="56px"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-bold text-ink">
                          {member.realName}
                        </p>
                        <p className="truncate text-[12px] font-medium uppercase tracking-[0.08em] text-ink-mute">
                          {member.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      {/* ------------------------------- Results ------------------------------ */}
      <section
        id="results"
        className="relative overflow-hidden bg-sky-soft/45 py-20 lg:py-24"
      >
        <div className="container-page">
          <Reveal>
            <SectionHeading
              eyebrow="ผลการแข่งขัน"
              title={
                <>
                  ตู้ปั้นรางวัล{" "}
                  <span className="text-gradient-soft">{game.name}</span>
                </>
              }
              description="ผลงานการแข่งขันของสายเกมนี้"
            />
          </Reveal>

          {results.length ? (
            <RevealGroup
              className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.07}
            >
              {results.map((achievement) => (
                <RevealItem key={achievement.id}>
                  <AchievementCard achievement={achievement} />
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal delay={0.06}>
              <p className="mt-10 text-center text-sm text-ink-mute">
                ยังไม่มีข้อมูลผลการแข่งขันของสายเกมนี้
              </p>
            </Reveal>
          )}

          <Reveal delay={0.08}>
            <div className="mt-10 flex justify-center">
              <Button
                href="/achievements"
                variant="outline"
                icon={<ArrowRight className="h-4 w-4" />}
              >
                ผลการแข่งขันทั้งหมด
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------- Next ------------------------------- */}
      <section className="bg-white pb-16">
        <div className="container-page">

          {otherGame ? (
            <Reveal delay={0.06}>
              <Link
                href={`/games/${otherGame.slug}`}
                className="group mt-8 flex flex-col gap-4 rounded-2xl border border-ink/[0.08] bg-white p-6 transition-all duration-400 hover:-translate-y-1 hover:shadow-lift sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <GameLogo game={otherGame} size="md" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-mute">
                      สายเกมถัดไป
                    </p>
                    <p className="font-display text-lg font-extrabold text-ink">
                      {otherGame.fullName}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                  ดูรายชื่อนักกีฬา
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ) : null}
        </div>
      </section>
    </>
  );
}
