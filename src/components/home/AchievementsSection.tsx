import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/Primitives";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { AchievementCard } from "@/components/achievements/AchievementCard";
import { getAchievements } from "@/lib/collections";

export async function AchievementsSection() {
  const achievements = await getAchievements();
  const featured = achievements.slice(0, 4);

  return (
    <section className="relative bg-white py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="Achievements and Awards"
            title={
              <>
                ผลงานและ{" "}
                <span className="text-gradient-soft">รางวัล</span>
              </>
            }
            description="ผลงานการแข่งขันและอันดับที่สังกัดคว้ามาได้ตลอดการเดินทางของ PPS Esport"
            action={
              <Link
                href="/achievements"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-ink-soft"
              >
                ดูผลการแข่งขันทั้งหมด
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/12 bg-white transition-all duration-300 group-hover:border-ink/25 group-hover:bg-gradient-to-br group-hover:from-pink-soft group-hover:to-sky-soft">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            }
          />
        </Reveal>

        <RevealGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.07}>
          {featured.map((achievement) => (
            <RevealItem key={achievement.id}>
              <AchievementCard achievement={achievement} compact />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
