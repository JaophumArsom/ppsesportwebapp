import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminPanel } from "@/components/admin/AdminPanel";

export const metadata: Metadata = {
  title: "จัดการข้อมูล",
  description: "แผงควบคุมข้อมูลทั้งหมดของเว็บไซต์ PPSESPORT",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/**
 * หน้าจัดการข้อมูลของเว็บไซต์
 * ⚠️ ยังไม่มีระบบล็อกอิน — ใช้งานบนเครื่องของทีมงานเท่านั้น
 */
export default function AdminPage() {
  return (
    <>
      <PageHeader
        eyebrow="Admin"
        title={
          <>
            จัดการ{" "}
            <span className="text-gradient-soft">ข้อมูลเว็บไซต์</span>
          </>
        }
        description="เพิ่ม แก้ไข และลบข้อมูลทุกส่วนได้จากที่เดียว — ข้อมูลจะถูกบันทึกลงไฟล์ในโฟลเดอร์ data/ และแสดงบนเว็บทันที"
      />

      <section className="bg-white py-14 lg:py-16">
        <div className="container-page">
          <AdminPanel />
        </div>
      </section>
    </>
  );
}
