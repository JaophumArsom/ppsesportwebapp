import type { RankTier, TournamentScope } from "@/types";

/**
 * ============================================================================
 *  ACHIEVEMENT META — ป้ายอันดับ / ระดับการแข่งขัน (ค่าคงที่)
 * ============================================================================
 */

export const tierMeta: Record<
  RankTier,
  { label: string; className: string; dot: string }
> = {
  champion: {
    label: "แชมป์",
    className: "bg-[#FFF3D6] text-[#8A6200] ring-[#F0D089]",
    dot: "bg-[#E3A008]",
  },
  "runner-up": {
    label: "รองชนะเลิศ",
    className: "bg-[#EEF2F8] text-[#40536F] ring-[#C9D6E6]",
    dot: "bg-[#8FA3BD]",
  },
  third: {
    label: "อันดับ 3",
    className: "bg-[#EAF6FC] text-[#1B6E96] ring-[#A9DDF5]",
    dot: "bg-[#2E9BD1]",
  },
  top3: {
    label: "อันดับ 3",
    className: "bg-[#EAF6FC] text-[#1B6E96] ring-[#A9DDF5]",
    dot: "bg-[#2E9BD1]",
  },
  top8: {
    label: "อันดับ 8",
    className: "bg-[#FDEBF4] text-[#A8447A] ring-[#F4BFD5]",
    dot: "bg-[#E07BAE]",
  },
  qualify: {
    label: "เข้ารอบ",
    className: "bg-[#F1F5F9] text-[#4A5C73] ring-[#CBD5E1]",
    dot: "bg-[#94A3B8]",
  },
};

/** ระดับการแข่งขัน เรียงจากเล็กไปใหญ่ */
export const scopeLabel: Record<TournamentScope, string> = {
  school: "ระดับโรงเรียน",
  province: "ระดับจังหวัด",
  regional: "ระดับภาค",
  national: "ระดับประเทศ",
  international: "ระดับนานาชาติ",
};

/** ตัวเลือกสำหรับฟอร์มในหน้า Admin */
export const tierOptions: { id: RankTier; label: string }[] = [
  { id: "champion", label: "แชมป์" },
  { id: "runner-up", label: "รองชนะเลิศ" },
  { id: "third", label: "อันดับ 3" },
  { id: "top8", label: "อันดับ 8" },
  { id: "qualify", label: "เข้ารอบ" },
];

export const scopeOptions: { id: TournamentScope; label: string }[] = [
  { id: "school", label: "ระดับโรงเรียน" },
  { id: "province", label: "ระดับจังหวัด" },
  { id: "regional", label: "ระดับภาค" },
  { id: "national", label: "ระดับประเทศ" },
  { id: "international", label: "ระดับนานาชาติ" },
];
