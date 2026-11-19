import Image from "next/image";
import Link from "next/link";
import { teamLogoPath } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  Logo
 * ----------------------------------------------------------------------------
 *  โครงสร้างโลโก้ในหัวเว็บไซต์:
 *
 *    [โลโก้โรงเรียน]  [โลโก้ทีม]  │  PPS Esports
 *                              │  ชื่อโรงเรียน
 *
 *  • โลโก้ทีมใช้รูปจริงของสังกัด (คลิกแล้วกลับหน้าแรก)
 *  • โลโก้โรงเรียนและโลโก้ทีมมีความสูงเท่ากัน (h-11) จึงเรียงกันตรงแนว
 *  • หากยังอ่านค่าจาก Admin ไม่ได้ จะตกกลับมาใช้รูปโลโก้ทีมใน `public/`
 * ============================================================================
 */

/** ขนาดสูงของโลโก้ทั้งสอง (ต้องเท่ากัน) */
const LOGO_HEIGHT = 44;
/** ความกว้างสูงสุดของโลโก้ทีม */
const TEAM_MAX_WIDTH = 152;

interface Branding {
  schoolLogo?: string | null;
  teamLogo?: string | null;
  teamName?: string;
  schoolName?: string;
}

interface LogoProps {
  className?: string;
  /** แสดงเฉพาะโลโก้ (ไม่แสดงข้อความ) */
  markOnly?: boolean;
  href?: string;
  inverted?: boolean;
  /** โลโก้โรงเรียน + โลโก้ทีม */
  branding?: Branding;
}

export function Logo({
  className,
  markOnly = false,
  href = "/",
  inverted = false,
  branding,
}: LogoProps) {
  const schoolLogo = branding?.schoolLogo ?? null;
  const teamLogo = branding?.teamLogo ?? null;
  const teamName = branding?.teamName || "PPS Esports";
  const schoolName = branding?.schoolName || "โรงเรียนพิจิตรพิทยาคม";

  const content = (
    <span className={cn("group inline-flex items-center gap-2.5", className)}>
      {/* ----------------------------- โลโก้โรงเรียน ----------------------------- */}
      {schoolLogo ? (
        <span className="hidden shrink-0 sm:block">
          <Image
            src={schoolLogo}
            alt={`โลโก้${schoolName}`}
            width={LOGO_HEIGHT}
            height={LOGO_HEIGHT}
            className="h-11 w-11 object-contain"
          />
        </span>
      ) : null}

      {/* -------------------------------- โลโก้ทีม ------------------------------- */}
      <span className="flex shrink-0 items-center">
        <Image
          src={teamLogo ?? teamLogoPath}
          alt={`โลโก้${teamName}`}
          width={TEAM_MAX_WIDTH}
          height={LOGO_HEIGHT}
          className="h-11 w-auto max-w-[9.5rem] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </span>

      {/* ------------------------------- ข้อความ ------------------------------- */}
      {!markOnly ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[17px] font-extrabold tracking-[0.02em] sm:text-lg",
              inverted ? "text-white" : "text-ink",
            )}
          >
            PPS{" "}
            <span className="text-gradient-soft">Esports</span>
          </span>
          <span
            className={cn(
              "mt-1 max-w-[9rem] truncate text-[9px] font-semibold uppercase tracking-[0.2em]",
              inverted ? "text-white/80" : "text-ink-mute",
            )}
          >
            {schoolName}
          </span>
        </span>
      ) : (
        <span className="sr-only">{teamName}</span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link href={href} className="rounded-xl">
      {content}
    </Link>
  );
}
