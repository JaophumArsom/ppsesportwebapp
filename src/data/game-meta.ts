import type { GameId } from "@/types";

/**
 * ============================================================================
 *  GAME META — ป้าย/ชื่อย่อของแต่ละสายเกม (ค่าคงที่ ใช้ได้ทั้ง client และ server)
 * ============================================================================
 */

export const gameLabel: Record<GameId, string> = {
  rov: "ARENA OF VALOR (RoV)",
  freefire: "FREE FIRE (FF)",
};

export const gameShortLabel: Record<GameId, string> = {
  rov: "RoV",
  freefire: "Free Fire",
};

export function getGameLabel(slug: GameId): string {
  return gameLabel[slug] ?? slug;
}

/** ตัวเลือกสายเกมสำหรับฟอร์มในหน้า Admin */
export const gameOptions: { id: GameId; label: string }[] = [
  { id: "rov", label: "ARENA OF VALOR (RoV)" },
  { id: "freefire", label: "FREE FIRE (FF)" },
];
