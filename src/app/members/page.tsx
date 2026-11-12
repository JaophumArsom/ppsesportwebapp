import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MembersExplorer } from "@/components/members/MembersExplorer";
import { memberCategories } from "@/data/member-meta";
import { getMembers } from "@/lib/collections";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "สมาชิก",
  description: `ผู้บริหาร นักกีฬา โค้ช ผู้จัดการทีม และทีมงานของ ${site.name}`,
};

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <>
      <PageHeader
        eyebrow="คนที่อยู่เบื้องหลังทีม"
        title={
          <>
            พบกับ{" "}
            <span className="text-gradient-soft">ทีมของเรา</span>
          </>
        }
        description="ทุกคนในสังกัด — ตั้งแต่ผู้บริหาร นักกีฬา โค้ช ผู้จัดการทีม"
        meta={[
          { label: "สมาชิกทั้งหมด", value: String(members.length).padStart(2, "0") },
          {
            label: "กลุ่มงาน",
            value: String(memberCategories.length).padStart(2, "0"),
          },
        ]}
      />

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <h2 className="sr-only">รายชื่อสมาชิกทั้งหมดของ PPS Esport</h2>
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-2xl bg-sky-soft/60" />
            }
          >
            <MembersExplorer members={members} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
