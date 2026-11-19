/**
 * ============================================================================
 *  SITE / NAVIGATION / SEO CONFIG
 * ----------------------------------------------------------------------------
 *  Single source of truth for brand strings, navigation and social channels.
 * ============================================================================
 */

export const site = {
  name: "PPS Esports",
  school: "Phichit Pittayakom School",
  schoolThai: "โรงเรียนพิจิตรพิทยาคม",
  tagline: "จากห้องเรียนสู่สนามแข่ง",
  taglineThai: "ปีการศึกษา 2569",
  description:
    "PPS Esports เป็นสังกัดอีสปอร์ตของโรงเรียนพิจิตรพิทยาคม รวบรวมรายชื่อนักกีฬา ทีมงาน และผลงานการแข่งขันของสังกัด",
  locale: "th_TH",
  url: "https://ppsesport.example.com",
} as const;

/** โลโก้ทีม PPS Esports — ค่าตกลงสำหรับจุดที่ยังอ่านข้อมูลจาก Admin ไม่ได้ */
export const teamLogoPath = "/images/branding/team-logo.png";

export interface NavItem {
  label: string;
  href: string;
  /** External links open in a new tab. */
  external?: boolean;
}

/** เมนูหลักของเว็บไซต์ */
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
 * ปุ่มติดต่อในเมนู — เปิดใช้งานเมื่อมีช่องทางติดต่อจริง
 * ตั้งค่าใน Navbar ผ่าน SHOW_CONTACT_CTA
 */
export const SHOW_CONTACT_CTA = false;

export const cta = {
  label: "ติดต่อเรา",
  href: "mailto:ppsesport@example.com",
  sublabel: "ppsesport@example.com",
} as const;
