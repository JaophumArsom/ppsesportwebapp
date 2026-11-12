import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Gamepad2,
  GraduationCap,
  Hash,
  Sparkles,
  Trophy,
  UserCheck,
  UserRound,
} from "lucide-react";
import { Button, SectionHeading } from "@/components/ui/Primitives";
import { Media } from "@/components/ui/Media";
import { InstagramIcon } from "@/components/ui/SocialIcons";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MemberCard } from "@/components/members/MemberCard";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { categoryLabel, rosterTypeLabel } from "@/data/member-meta";
import { getGameLabel } from "@/data/game-meta";
import { getMember, getMembers } from "@/lib/collections";
import { getAchievementsByGame } from "@/lib/collections";
import {
  instagramHandle,
  instagramUrl,
  isPublished,
  visibleAge,
  visibleGrade,
  visibleInstagram,
  visibleNickname,
} from "@/lib/profile";
import { site } from "@/data/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMember(slug);

  if (!member) return { title: "ไม่พบสมาชิก" };

  const name = member.inGameName && member.inGameName !== "—"
    ? `${member.realName} (${member.inGameName})`
    : member.realName;

  return {
    title: `${name} — ${site.name}`,
    description: `${member.realName} · ${member.role} — โปรไฟล์นักกีฬา PPSESPORT`,
  };
}

