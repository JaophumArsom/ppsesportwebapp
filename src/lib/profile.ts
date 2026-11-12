import type { Member } from "@/types";

/**
 * ============================================================================
 *  PROFILE HELPERS — ตรรกะการแสดงข้อมูลส่วนตัว
 * ----------------------------------------------------------------------------
 *  กฎ: ข้อมูลจะถูกแสดงบนเว็บไซต์ก็ต่อเมื่อ
 *    1. มีการกรอกค่าไว้จริง และ
 *    2. ได้รับอนุญาตให้เผยแพร่ (สวิตช์ในหน้า Admin)
 *  ถ้าไม่ผ่านทั้งสองข้อ ระบบจะไม่แสดงข้อมูลนั้นเลย
 * ============================================================================
 */

/** โปรไฟล์นี้เผยแพร่ได้หรือไม่ (ค่าเริ่มต้น: เผยแพร่) */
export function isPublished(member: Member): boolean {
  return member.publish !== false;
}

/** อายุ — แสดงเมื่อกรอกค่าและเปิดสวิตช์อนุญาต */
export function visibleAge(member: Member): number | null {
  return member.showAge && member.age ? member.age : null;
}

/** ระดับชั้น — แสดงเมื่อกรอกค่าและเปิดสวิตช์อนุญาต */
export function visibleGrade(member: Member): string | null {
  return member.showGrade && member.grade ? member.grade : null;
}

/** Instagram — แสดงเมื่อกรอกค่าและเปิดสวิตช์อนุญาต */
export function visibleInstagram(member: Member): string | null {
  return member.showInstagram && member.instagram ? member.instagram : null;
}

/** ชื่อเล่น (แสดงได้เสมอถ้ามีค่า) */
export function visibleNickname(member: Member): string | null {
  return member.nickname?.trim() ? member.nickname.trim() : null;
}

/** แปลงค่า Instagram เป็น URL ที่กดได้ */
export function instagramUrl(value: string): string {
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://instagram.com/${raw.replace(/^@/, "")}`;
}

/** ตัดคำสำหรับแสดงเป็นชื่อผู้ใช้ใต้ปุ่ม Instagram */
export function instagramHandle(value: string): string {
  const raw = value.trim();
  if (/^https?:\/\//i.test(raw)) {
    try {
      const url = new URL(raw);
      return url.pathname.replace(/^\//, "") || raw;
    } catch {
      return raw;
    }
  }
  return `@${raw.replace(/^@/, "")}`;
}

/* --------------------------- การจำแนกสมาชิกในทีม --------------------------- */

/**
 * เป็นโค้ชหรือผู้ควบคุมทีมหรือไม่
 * ใช้ `rosterType` เป็นหลัก ถ้ายังไม่ได้กรอกจะ fallback ไปดูจากคำในตำแหน่ง
 */
export function isStaffMember(member: Member): boolean {
  if (member.rosterType) {
    return member.rosterType === "coach" || member.rosterType === "manager";
  }
  return !member.role.toLowerCase().includes("player");
}

/** เป็นผู้เล่นในสนามหรือไม่ */
export function isPlayerMember(member: Member): boolean {
  return !isStaffMember(member);
}
