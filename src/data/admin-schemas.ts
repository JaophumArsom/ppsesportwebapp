import type { GameId, MemberCategory, RankTier } from "@/types";

/**
 * ============================================================================
 *  ADMIN SCHEMAS — นิยามฟอร์มของแต่ละชนิดข้อมูลที่แก้ได้จากหน้า Admin
 * ============================================================================
 */

export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "select"
  | "date"
  | "number"
  | "toggle";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  placeholder?: string;
  hint?: string;
  required?: boolean;
  /** แสดงเต็มบรรทัด */
  full?: boolean;
  /** แสดงในฟอร์มแก้ไขด้วย */
  editable?: boolean;
  /** คำอธิบายเพิ่มเติมสำหรับช่อง toggle */
  toggleHint?: string;
}

export const memberFields: FieldDef[] = [
  {
    key: "realName",
    label: "ชื่อจริง *",
    type: "text",
    required: true,
    placeholder: "เช่น สมชาย ใจดี",
  },
  {
    key: "inGameName",
    label: "ชื่อเล่น / In-game name",
    type: "text",
    placeholder: "เช่น PPS_IGN_01",
  },
  {
    key: "role",
    label: "ตำแหน่ง",
    type: "text",
    placeholder: "เช่น นักกีฬา / Player — Mid",
  },
  {
    key: "category",
    label: "หมวดหมู่ *",
    type: "select",
    required: true,
    options: [
      { value: "organization", label: "ผู้บริหาร" },
      { value: "rov", label: "ทีม RoV" },
      { value: "freefire", label: "ทีม Free Fire" },
      { value: "staff", label: "ทีมงานสนับสนุน" },
    ],
  },
  {
    key: "game",
    label: "สายเกม",
    type: "select",
    options: [
      { value: "rov", label: "RoV" },
      { value: "freefire", label: "Free Fire" },
    ],
    hint: "ใส่เฉพาะนักกีฬา / โค้ช / ผู้จัดการทีม",
  },
  {
    key: "bio",
    label: "แนะนำตัวสั้น ๆ",
    type: "textarea",
    full: true,
    placeholder: "ประวัติย่อ / จุดเด่น",
  },
  {
    key: "image",
    label: "พาธรูปโปรไฟล์",
    type: "image",
    full: true,
    placeholder: "/images/members/rov-player-02.jpg",
    hint: "วางไฟล์ไว้ที่ public/images/members/ แล้วใส่ชื่อไฟล์",
  },

  /* ------------------------- Player Profile ------------------------- */
  {
    key: "nickname",
    label: "ชื่อเล่น",
    type: "text",
    placeholder: "เช่น เตี๋ย",
  },
  {
    key: "rosterType",
    label: "ประเภทผู้เล่นในทีม",
    type: "select",
    options: [
      { value: "starter", label: "ผู้เล่นตัวจริง" },
      { value: "substitute", label: "ผู้เล่นตัวสำรอง" },
      { value: "coach", label: "โค้ช" },
      { value: "manager", label: "ผู้ควบคุมทีม" },
    ],
  },
  {
    key: "age",
    label: "อายุ (ปี)",
    type: "number",
    placeholder: "17",
  },
  {
    key: "grade",
    label: "ระดับชั้น",
    type: "text",
    placeholder: "เช่น ม.6",
  },
  {
    key: "instagram",
    label: "Instagram",
    type: "text",
    placeholder: "ppsesport.official หรือ https://instagram.com/...",
  },

  /* --------------------------- การเผยแพร่ --------------------------- */
  {
    key: "publish",
    label: "เผยแพร่โปรไฟล์นี้",
    type: "toggle",
    full: true,
    toggleHint: "ปิดไว้ = หน้าโปรไฟล์จะไม่แสดงข้อมูลส่วนตัวบนเว็บไซต์",
  },
  {
    key: "showAge",
    label: "แสดงอายุ",
    type: "toggle",
    toggleHint: "แสดงเฉพาะเมื่อกรอกอายุและเปิดสวิตช์นี้",
  },
  {
    key: "showGrade",
    label: "แสดงระดับชั้น",
    type: "toggle",
    toggleHint: "แสดงเฉพาะเมื่อกรอกระดับชั้นและเปิดสวิตช์นี้",
  },
  {
    key: "showInstagram",
    label: "แสดง Instagram",
    type: "toggle",
    toggleHint: "แสดงเฉพาะเมื่อกรอก Instagram และเปิดสวิตช์นี้",
  },
];

export const achievementFields: FieldDef[] = [
  {
    key: "tournament",
    label: "ชื่อรายการแข่งขัน *",
    type: "text",
    required: true,
    full: true,
    placeholder: "เช่น รายการชิงภาคปี 2568",
  },
  {
    key: "game",
    label: "เกม *",
    type: "select",
    required: true,
    options: [
      { value: "rov", label: "RoV" },
      { value: "freefire", label: "Free Fire" },
    ],
  },
  {
    key: "rank",
    label: "อันดับ / รางวัล",
    type: "text",
    placeholder: "เช่น อันดับ 1",
  },
  {
    key: "tier",
    label: "ระดับป้ายอันดับ *",
    type: "select",
    required: true,
    options: [
      { value: "champion", label: "แชมป์" },
      { value: "runner-up", label: "รองชนะเลิศ" },
      { value: "third", label: "อันดับ 3" },
      { value: "top8", label: "อันดับ 8" },
      { value: "qualify", label: "เข้ารอบ" },
    ],
  },
  {
    key: "scope",
    label: "ระดับการแข่งขัน",
    type: "select",
    options: [
      { value: "school", label: "ระดับโรงเรียน" },
      { value: "province", label: "ระดับจังหวัด" },
      { value: "regional", label: "ระดับภาค" },
      { value: "national", label: "ระดับประเทศ" },
      { value: "international", label: "ระดับนานาชาติ" },
    ],
  },
  {
    key: "date",
    label: "วันที่แข่งขัน",
    type: "date",
  },
  {
    key: "teamName",
    label: "ชื่อทีมที่เข้าร่วม",
    type: "text",
    placeholder: "เช่น PPS ROV",
  },
  {
    key: "image",
    label: "พาธรูปถ้วยรางวัล / เวที",
    type: "image",
    full: true,
    placeholder: "/images/achievements/ach-002.jpg",
    hint: "วางไฟล์ไว้ที่ public/images/achievements/",
  },
  {
    key: "note",
    label: "หมายเหตุ",
    type: "textarea",
    full: true,
  },
];

export type { GameId, MemberCategory, RankTier };
