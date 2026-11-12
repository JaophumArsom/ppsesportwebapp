"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { AchievementCard } from "@/components/achievements/AchievementCard";

import type { Achievement, GameId } from "@/types";
import { cn } from "@/lib/utils";

type GameFilter = "all" | GameId;

const gameFilters: { id: GameFilter; label: string }[] = [
  { id: "all", label: "ทุกเกม" },
  { id: "rov", label: "RoV" },
  { id: "freefire", label: "Free Fire" },
];

export function AchievementsExplorer({
  achievements,
  years,
}: {
  achievements: Achievement[];
  years: number[];
}) {
  const [game, setGame] = useState<GameFilter>("all");
  const [year, setYear] = useState<number | "all">("all");

  const filtered = useMemo(
    () =>
      achievements.filter((item) => {
        const matchGame = game === "all" || item.game === game;
        const matchYear =
          year === "all" || new Date(`${item.date}T00:00:00`).getFullYear() === year;
        return matchGame && matchYear;
      }),
    [achievements, game, year],
  );

  const reset = () => {
    setGame("all");
    setYear("all");
  };

  return (
    <div>
      {/* ------------------------------- Filters ------------------------------ */}
      <div className="flex flex-col gap-5 rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 pr-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
            <Filter className="h-3.5 w-3.5" />
            เกม
          </span>
          {gameFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setGame(item.id)}
              aria-pressed={game === item.id}
              className={cn(
                "rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                game === item.id
                  ? "bg-ink text-white shadow-[0_8px_20px_-12px_rgba(20,43,80,0.7)]"
                  : "bg-ink/[0.045] text-ink-soft hover:bg-ink/[0.08]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 pr-1 text-[11px] font-bold uppercase tracking-[0.16em] text-ink-mute">
            ปี
          </span>
          {(["all", ...years] as const).map((item) => (
            <button
              key={String(item)}
              type="button"
              onClick={() => setYear(item as number | "all")}
              aria-pressed={year === item}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition-all duration-300",
                year === item
                  ? "bg-gradient-to-r from-pink to-sky text-ink"
                  : "bg-ink/[0.045] text-ink-soft hover:bg-ink/[0.08]",
              )}
            >
              {item === "all" ? "ทุกปี" : item}
            </button>
          ))}
        </div>
      </div>

      {/* -------------------------------- Meta ------------------------------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-mute">
          แสดง{" "}
          <span className="font-semibold text-ink">
            {filtered.length}
          </span>{" "}
          ผลการแข่งขัน
          {filtered.length !== achievements.length ? (
            <span className="text-ink-mute"> จากทั้งหมด {achievements.length}</span>
          ) : null}
        </p>
        <div className="flex items-center gap-3">
          {game !== "all" || year !== "all" ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-mute transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              ล้างตัวกรอง
            </button>
          ) : null}
        </div>
      </div>

      {/* -------------------------------- Grid ------------------------------- */}
      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((achievement) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <AchievementCard achievement={achievement} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-sky-soft/50 px-6 py-14 text-center">
          <p className="font-display text-lg font-bold text-ink">
            ไม่พบผลการแข่งขันที่ตรงกับตัวกรอง
          </p>
          <p className="mt-2 text-[13px] text-ink-mute">
            ลองเลือกเกมหรือปีอื่น หรือกดล้างตัวกรองเพื่อดูผลการแข่งขันทั้งหมด
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1b3767]"
          >
            ล้างตัวกรอง
          </button>
        </div>
      ) : null}
    </div>
  );
}
