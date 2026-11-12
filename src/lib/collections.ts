import "server-only";

import {
  addItem,
  hasLatin,
  patchItem,
  readList,
  readObject,
  removeItem,
  toSlug,
  writeList,
  writeObject,
} from "@/lib/json-store";
import type { Achievement, Game, Member } from "@/types";

/**
 * ============================================================================
 *  COLLECTIONS — ตัวกลางเข้าถึงข้อมูลแต่ละชนิด
 * ============================================================================
 */

export const FILES = {
  members: "members.json",
  achievements: "achievements.json",
  games: "games.json",
  branding: "branding.json",
  hero: "hero.json",
} as const;

/* ------------------------------- สมาชิก ---------------------------------- */

export async function getMembers(): Promise<Member[]> {
  const list = await readList<Member>(FILES.members);
  return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getMember(slug: string): Promise<Member | undefined> {
  const list = await getMembers();
  return list.find((member) => member.slug === slug);
}

/* ------------------------------- ผลงาน ---------------------------------- */

export async function getAchievements(): Promise<Achievement[]> {
  const list = await readList<Achievement>(FILES.achievements);
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getAchievementsByGame(
  game: Achievement["game"],
): Promise<Achievement[]> {
  const list = await getAchievements();
  return list.filter((item) => item.game === game);
}

/* -------------------------------- เกม ----------------------------------- */

export async function getGames(): Promise<Game[]> {
  return readList<Game>(FILES.games);
}

export async function getGame(slug: string): Promise<Game | undefined> {
  const list = await getGames();
  return list.find((game) => game.slug === slug);
}

/* ------------------------------- แบรนด์ --------------------------------- */

/* ---------------------------- ภาพพื้นหลังหน้าแรก ---------------------------- */

export interface HeroConfig {
  /** รูปพื้นหลังหน้าแรกที่เคลื่อนไหว (เคลื่อนไปทางซ้าย) */
  images: string[];
}

export const defaultHero: HeroConfig = { images: [] };

export async function getHero(): Promise<HeroConfig> {
  return readObject<HeroConfig>(FILES.hero, defaultHero);
}

export async function saveHero(
  patch: Partial<HeroConfig>,
): Promise<HeroConfig> {
  const current = await getHero();
  const next = { ...current, ...patch };
  await writeObject(FILES.hero, next);
  return next;
}

export interface Branding {
  /** โลโก้โรงเรียน (แนะนำ 1:1 พื้นโปร่งใส) */
  schoolLogo: string | null;
  /** โลโก้ทีม (แนะนำแนวนอน พื้นโปร่งใส) */
  teamLogo: string | null;
  /** ชื่อทีม */
  teamName: string;
  /** ชื่อโรงเรียน */
  schoolName: string;
  /** คำโปรยใต้โลโก้ */
  tagline: string;
}

export const defaultBranding: Branding = {
  schoolLogo: null,
  teamLogo: null,
  teamName: "PPSESPORT",
  schoolName: "โรงเรียนพิจิตรพิทยาคม",
  tagline: "",
};

export async function getBranding(): Promise<Branding> {
  return readObject<Branding>(FILES.branding, defaultBranding);
}

export async function saveBranding(patch: Partial<Branding>): Promise<Branding> {
  const current = await getBranding();
  const next = { ...current, ...patch };
  await writeObject(FILES.branding, next);
  return next;
}

/* ------------------------------ ตัวช่วย slug ------------------------------ */

const slugPrefix: Record<string, string> = {
  organization: "org",
  rov: "rov-player",
  freefire: "ff-player",
  staff: "staff",
};

/** สร้าง slug ที่ไม่ซ้ำ สำหรับสมาชิก */
export function makeMemberSlug(
  realName: string,
  category: string,
  existing: string[],
): string {
  const fromName = toSlug(realName);
  if (fromName && hasLatin(fromName)) {
    let slug = fromName;
    let n = 2;
    while (existing.includes(slug)) {
      slug = `${fromName}-${n}`;
      n += 1;
    }
    return slug;
  }

  const prefix = slugPrefix[category] ?? "member";
  let n = existing.filter((slug) => slug.startsWith(prefix)).length + 1;
  let slug = `${prefix}-${String(n).padStart(2, "0")}`;
  while (existing.includes(slug)) {
    n += 1;
    slug = `${prefix}-${String(n).padStart(2, "0")}`;
  }
  return slug;
}

/** สร้าง id ที่ไม่ซ้ำ สำหรับผลงาน / ภาพ */
export function makeUniqueId(
  prefix: string,
  existing: string[],
): string {
  let n = existing.length + 1;
  let id = `${prefix}-${String(n).padStart(3, "0")}`;
  while (existing.includes(id)) {
    n += 1;
    id = `${prefix}-${String(n).padStart(3, "0")}`;
  }
  return id;
}

/* ------------------------------ CRUD ตัวกลาง ----------------------------- */

export async function createMember(input: Partial<Member>): Promise<Member> {
  const list = await getMembers();
  const existing = list.map((member) => member.slug);

  const record: Member = {
    slug: makeMemberSlug(
      input.realName ?? "member",
      input.category ?? "staff",
      existing,
    ),
    realName: input.realName?.trim() || "ไม่ระบุชื่อ",
    inGameName: input.inGameName?.trim() || "—",
    role: input.role?.trim() || "สมาชิก",
    category: input.category ?? "staff",
    ...(input.game ? { game: input.game } : {}),
    bio: input.bio?.trim() ?? "",
    image: input.image?.trim() || null,
    highlights: input.highlights ?? [],
    socials: input.socials ?? [],
    order: list.length + 1,
    nickname: input.nickname?.trim() || null,
    rosterType: input.rosterType ?? null,
    age: input.age ? Number(input.age) : null,
    grade: input.grade?.trim() || null,
    instagram: input.instagram?.trim() || null,
    publish: input.publish !== false,
    showAge: input.showAge === true,
    showGrade: input.showGrade === true,
    showInstagram: input.showInstagram === true,
  };

  await addItem(FILES.members, record, "slug");
  return record;
}

/**
 * จัดลำดับสมาชิกใหม่ตามลำดับ slug ที่ส่งมา
 * (ลำดับในอาร์เรย์ = ลำดับที่แสดงบนเว็บไซต์)
 */
export async function reorderMembers(slugs: string[]): Promise<boolean> {
  const list = await getMembers();
  const bySlug = new Map(list.map((m) => [m.slug, m]));
  const ordered: Member[] = [];

  for (const slug of slugs) {
    const member = bySlug.get(slug);
    if (member) {
      ordered.push(member);
      bySlug.delete(slug);
    }
  }
  // สมาชิกที่ไม่ได้อยู่ในรายการใหม่ → ต่อท้าย
  for (const member of list) {
    if (bySlug.has(member.slug)) ordered.push(member);
  }

  const next = ordered.map((member, index) => ({ ...member, order: index + 1 }));
  await writeList(FILES.members, next);
  return true;
}

export async function updateMember(
  slug: string,
  patch: Partial<Member>,
): Promise<Member | undefined> {
  const list = await getMembers();
  const current = list.find((member) => member.slug === slug);
  if (!current) return undefined;

  const next: Member = {
    ...current,
    ...patch,
    slug,
    realName: patch.realName?.trim() || current.realName,
    inGameName:
      patch.inGameName !== undefined
        ? patch.inGameName?.trim() || "—"
        : current.inGameName,
    role: patch.role?.trim() || current.role,
    bio: patch.bio !== undefined ? patch.bio?.trim() || "" : current.bio,
    image: patch.image !== undefined ? patch.image?.trim() || null : current.image,
    age:
      patch.age !== undefined
        ? patch.age === null || patch.age === undefined
          ? null
          : Number(patch.age) || null
        : current.age,
    nickname:
      patch.nickname !== undefined
        ? patch.nickname?.trim() || null
        : current.nickname,
    rosterType:
      patch.rosterType !== undefined
        ? patch.rosterType || null
        : current.rosterType,
    grade:
      patch.grade !== undefined ? patch.grade?.trim() || null : current.grade,
    instagram:
      patch.instagram !== undefined
        ? patch.instagram?.trim() || null
        : current.instagram,
  };

  await writeMemberFile(list.map((m) => (m.slug === slug ? next : m)));
  return next;
}

export async function deleteMember(slug: string): Promise<boolean> {
  const list = await getMembers();
  const next = list.filter((member) => member.slug !== slug);
  if (next.length === list.length) return false;
  await writeMemberFile(next);
  return true;
}

async function writeMemberFile(list: Member[]) {
  const { writeList } = await import("@/lib/json-store");
  await writeList(FILES.members, list);
}

/* ------------------------- CRUD ผลงาน / ภาพ / เกม ------------------------- */

export async function createAchievement(
  input: Partial<Achievement>,
): Promise<Achievement> {
  const list = await getAchievements();
  const record: Achievement = {
    id: makeUniqueId(
      "ach",
      list.map((item) => item.id),
    ),
    tournament: input.tournament?.trim() || "ชื่อรายการแข่งขัน",
    game: input.game ?? "rov",
    rank: input.rank?.trim() || "อันดับ 1",
    tier: input.tier ?? "champion",
    scope: input.scope ?? "regional",
    date: input.date || new Date().toISOString().slice(0, 10),
    teamName: input.teamName?.trim() || "PPS",
    image: input.image?.trim() || null,
    note: input.note?.trim() ?? "",
  };

  await addItem(FILES.achievements, record, "id");
  return record;
}

export async function updateAchievement(
  id: string,
  patch: Partial<Achievement>,
): Promise<Achievement | undefined> {
  return patchItem<Achievement>(
    FILES.achievements,
    id,
    patch,
    "id",
  );
}

export async function deleteAchievement(id: string): Promise<boolean> {
  return removeItem<Achievement>(FILES.achievements, id, "id");
}

export async function updateGame(
  slug: string,
  patch: Partial<Game>,
): Promise<Game | undefined> {
  const list = await getGames();
  const current = list.find((game) => game.slug === slug);
  if (!current) return undefined;

  const next: Game = { ...current, ...patch, slug: current.slug };
  const { writeList } = await import("@/lib/json-store");
  await writeList(
    FILES.games,
    list.map((game) => (game.slug === slug ? next : game)),
  );
  return next;
}
