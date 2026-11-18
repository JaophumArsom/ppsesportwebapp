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

export function getGameLabel(slug: GameId): string {
  return gameLabel[slug] ?? slug;
}
