import type { GameId, MemberCategory, RosterType } from "@/types";

/**
 * ============================================================================
 *  MEMBER META — ค่าคงที่ที่เกี่ยวกับสมาชิก (ไม่มีข้อมูลส่วนตัว)
 * ----------------------------------------------------------------------------
 *  แยกจากข้อมูลสมาชิกจริง (ดู src/lib/members-store.ts) เพื่อให้
 *  Component ฝั่ง client นำไปใช้ได้โดยไม่ดึงข้อมูลทั้งหมดเข้ามา
 * ============================================================================
 */

export const memberCategories: {
  id: MemberCategory;
  label: string;
  short: string;
}[] = [
  { id: "organization", label: "ผู้บริหาร", short: "ORG" },
  { id: "rov", label: "ทีม RoV", short: "ROV" },
  { id: "freefire", label: "ทีม Free Fire", short: "FF" },
  { id: "staff", label: "ทีมงานสนับสนุน", short: "SUP" },
];

export const categoryLabel: Record<MemberCategory, string> = {
  organization: "ผู้บริหาร",
  rov: "ทีม RoV",
  freefire: "ทีม Free Fire",
  staff: "ทีมงานสนับสนุน",
};

/** ตัวเลือกสายเกมสำหรับฟอร์มในหน้า Admin */
export const memberGames: { id: GameId; label: string }[] = [
  { id: "rov", label: "RoV" },
  { id: "freefire", label: "Free Fire" },
];

/* ---------------------------- ประเภทผู้เล่นในทีม ---------------------------- */

export const rosterTypeLabel: Record<RosterType, string> = {
  starter: "ผู้เล่นตัวจริง",
  substitute: "ผู้เล่นตัวสำรอง",
  coach: "โค้ช",
  manager: "ผู้ควบคุมทีม",
};

/** โทนสีของป้ายแต่ละประเภท (ใช้กับการ์ดสมาชิก) */
export const rosterTypeTone: Record<RosterType, string> = {
  starter: "bg-pink-soft text-[#A8447A] ring-pink/50",
  substitute: "bg-sky-soft text-[#1B6E96] ring-sky/60",
  coach: "bg-[#FFF3D6] text-[#8A6200] ring-[#F0D089]",
  manager: "bg-ink/[0.06] text-ink-soft ring-ink/12",
};

export const rosterTypeOptions: { id: RosterType; label: string }[] = [
  { id: "starter", label: "ผู้เล่นตัวจริง" },
  { id: "substitute", label: "ผู้เล่นตัวสำรอง" },
  { id: "coach", label: "โค้ช" },
  { id: "manager", label: "ผู้ควบคุมทีม" },
];
