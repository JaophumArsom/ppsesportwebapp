import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AchievementsExplorer } from "@/components/achievements/AchievementsExplorer";
import { getAchievements } from "@/lib/collections";

export const metadata: Metadata = {
  title: "ผลงาน",
  description: "ผลงาน อันดับ และรางวัลการแข่งขันของ PPSESPORT",
};

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const achievements = await getAchievements();
  const years = Array.from(
    new Set(achievements.map((a) => new Date(a.date).getFullYear())),
  ).sort((a, b) => b - a);

  const summary = {
    total: achievements.length,
    champions: achievements.filter((a) => a.tier === "champion").length,
    tournaments: new Set(achievements.map((a) => a.tournament)).size,
    years: years.length,
  };

  return (
    <>
      <PageHeader
        eyebrow="ตู้ปั้นรางวัล"
        title={
          <>
            ผลงาน{" "}
            <span className="text-gradient-soft">ของเรา</span>
          </>
        }
        description="ผลงาน อันดับ และรางวัลการแข่งขันของ PPSESPORT กรองข้อมูลได้ตามเกมและปีที่แข่งขัน"
        meta={[
          { label: "ผลการแข่งขัน", value: String(summary.total).padStart(2, "0") },
          { label: "แชมป์", value: String(summary.champions).padStart(2, "0") },
          { label: "รายการ", value: String(summary.tournaments).padStart(2, "0") },
        ]}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="sr-only">ผลการแข่งขันทั้งหมดของ PPSESPORT</h2>
          <AchievementsExplorer achievements={achievements} years={years} />
        </div>
      </section>
    </>
  );
}