export default async function MemberProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const member = await getMember(slug);

  if (!member) notFound();

  /* ------------------- ยังไม่เผยแพร่: ไม่แสดงข้อมูลส่วนตัว ------------------- */
  if (!isPublished(member)) {
    return (
      <section className="relative overflow-hidden bg-brand-radial py-28">
        <div className="container-page flex flex-col items-center text-center">
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink shadow-soft">
            <UserRound className="h-6 w-6" />
          </span>
          <h1 className="mt-6 text-2xl font-extrabold text-ink sm:text-3xl">
            โปรไฟล์นี้ยังไม่เผยแพร่
          </h1>
          <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-mute">
            ข้อมูลนี้อยู่ระหว่างการอนุมัติจากทีมงาน หากต้องการทราบรายละเอียดเพิ่มเติม
            สามารถติดต่อผ่านช่องทางของสังกัดได้
          </p>
          <Button href="/members" className="mt-8" variant="outline" size="lg">
            ดูสมาชิกทั้งหมด
          </Button>
        </div>
      </section>
    );
  }

  const related = (await getMembers())
    .filter((m) => m.slug !== member.slug && m.category === member.category)
    .slice(0, 4);

  const results = member.game
    ? (await getAchievementsByGame(member.game)).slice(0, 3)
    : [];

  /* ------------------------- ข้อมูลที่อนุญาตให้เผยแพร่ ------------------------- */
  const nickname = visibleNickname(member);
  const rosterType = member.rosterType ?? null;
  const age = visibleAge(member);
  const grade = visibleGrade(member);
  const instagram = visibleInstagram(member);

  const metaChips = [
    nickname ? { icon: UserRound, label: `ชื่อเล่น ${nickname}` } : null,
    rosterType
      ? { icon: UserCheck, label: rosterTypeLabel[rosterType] }
      : null,
    grade ? { icon: GraduationCap, label: `ชั้น ${grade}` } : null,
    age !== null ? { icon: Hash, label: `อายุ ${age}` } : null,
    member.game
      ? { icon: Gamepad2, label: getGameLabel(member.game) }
      : null,
    { icon: Trophy, label: member.role },
  ].filter(Boolean) as { icon: typeof Trophy; label: string }[];

  return (
    <>
      {/* =============================== PROFILE =============================== */}
      <section className="relative isolate overflow-hidden bg-brand-radial pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pb-24 lg:pt-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-[0.32] [mask-image:radial-gradient(70%_60%_at_30%_20%,black,transparent)]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-40 top-10 -z-10 h-[30rem] w-[30rem] rounded-full bg-pink/40 blur-[120px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[26rem] w-[26rem] rounded-full bg-sky/50 blur-[120px]"
          aria-hidden="true"
        />

        <div className="container-page">
          <Link
            href="/members"
            className="group inline-flex items-center gap-2 text-[13px] font-semibold text-ink-mute transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            สมาชิกทั้งหมด
          </Link>

          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-14">
            {/* ----------------------------- Photo ----------------------------- */}
            <Reveal direction="left">
              <div className="group relative mx-auto w-full max-w-[20rem] sm:max-w-[22rem] lg:sticky lg:top-28 lg:max-w-none">
                <div
                  className="absolute -inset-3 -z-10 rounded-[2.75rem] bg-gradient-to-br from-pink/60 via-white to-sky/60 blur-2xl transition-transform duration-700 group-hover:scale-[1.03]"
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden rounded-[2.25rem] border border-white/80 bg-white p-2 shadow-lift">
                  <Media
                    src={member.image}
                    alt={`${member.realName} — ภาพโปรไฟล์นักกีฬา`}
                    ratio="portrait"
                    tone={member.game === "freefire" ? "sky" : "pink"}
                    compact
                    priority
                    className="rounded-[1.75rem]"
                    sizes="(max-width: 1024px) 90vw, 400px"
                  />

                  {/* ป้ายสายเกมลอยบนรูป */}
                  {member.game ? (
                    <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-ink shadow-soft backdrop-blur">
                      <Gamepad2 className="h-3.5 w-3.5 text-pink-deep" />
                      {member.game === "rov" ? "RoV" : "Free Fire"}
                    </span>
                  ) : null}

                  {/* ป้ายหมวดหมู่มุมขวาล่าง */}
                  <span className="absolute bottom-5 right-5 rounded-full bg-ink/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur">
                    {categoryLabel[member.category]}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* ---------------------------- Identity ---------------------------- */}
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-6">
                {/* Eyebrow */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft shadow-soft backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-pink-deep to-sky-deep" />
                    {site.name}
                  </span>
                  {member.game ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-soft px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#1B6E96] ring-1 ring-sky/50">
                      {getGameLabel(member.game)}
                    </span>
                  ) : null}
                </div>

                {/* ชื่อเล่นในเกม — จุดเด่นหลัก */}
                <div>
                  {/* ชื่อจริง — หัวเรื่องหลักของหน้า */}
                  <h1 className="break-words font-display text-[clamp(2.4rem,7vw,4.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink">
                    {member.realName}
                  </h1>

                  {/* ชื่อในเกม — รองลงมา แต่ยังโดดเด่นด้วยสีไล่ */}
                  {member.inGameName && member.inGameName !== "—" ? (
                    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <span className="font-display text-[10px] font-bold uppercase tracking-[0.28em] text-ink-mute">
                        In-game Name
                      </span>
                      <h2 className="break-words font-display text-[clamp(1.5rem,3.8vw,2.35rem)] font-extrabold leading-tight tracking-[-0.02em] text-gradient-soft">
                        {member.inGameName}
                      </h2>
                    </div>
                  ) : null}

                </div>

                {/* Chips */}
                <div className="flex flex-wrap gap-2.5">
                  {metaChips.map((chip) => (
                    <span
                      key={chip.label}
                      className="group inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white/85 px-3.5 py-2 text-[13px] font-semibold text-ink-soft shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:text-ink"
                    >
                      <chip.icon className="h-4 w-4 text-sky-deep transition-transform duration-300 group-hover:scale-110" />
                      {chip.label}
                    </span>
                  ))}
                </div>

                {/* Instagram */}
                {instagram ? (
                  <a
                    href={instagramUrl(instagram)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex w-fit items-center gap-3 rounded-full bg-gradient-to-r from-pink to-sky px-5 py-3 text-[13.5px] font-bold text-ink shadow-[0_12px_30px_-16px_rgba(46,155,209,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-18px_rgba(46,155,209,0.9)]"
                  >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                      <InstagramIcon className="h-4 w-4" />
                    </span>
                    {instagramHandle(instagram)}
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ) : null}

                {/* จุดเด่นของผู้เล่น */}
                {member.highlights.length ? (
                  <div className="group rounded-2xl border border-ink/[0.08] bg-white/80 p-6 shadow-soft backdrop-blur transition-all duration-400 hover:border-ink/15 hover:shadow-lift">
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-mute">
                      จุดเด่น
                    </p>
                    <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                      {member.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="flex items-start gap-2.5 rounded-xl bg-sky-soft/60 px-4 py-3 text-[13px] leading-relaxed text-ink-soft transition-colors duration-300 hover:bg-pink-soft/70"
                        >
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pink-deep" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================= DIGITAL ARCHIVE ========================= */}
      {results.length ? (
        <section className="relative overflow-hidden bg-sky-soft/45 py-18 lg:py-20">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="Digital Archive"
                title={
                  <>
                    ผลการแข่งขันของ{" "}
                    <span className="text-gradient-soft">{member.inGameName !== "—" ? member.inGameName : member.realName}</span>
                  </>
                }
                description="ผลงานและรางวัลที่สังกัดคว้าได้ในสายเกมนี้"
                align="left"
              />
            </Reveal>

            <RevealGroup
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.07}
            >
              {results.map((achievement) => (
                <RevealItem key={achievement.id}>
                  <AchievementCard achievement={achievement} compact />
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.08}>
              <div className="mt-8">
                <Button
                  href="/achievements"
                  variant="outline"
                  icon={<Trophy className="h-4 w-4" />}
                >
                  ดูผลการแข่งขันทั้งหมด
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ========================= สมาชิกคนอื่นในทีม ========================= */}
      {related.length ? (
        <section className="bg-white py-18 lg:py-20">
          <div className="container-page">
            <Reveal>
              <SectionHeading
                eyebrow="คนในกลุ่มเดียวกัน"
                title={
                  <>
                    เพิ่มเติมจาก{" "}
                    <span className="text-gradient-soft">
                      {categoryLabel[member.category]}
                    </span>
                  </>
                }
                align="left"
              />
            </Reveal>

            <RevealGroup
              className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
              stagger={0.06}
            >
              {related.map((item) => (
                <RevealItem key={item.slug}>
                  <MemberCard member={item} />
                </RevealItem>
              ))}
            </RevealGroup>

            <Reveal delay={0.08}>
              <div className="mt-8">
                <Link
                  href="/members"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-ink"
                >
                  ดูสมาชิกทั้งหมด
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
    </>
  );
}
