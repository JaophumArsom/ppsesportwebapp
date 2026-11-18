"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Primitives";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { site } from "@/data/site";
import { organisation } from "@/data/organization";

export function Hero({
  memberCount = 0,
  achievementCount = 0,
  images = [],
}: {
  memberCount?: number;
  achievementCount?: number;
  /** ภาพพื้นหลังที่เคลื่อนไหวไปทางซ้าย */
  images?: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const heroStats = [
    { value: "02", label: "สายเกม" },
    { value: String(memberCount).padStart(2, "0"), label: "สมาชิก" },
    { value: String(achievementCount).padStart(2, "0"), label: "ผลงาน" },
  ];
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 34]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-brand-radial pb-20 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
    >
      {/* --------------------- ภาพพื้นหลังเคลื่อนไหวไปทางซ้าย --------------------- */}
      <HeroCarousel images={images} />

      {/* Decorative layers */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-[0.35] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute -left-24 top-20 -z-10 h-80 w-80 rounded-full bg-pink/25 blur-[100px]"
        aria-hidden="true"
      />
      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none absolute -right-20 top-8 -z-10 h-[22rem] w-[22rem] rounded-full bg-sky/30 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="accent-line pointer-events-none absolute inset-x-0 top-0 -z-10 h-px opacity-70"
        aria-hidden="true"
      />

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ------------------------------- Copy ------------------------------ */}
          <motion.div style={{ y: textY }} className="lg:col-span-7 xl:col-span-7">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-ink/10 bg-white/75 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft shadow-soft backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-pink-deep" />
              {site.school}
              <span className="accent-line pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-70" aria-hidden="true" />
            </motion.span>

            <h1 className="mt-6 font-display text-[clamp(2.75rem,9vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
              {["PPS", "ESPORT"].map((word, index) => (
                <span key={word} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.1 + index * 0.12,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {index === 0 ? (
                      <span className="text-ink">{word}</span>
                    ) : (
                      <span className="text-gradient-soft">{word}</span>
                    )}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.42 }}
              className="mt-5 font-display text-[clamp(1rem,2.4vw,1.35rem)] font-bold uppercase leading-snug tracking-[0.06em] text-ink-soft sm:text-[1.15rem]"
            >
              {site.tagline}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.48 }}
              className="mt-1.5 font-display text-[15px] font-semibold text-ink-mute sm:text-base"
            >
              {site.taglineThai}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.52 }}
              className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-mute sm:text-base"
            >
              {organisation.name} คือสังกัดอีสปอร์ตของ{organisation.school} —
              ที่รวมนักกีฬา ทีมงาน และผลงานการแข่งขันไว้ในที่เดียว
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.62 }}
              className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Button
                href="/members"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                ดูรายชื่อนักกีฬา
              </Button>
              <Button
                href="/achievements"
                size="lg"
                variant="outline"
                icon={<Trophy className="h-4 w-4" />}
                iconPosition="left"
              >
                ดูผลงานการแข่งขัน
              </Button>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6"
            >
              {heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <dt className="font-display text-3xl font-extrabold tracking-tight text-ink">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-mute">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex justify-center lg:mt-20"
        >
          <a
            href="#games"
            aria-label="Scroll to the next section"
            className="group inline-flex flex-col items-center gap-2 text-ink-mute transition-colors hover:text-ink"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em]">
              เลื่อนดูต่อ
            </span>
            <motion.span
              animate={{ y: [0, 7, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/10 bg-white/70 backdrop-blur"
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
