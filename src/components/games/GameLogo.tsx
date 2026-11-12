import { cn } from "@/lib/utils";
import type { Game } from "@/types";

/**
 * ============================================================================
 *  GameLogo
 * ----------------------------------------------------------------------------
 *  โลโก้ประจำสายเกม
 *
 *  • ถ้า `game.logo` มีค่า (path ของไฟล์รูป) → จะแสดงรูปนั้น
 *    โดยวาดเป็นแบนเนอร์แนวกว้าง เพื่อให้โลโก้แบบ wordmark อ่านออกชัด
 *  • ถ้า `game.logo` เป็น null → จะแสดงตราสัญลักษณ์ข้อความ (RoV / FF) ที่วาดด้วย CSS
 *
 *  วิธีใส่โลโก้จริง: แก้ไฟล์ src/data/games.ts
 *    logo: "/images/games/rov/logo.png"
 * ============================================================================
 */

const marks: Record<Game["slug"], { letters: string }> = {
  rov: { letters: "RoV" },
  freefire: { letters: "FF" },
};

/** ขนาดโลโก้เกม — สี่เหลี่ยมจัตุรัส 1:1 */
const logoSize = {
  sm: { box: "h-9 w-9" },
  md: { box: "h-14 w-14" },
  lg: { box: "h-20 w-20" },
} as const;

/** ขนาดของตราสัญลักษณ์ข้อความ (ใช้เมื่อไม่มีไฟล์รูป) */
const markSize = {
  sm: { box: "h-11 w-11", text: "text-sm", sub: "text-[7px]" },
  md: { box: "h-14 w-14", text: "text-lg", sub: "text-[8px]" },
  lg: { box: "h-20 w-20", text: "text-2xl", sub: "text-[9px]" },
} as const;

export function GameLogo({
  game,
  className,
  size = "md",
}: {
  game: Game;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const mark = marks[game.slug];

  // ------------------------------ โลโก้จริง ------------------------------
  if (game.logo) {
    return (
      <div
        className={cn(
          "relative shrink-0 overflow-hidden rounded-2xl ring-1 ring-ink/[0.08]",
          logoSize[size].box,
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.logo}
          alt={`${game.fullName} logo`}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  // ------------------------- ตราสัญลักษณ์ข้อความ -------------------------
  const sizes = markSize[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-sky-soft ring-1 ring-ink/[0.08]",
        sizes.box,
        className,
      )}
      title="ยังไม่ได้ใส่โลโก้ — ตั้งค่าได้ที่ src/data/games.ts (logo)"
    >
      <span
        className={cn(
          "font-display font-extrabold leading-none tracking-tight text-ink",
          sizes.text,
        )}
      >
        {mark.letters}
      </span>
      <span
        className={cn(
          "absolute bottom-1.5 font-display font-bold uppercase leading-none tracking-[0.12em] text-ink-mute",
          sizes.sub,
        )}
      >
        {game.slug === "rov" ? "MOBA" : "BR"}
      </span>
    </div>
  );
}
