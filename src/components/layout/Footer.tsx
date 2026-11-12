import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/ui/SocialIcons";
import {
  footerDivisions,
  footerNavigation,
  site,
  socials,
} from "@/data/site";
import { organisation } from "@/data/organization";

const socialIcons: Record<string, (props: { className?: string }) => React.ReactElement> = {
  Facebook: FacebookIcon,
  YouTube: YouTubeIcon,
  Instagram: InstagramIcon,
  TikTok: TikTokIcon,
};

export function Footer({
  branding,
}: {
  branding?: {
    schoolLogo?: string | null;
    teamLogo?: string | null;
    teamName?: string;
    schoolName?: string;
  };
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-ink/[0.07] bg-white">
      {/* Soft brand glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-brand-radial opacity-70"
        aria-hidden="true"
      />

      <div className="container-page relative">
        <div className="grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-10">
          {/* ------------------------------ Brand ------------------------------ */}
          <div className="flex flex-col gap-5">
            <Logo branding={branding} />
            <p className="max-w-sm text-sm leading-relaxed text-ink-mute">
              {site.school} — {organisation.tagline} ศูนย์รวมข้อมูล นักกีฬา
              ผลงานการแข่งขัน และทีมงานของสังกัด PPSESPORT
            </p>
            <div className="flex flex-wrap gap-2">
              {socials.map((social) => {
                const Icon =
                  socialIcons[social.label] ?? ArrowUpRight;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-white text-ink-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/20 hover:bg-gradient-to-br hover:from-pink-soft hover:to-sky-soft hover:text-ink"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ---------------------------- Navigation ---------------------------- */}
          <nav aria-label="เมนูส่วนล่าง">
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink">
              เมนู
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-gradient-to-r from-pink-deep to-sky-deep transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* ----------------------------- Divisions ---------------------------- */}
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ink">
              สายเกม
            </h2>
            <ul className="mt-5 flex flex-col gap-3">
              {footerDivisions.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-ink-mute transition-colors hover:text-ink"
                  >
                    <span className="h-px w-0 bg-gradient-to-r from-pink-deep to-sky-deep transition-all duration-300 group-hover:w-4" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ------------------------------ Bottom ------------------------------ */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/[0.07] py-7 sm:flex-row">
          <p className="text-center text-[12.5px] text-ink-mute sm:text-left">
            © {year} {site.name}. {site.schoolThai} — สงวนลิขสิทธิ์
          </p>
          <p className="text-[12.5px] text-ink-mute">
            Designed &amp; built for{" "}
            <span className="font-semibold text-ink-soft">{site.school}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
