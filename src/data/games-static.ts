import type { GameId } from "@/types";

/**
 * ============================================================================
 *  GAMES — รายการสายเกมแบบคงที่ (ใช้สร้าง route / slug)
 * ----------------------------------------------------------------------------
 *  ข้อมูลที่แก้ไขได้จากหน้า Admin (ภาพปก / โลโก้) อยู่ที่ `data/games.json`
 *  และอ่านผ่าน `src/lib/collections.ts`
 * ============================================================================
 */

export const games: { slug: GameId; name: string }[] = [
  { slug: "rov", name: "ARENA OF VALOR" },
  { slug: "freefire", name: "FREE FIRE" },
];

export const gameMap: Record<GameId, string> = {
  rov: "ARENA OF VALOR (RoV)",
  freefire: "FREE FIRE (FF)",
};
