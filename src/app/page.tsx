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
        images={hero.images}
      />
      <GamesSection />
      <AchievementsSection />
      <MembersSection />
    </>
  );
}
