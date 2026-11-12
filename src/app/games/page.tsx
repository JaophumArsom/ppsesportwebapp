import type { Metadata } from "next";
import { ArrowRight, Gamepad2, Target, UserCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Primitives";
import { Media } from "@/components/ui/Media";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

import { GameLogo } from "@/components/games/GameLogo";
import { games } from "@/data/games-static";
import { getGames } from "@/lib/collections";
import { getMembers } from "@/lib/collections";
import { isPlayerMember, isStaffMember } from "@/lib/profile";
import { getAchievementsByGame } from "@/lib/collections";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "สายเกม",
  description: `สองสายเกมของ ${site.name} — อารีน่า ออฟ เวเลอร์ (RoV) และฟรีไฟร์ (Free Fire)`,
};

export const dynamic = "force-dynamic";

export default async function GamesPage() {
  const allMembers = await getMembers();
  const gameList = await getGames();
  const resultsByGame = {
    rov: await getAchievementsByGame("rov"),
    freefire: await getAchievementsByGame("freefire"),
  };
  return (
    <>
      <PageHeader
        eyebrow="สายเกมของเรา"
        title={
          <>
            เกมที่เรา{" "}
            <span className="text-gradient-soft">แข่งขัน</span>
          </>
        }
        description="ทุกสายเกมมีโครงสร้างทีม ตารางซ้อม และเป้าหมายการแข่งขันของตัวเอง เลือกสายเพื่อดูรายละเอียดเพิ่มเติม"
        meta={[
          { label: "สายเกม", value: String(gameList.length).padStart(2, "0") },
          {
            label: "เกม",
            value: games.map((g) => g.name.split(" ")[0]).join(" · "),
          },
        ]}
      />

      <section className="bg-white py-16 lg:py-24">
        <div className="container-page flex flex-col gap-16 lg:gap-24">
          {gameList.map((game, index) => {
            const roster = allMembers.filter((m) => m.game === game.slug);
            const players = roster.filter((m) => isPlayerMember(m));
            const staff = roster.filter((m) => isStaffMember(m));
            const results = resultsByGame[game.slug];

            return (
              <div
                key={game.slug}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14"
              >
                {/* Visual */}
                <Reveal direction={index % 2 === 0 ? "left" : "right"}>
                  <div className="relative">
                    <div
                      className={`absolute -inset-5 -z-10 rounded-[2.5rem] blur-2xl ${
                        game.accent === "pink"
                          ? "bg-pink/35"
                          : "bg-sky/45"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-2 shadow-lift">
                      <Media
                        src={game.cover}
                        alt={`${game.fullName} cover — ภาพตัวอย่าง`}
                        ratio="landscape"
                        tone={game.accent === "pink" ? "pink" : "sky"}
                        label={`${game.fullName} cover`}
                        priority={index === 0}
                        className="rounded-[1.5rem]"
                      />
                    </div>

                    <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lift backdrop-blur">
                      <GameLogo game={game} size="sm" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-mute">
                          {game.code}
                        </p>
                        <p className="font-display text-sm font-extrabold text-ink">
                          {game.tagline}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>

                {/* Copy */}
                <div>
                  <Reveal delay={0.05}>
                    <div className="flex items-center gap-3">
                      <GameLogo game={game} size="lg" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-ink-mute">
                          {game.code}
                        </p>
                        <h2 className="font-display text-2xl font-extrabold text-ink sm:text-3xl">
                          {game.name}
                        </h2>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal delay={0.1}>
                    <p className="mt-6 text-[15px] leading-relaxed text-ink-mute">
                      {game.description}
                    </p>
                  </Reveal>

                  <Reveal delay={0.14}>
                    <div className="mt-6 flex flex-wrap gap-1.5">
                      {game.roles.map((role) => (
                        <span
                          key={role}
                          className="rounded-full bg-ink/[0.045] px-3 py-1 text-[11px] font-semibold text-ink-soft"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </Reveal>

                  <RevealGroup className="mt-8 grid grid-cols-3 gap-3" stagger={0.07}>
                    {[
                      { icon: Users, value: roster.length, label: "สมาชิก" },
                      {
                        icon: Target,
                        value: players.length,
                        label: "นักกีฬา",
                      },
                      {
                        icon: UserCheck,
                        value: staff.length,
                        label: "โค้ช/ผู้ควบคุมทีม",
                      },
                      {
                        icon: Gamepad2,
                        value: results.length,
                        label: "ผลแข่งขัน",
                      },
                    ].map((stat) => (
                      <RevealItem key={stat.label}>
                        <div className="rounded-2xl border border-ink/[0.08] bg-white px-4 py-4 text-center shadow-soft">
                          <stat.icon className="mx-auto h-4 w-4 text-ink-mute" />
                          <p className="mt-2 font-display text-2xl font-extrabold text-ink">
                            {String(stat.value).padStart(2, "0")}
                          </p>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-mute">
                            {stat.label}
                          </p>
                        </div>
                      </RevealItem>
                    ))}
                  </RevealGroup>

                  <Reveal delay={0.12}>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <Button
                        href={`/games/${game.slug}`}
                        icon={<ArrowRight className="h-4 w-4" />}
                      >
                        ดูรายชื่อนักกีฬา
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </>
  );
}
