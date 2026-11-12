import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { MemberCard } from "@/components/members/MemberCard";
import { memberCategories } from "@/data/member-meta";
import { getMembers } from "@/lib/collections";

export async function MembersSection() {
  const members = await getMembers();
  const featured = members.slice(0, 8);

  return (
    <section className="relative overflow-hidden bg-sky-soft/45 py-20 lg:py-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-25 [mask-image:radial-gradient(60%_50%_at_50%_100%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Team members"
            title={
              <>
                สมาชิก{" "}
                <span className="text-gradient-soft">ภายในทีม</span>
              </>
            }
            description="ผู้บริหาร นักกีฬา โค้ช ผู้จัดการทีม และทีมงานที่ทำให้ทุกการแข่งขันเกิดขึ้นได้"
            action={
              <Link
                href="/members"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-ink-soft"
              >
                สมาชิกทั้งหมด
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-white transition-all duration-300 group-hover:border-ink/25 group-hover:bg-gradient-to-br group-hover:from-pink-soft group-hover:to-sky-soft">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            }
          />
        </Reveal>

        {/* Category summary */}
        <RevealGroup className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {memberCategories.map((category) => {
            const count = members.filter(
              (member) => member.category === category.id,
            ).length;
            return (
              <RevealItem key={category.id}>
                <Link
                  href={`/members?category=${category.id}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-ink/[0.07] bg-white/85 px-5 py-4 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/15 hover:shadow-soft"
                >
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-soft to-sky-soft text-[11px] font-extrabold tracking-tight text-ink ring-1 ring-ink/[0.06]">
                      {category.short}
                    </span>
                    <span className="text-sm font-semibold text-ink">
                      {category.label}
                    </span>
                  </span>
                  <span className="font-display text-lg font-extrabold text-ink-mute transition-colors group-hover:text-ink">
                    {String(count).padStart(2, "0")}
                  </span>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <RevealGroup className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.06}>
          {featured.map((member) => (
            <RevealItem key={member.slug}>
              <MemberCard member={member} />
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center justify-center gap-2 text-center">
            <Users className="h-5 w-5 text-ink-mute" />
            <p className="text-[13px] text-ink-mute">
              แสดง {featured.length} จากทั้งหมด {members.length} ท่าน —{" "}
              <Link
                href="/members"
                className="font-semibold text-ink underline decoration-pink decoration-2 underline-offset-4 transition-colors hover:text-ink-soft"
              >
                ดูสมาชิกทั้งหมด
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
