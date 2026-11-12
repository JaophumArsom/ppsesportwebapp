import type { GameId } from "@/types";

/**
 * ============================================================================
 *  SITE / NAVIGATION / SEO CONFIG
 * ----------------------------------------------------------------------------
 *  Single source of truth for brand strings, navigation and social channels.
 * ============================================================================
 */

export const site = {
  name: "PPSESPORT",
  shortName: "PPS",
  school: "Phichit Pittayakom School",
  schoolThai: "โรงเรียนพิจิตรพิทยาคม",
  tagline: "PPS Esports GEN 1",
  taglineThai: "ปีการศึกษา 2569",
  description:
    "PPSESPORT คือสังกัดอีสปอร์ตของโรงเรียนพิจิตรพิทยาคม จัดทำเว็บไซต์เพื่อนำเสนอองค์กร ผลงานการแข่งขัน นักกีฬา ทีมงาน และบุคคลที่มีส่วนเกี่ยวข้อง",
  locale: "th_TH",
  url: "https://ppsesport.example.com",
} as const;

export interface NavItem {
  label: string;
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
}

/**
 * เมนูหลักของเว็บไซต์ (ภาษาไทย)
 * หมายเหตุ: หมวด "About Us" ถูกนำออกแล้ว — หากต้องการกลับมา
 * ให้เพิ่ม { label: "เกี่ยวกับเรา", href: "/about" } ในตรงนี้
 */
export const navigation: NavItem[] = [
  { label: "หน้าแรก", href: "/" },
  { label: "สายเกม", href: "/games" },
  { label: "ผลงาน", href: "/achievements" },
  { label: "สมาชิก", href: "/members" },
];

/** เมนูส่วนล่างของ Footer (ภาษาไทย) */
export const footerNavigation: NavItem[] = [
  { label: "สายเกม", href: "/games" },
  { label: "ผลงาน", href: "/achievements" },
  { label: "สมาชิก", href: "/members" },
];

/** ชื่อสายเกมภาษาไทยสำหรับ Footer */
export const footerDivisions = [
  { label: "Arena of Valor", href: "/games/rov" },
  { label: "Free Fire", href: "/games/freefire" },
];

/**
 * ช่องทางโซเชียลของสังกัด — ปัจจุบันเปิดใช้เฉพาะ Instagram
 * เพิ่มช่องทางอื่นในอนาคตได้ที่นี่ (Facebook / YouTube / TikTok)
 */
export const socials: NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/ppsesportsofficial?utm_source=ig_web_button_share_sheet&xtok=ZDNlZDc0MzIxNw==", external: true },
];

/**
 * ปุ่ม Call-to-action ของเว็บไซต์
 *
 * ⚠️  ปิดใช้งานชั่วคราว (ยังไม่ลบโค้ด) — เปิดใช้งานอีกครั้งโดยเปลี่ยน
 *     SHOW_CONTACT_CTA เป็น true
 */
export const SHOW_CONTACT_CTA = false;

export const cta = {
  label: "ติดต่อเรา",
  href: "mailto:ppsesport@example.com",
  sublabel: "ppsesport@example.com",
} as const;

/** อีเมลติดต่อที่แสดงใน Footer */
export const contactEmail = "";

/** สี accent ของแต่ละสายเกม (เก็บไว้เผื่อใช้ต่อ) */
export const gameAccent: Record<GameId, { text: string; bg: string; ring: string }> = {
  rov: {
    text: "text-[#A8447A]",
    bg: "bg-[#FDEBF4]",
    ring: "ring-[#F4BFD5]",
  },
  freefire: {
    text: "text-[#1B6E96]",
    bg: "bg-[#E6F4FC]",
    ring: "ring-[#A9DDF5]",
  },
};
