/**
 * ============================================================================
 *  PPSESPORT — Central type definitions
 * ----------------------------------------------------------------------------
 *  Every piece of content that the CMS / future Supabase backend must provide
 *  is modelled here. UI components never hard-code content — they always read
 *  from `src/data/*` so that data can be replaced without touching components.
 * ============================================================================
 */

/** Identifier of a competitive division (game title). */
export type GameId = "rov" | "freefire";

/** Top-level grouping used by the Members section filters. */
export type MemberCategory = "organization" | "rov" | "freefire" | "staff";

/** ประเภทของผู้เล่นในทีม */
export type RosterType = "starter" | "substitute" | "coach" | "manager";

/** Rank highlight tier — drives the colour of the achievement badge. */
export type RankTier =
  | "champion"
  | "runner-up"
  | "third"
  | "top3"
  | "top8"
  | "qualify";

/** Competition scope of an achievement. */
export type TournamentScope =
  | "school"
  | "province"
  | "regional"
  | "national"
  | "international";

/** Gallery taxonomy. */
export type GalleryCategory =
  | "match"
  | "practice"
  | "team"
  | "event"
  | "behind";

/** Aspect ratio bucket used to build the asymmetric / masonry gallery grid. */
export type MediaRatio = "portrait" | "square" | "landscape" | "wide";

/* -------------------------------------------------------------------------- */
/*                                   Games                                    */
/* -------------------------------------------------------------------------- */

export interface Game {
  /** URL segment, e.g. `rov` -> `/games/rov`. */
  slug: GameId;
  /** Display code, e.g. `GAME 01`. */
  code: string;
  /** Short title, e.g. `ARENA OF VALOR`. */
  name: string;
  /** Full official title, e.g. `ARENA OF VALOR (RoV)`. */
  fullName: string;
  /** One line positioning statement shown on cards. */
  tagline: string;
  /** Long description used on the game detail page. */
  description: string;
  /** Accent colour token used for glows, borders and highlights. */
  accent: "pink" | "sky";
  /** In-game positions / roles covered by this division. */
  roles: string[];
  /** Path of the cover artwork. `null` renders the branded placeholder. */
  cover: string | null;
  /** Path of the official game logo. `null` renders the text logotype. */
  logo: string | null;
}

/* -------------------------------------------------------------------------- */
/*                                  Members                                   */
/* -------------------------------------------------------------------------- */

export interface MemberSocial {
  label: string;
  href: string;
}

export interface Member {
  /** URL segment, e.g. `rov-player-01` -> `/members/rov-player-01`. */
  slug: string;
  /** Real-world name. */
  realName: string;
  /** In-game / competitive handle. */
  inGameName: string;
  /** Position inside the organisation. */
  role: string;
  /** Filter group. */
  category: MemberCategory;
  /** Division the member belongs to (omitted for organisation-wide staff). */
  game?: GameId;
  /** Short biography. */
  bio: string;
  /** Path of the profile photo. `null` renders the branded placeholder. */
  image: string | null;
  /** Bullet highlights shown on the member detail page. */
  highlights: string[];
  /** Optional external links (social profiles, personal site...). */
  socials: MemberSocial[];
  /** Sort weight inside a category. */
  order: number;
  /** ระบุว่าเป็นข้อมูลตัวอย่าง (จะแสดงป้ายกำกับในหน้าเว็บ) */
  demo?: boolean;

  /* ------------------------- Player Profile (ข้อมูลเพิ่มเติม) ------------------------ */

  /** ชื่อเล่น / ชื่อที่ใช้ในกลุ่ม */
  nickname?: string | null;
  /** ประเภทผู้เล่นในทีม — ตัวจริง / ตัวสำรอง */
  rosterType?: RosterType | null;
  /** อายุ (ปี) */
  age?: number | null;
  /** ระดับชั้น เช่น "ม.4" / "ม.5" / "ม.6" */
  grade?: string | null;
  /** Instagram — ชื่อผู้ใช้หรือ URL เต็ม */
  instagram?: string | null;

  /**
   * สวิตช์หลัก — อนุญาตให้เผยแพร่โปรไฟล์นี้หรือไม่
   * (ค่าเริ่มต้นคือ true เพื่อไม่ให้ข้อมูลเดิมที่มีอยู่แล้วหายไป)
   */
  publish?: boolean;

  /** การอนุญาตเผยแพร่รายฟิลด์ (ต้องเปิดด้วยตัวเองในหน้า Admin) */
  showAge?: boolean;
  showGrade?: boolean;
  showInstagram?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                Achievements                                */
/* -------------------------------------------------------------------------- */

export interface Achievement {
  /** Stable unique id. */
  id: string;
  /** Name of the tournament / event. */
  tournament: string;
  /** Division the result belongs to. */
  game: GameId;
  /** Human readable placement, e.g. `อันดับ 1` / `Top 3`. */
  rank: string;
  /** Tier used for the badge colour. */
  tier: RankTier;
  /** Competition scope. */
  scope: TournamentScope;
  /** ISO date string. */
  date: string;
  /** Team name that entered the event. */
  teamName: string;
  /** Path of the trophy / stage photo. `null` renders the placeholder. */
  image: string | null;
  /** Optional short note. */
  note: string;
  /** ระบุว่าเป็นข้อมูลตัวอย่าง (จะแสดงป้ายกำกับในหน้าเว็บ) */
  demo?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Gallery                                   */
/* -------------------------------------------------------------------------- */

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  /** Optional division tag. */
  game?: GameId;
  /** Path of the photo. `null` renders the branded placeholder. */
  image: string | null;
  /** Aspect ratio bucket for the masonry layout. */
  ratio: MediaRatio;
  /** ระบุว่าเป็นข้อมูลตัวอย่าง (จะแสดงป้ายกำกับในหน้าเว็บ) */
  demo?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                               Organisation                                 */
/* -------------------------------------------------------------------------- */

export interface OrgStat {
  label: string;
  value: string;
  hint: string;
}

export interface Organisation {
  name: string;
  school: string;
  tagline: string;
  /** Short intro paragraphs. */
  intro: string[];
  /** Founding / vision bullets. */
  pillars: { title: string; description: string }[];
  /** Headline numbers. */
  stats: OrgStat[];
  /** Contact channels. */
  contact: { label: string; value: string; href: string; icon: string }[];
  /** Placeholder statement — replace with the real founding story. */
  foundationNote: string;
}
