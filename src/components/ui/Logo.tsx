import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  Logo
 * ----------------------------------------------------------------------------
 *  โครงสร้างโลโก้ในหัวเว็บไซต์:
 *
 *    [โลโก้โรงเรียน]  [โลโก้ทีม]  │  PPSESPORT
 *                              │  ชื่อโรงเรียน
 *
 *  • โลโก้ทีมอยู่ตำแหน่งเดิมของตรา "PN" (คลิกแล้วกลับหน้าแรก)
 *  • โลโก้โรงเรียนและโลโก้ทีมมี **ความสูงเท่ากัน** (h-11) จึงเรียงกันตรงแนว
 *  • ถ้ายังไม่ได้ใส่โลโก้ทีม จะแสดงตรา "PN" แทน (ไม่ให้ช่องว่าง)
 * ============================================================================
 */

/** ขนาดสูงของโลโก้ทั้งสอง (ต้องเท่ากัน) */
const LOGO_HEIGHT = 44;
/** ความกว้างสูงสุดของโลโก้ทีม */
const TEAM_MAX_WIDTH = 152;

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={cn("h-10 w-10", className)}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="pps-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4BFD5" />
          <stop offset="55%" stopColor="#142B50" />
          <stop offset="100%" stopColor="#A9DDF5" />
        </linearGradient>
      </defs>
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="13"
        fill="url(#pps-mark)"
        opacity="0.16"
      />
      <rect
        x="1.5"
        y="1.5"
        width="41"
        height="41"
        rx="13"
        fill="none"
        stroke="url(#pps-mark)"
        strokeWidth="1.6"
      />
      <path
        d="M13 31V13h6.4c3.6 0 5.8 1.9 5.8 5s-2.2 5.1-5.8 5.1H17V31h-4Zm4-11.2h2.2c1.6 0 2.5-.7 2.5-1.9s-.9-1.9-2.5-1.9H17v3.8Z"
        fill="#142B50"
      />
      <path
        d="M27.6 13h3.6l1.6 5.3 1.6-5.3h3.6L34.6 31h-3.7l-1-6.1-1.1 6.1h-3.6L27.6 13Z"
        fill="#142B50"
        opacity="0.85"
      />
    </svg>
  );
}

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
  const teamName = branding?.teamName || "PPSESPORT";
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

      {/* ------------------------ โลโก้ทีม (แทนตรา PN) ------------------------ */}
      <span className="flex shrink-0 items-center">
        {teamLogo ? (
          <Image
            src={teamLogo}
            alt={`โลโก้${teamName}`}
            width={TEAM_MAX_WIDTH}
            height={LOGO_HEIGHT}
            className="h-11 max-w-[9.5rem] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <LogoMark className="h-11 w-11 transition-transform duration-500 group-hover:rotate-[-6deg]" />
        )}
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
            PPS<span className="text-gradient-soft">ESPORT</span>
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
