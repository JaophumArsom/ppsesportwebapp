"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLinkStatus } from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { cta, navigation, SHOW_CONTACT_CTA } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Subtle inline feedback shown on a link while its navigation is in flight.
 * Non-disruptive — it never replaces the page content.
 */
function LinkPendingHint() {
  const { pending } = useLinkStatus();
  return (
    <AnimatePresence>
      {pending ? (
        <motion.span
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          exit={{ opacity: 0, scaleX: 0 }}
          transition={{ duration: 0.25 }}
          className="absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-pink-deep to-sky-deep"
          aria-hidden="true"
        />
      ) : null}
    </AnimatePresence>
  );
}

export function Navbar({
  branding,
}: {
  branding?: {
    schoolLogo?: string | null;
    teamLogo?: string | null;
    teamName?: string;
    schoolName?: string;
  };
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes. Adjusting the state
  // during render (instead of in an effect) keeps it in sync without an
  // extra render pass.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const closeMenu = () => setOpen(false);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-strong border-b border-ink/[0.07] shadow-[0_1px_0_rgba(20,43,80,0.04)]"
          : "border-b border-transparent bg-white/40 backdrop-blur-sm",
      )}
    >
      <nav
        className="container-page flex h-[68px] items-center justify-between gap-4 lg:h-[76px]"
        aria-label="เมนูหลัก"
      >
        <Logo branding={branding} />

        {/* ------------------------------ Desktop ----------------------------- */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[13.5px] font-semibold transition-colors duration-300",
                    active ? "text-ink" : "text-ink-mute hover:text-ink",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-pink-soft to-sky-soft ring-1 ring-ink/[0.06]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  {item.label}
                  <LinkPendingHint />
                </Link>
              </li>
            );
          })}
        </ul>

        {SHOW_CONTACT_CTA ? (
          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={cta.href}
              className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-5 text-[13px] font-semibold text-white transition-all duration-300 hover:bg-[#1b3767] hover:shadow-[0_10px_24px_-12px_rgba(20,43,80,0.6)]"
            >
              {cta.label}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        ) : null}

        {/* ------------------------------ Mobile ------------------------------ */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink/10 bg-white/70 text-ink backdrop-blur transition-colors hover:bg-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* ---------------------------- Mobile drawer --------------------------- */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/[0.07] bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-page flex flex-col gap-1 py-4">
              {navigation.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * index + 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors",
                        active
                          ? "bg-gradient-to-r from-pink-soft to-sky-soft text-ink"
                          : "text-ink-soft hover:bg-ink/[0.04]",
                      )}
                    >
                      {item.label}
                      <ArrowUpRight className="h-4 w-4 opacity-40" />
                    </Link>
                  </motion.li>
                );
              })}
              {SHOW_CONTACT_CTA ? (
                <motion.li
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * navigation.length + 0.05 }}
                  className="mt-2"
                >
                  <a
                    href={cta.href}
                    onClick={closeMenu}
                    className="flex items-center justify-between rounded-xl bg-ink px-4 py-3 text-[15px] font-semibold text-white"
                  >
                    {cta.label}
                    <ArrowUpRight className="h-4 w-4 opacity-70" />
                  </a>
                </motion.li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
