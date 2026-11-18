/** Tiny class-name joiner (avoids pulling in clsx for a single helper). */
export function cn(
  ...classes: (string | false | null | undefined | 0 | 0n | "")[]
): string {
  return classes.filter(Boolean).join(" ");
}

/** Formats an ISO date to a readable string, e.g. `8 พ.ย. 2568`. */
const THAI_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  const day = date.getDate();
  const month = THAI_MONTHS[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
}

/** Returns the year of an ISO date string (local time, no timezone shift). */
export function yearOf(iso: string): number {
  return new Date(`${iso}T00:00:00`).getFullYear();
}
