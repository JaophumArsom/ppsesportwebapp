"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, UserRoundSearch, X } from "lucide-react";
import { MemberCard } from "@/components/members/MemberCard";

import { memberCategories } from "@/data/member-meta";
import type { Member, MemberCategory } from "@/types";
import { cn } from "@/lib/utils";

type Filter = "all" | MemberCategory;

const VALID_FILTERS: Filter[] = ["all", ...memberCategories.map((c) => c.id)];

export function MembersExplorer({ members }: { members: Member[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as Filter | null;
  const urlFilter: Filter =
    categoryParam && VALID_FILTERS.includes(categoryParam) ? categoryParam : "all";

  // The URL is the source of truth for the category. State holds the filter the
  // user picked with the chips; it is re-synced during render when the URL
  // changes (e.g. arriving from the home page) — no effect needed.
  const [selection, setSelection] = useState<{ url: Filter; value: Filter }>({
    url: urlFilter,
    value: urlFilter,
  });

  if (selection.url !== urlFilter) {
    setSelection({ url: urlFilter, value: urlFilter });
  }

  const filter = selection.value;
  const setFilter = (value: Filter) => setSelection({ url: urlFilter, value });

  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: members.length };
    memberCategories.forEach((category) => {
      map[category.id] = members.filter((m) => m.category === category.id).length;
    });
    return map;
  }, [members]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((member) => {
      const matchCategory = filter === "all" || member.category === filter;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        member.realName.toLowerCase().includes(q) ||
        member.inGameName.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q) ||
        member.bio.toLowerCase().includes(q)
      );
    });
  }, [members, filter, query]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    ...memberCategories.map((c) => ({ id: c.id as Filter, label: c.label })),
  ];

  const reset = () => {
    setFilter("all");
    setQuery("");
  };

  return (
    <div>
      {/* ------------------------------- Toolbar ----------------------------- */}
      <div className="flex flex-col gap-4 rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-soft sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ค้นหาชื่อสมาชิก, ชื่อเล่น หรือตำแหน่ง…"
            aria-label="ค้นหาสมาชิก"
            className="h-12 w-full rounded-full border border-ink/10 bg-sky-soft/40 pl-11 pr-10 text-[14px] text-ink outline-none transition-all duration-300 placeholder:text-ink-mute focus:border-sky/70 focus:bg-white focus:ring-4 focus:ring-sky/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="ล้างคำค้นหา"
              className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-mute transition-colors hover:bg-ink/[0.06] hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        {/* Category chips */}
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0 lg:pb-0">
          {filters.map((item) => {
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                aria-pressed={active}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-300",
                  active
                    ? "bg-ink text-white shadow-[0_8px_20px_-12px_rgba(20,43,80,0.7)]"
                    : "bg-ink/[0.045] text-ink-soft hover:bg-ink/[0.08]",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "ml-1.5 text-[11px] font-bold",
                    active ? "text-white/80" : "text-ink-mute",
                  )}
                >
                  {counts[item.id] ?? 0}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* -------------------------------- Meta ------------------------------- */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[13px] text-ink-mute">
          แสดง{" "}
          <span className="font-semibold text-ink">{filtered.length}</span> ท่าน
          {filtered.length !== members.length ? (
            <span className="text-ink-mute"> จากทั้งหมด {members.length}</span>
          ) : null}
        </p>
        <div className="flex items-center gap-3">
          {(filter !== "all" || query) ? (
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
      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((member) => (
            <motion.div
              key={member.slug}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <MemberCard member={member} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-ink/15 bg-sky-soft/50 px-6 py-16 text-center">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink shadow-soft">
            <UserRoundSearch className="h-6 w-6" />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-ink">
            ไม่พบสมาชิกที่ค้นหา
          </p>
          <p className="mt-2 text-[13px] text-ink-mute">
            ลองใช้คำค้นหาอื่น หรือเลือกหมวดหมู่อื่น
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
