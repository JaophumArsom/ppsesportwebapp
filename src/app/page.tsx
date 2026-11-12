import { Hero } from "@/components/home/Hero";
import { getAchievements, getHero, getMembers } from "@/lib/collections";
import { GamesSection } from "@/components/home/GamesSection";
import { AchievementsSection } from "@/components/home/AchievementsSection";
import { MembersSection } from "@/components/home/MembersSection";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const members = await getMembers();
  const achievements = await getAchievements();
  const hero = await getHero();

  return (
    <>
      <Hero
        memberCount={members.length}
        achievementCount={achievements.length}
        tournamentCount={
          new Set(achievements.map((a) => a.tournament)).size
        }
        images={hero.images}
      />
      {/* หัวข้อ ABOUT PPSESPORT ถูกนำออกแล้ว
          หากต้องการกลับมา: เพิ่ม <AboutSection /> ระหว่าง Hero กับ GamesSection */}
      <GamesSection />
      <AchievementsSection />
      <MembersSection />
      {/* ปุ่ม CTA "ร่วมเป็นส่วนหนึ่งของ PPSESPORT" ถูกปิดใช้งานชั่วคราว
          หากต้องการกลับมา: เพิ่ม <CtaBand /> ท้ายสุด */}
    </>
  );
}
