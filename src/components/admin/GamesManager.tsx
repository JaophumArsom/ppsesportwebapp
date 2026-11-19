"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Save } from "lucide-react";
import type { Game } from "@/types";
import { cn } from "@/lib/utils";

/**
 * GamesManager — แก้ไขภาพปก (cover) และโลโก้ (logo) ของแต่ละสายเกม
 */
export function GamesManager() {
  const router = useRouter();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, { cover: string; logo: string }>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/games", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const list: Game[] = data.items ?? [];
        setGames(list);
        const next: Record<string, { cover: string; logo: string }> = {};
        list.forEach((game) => {
          next[game.slug] = {
            cover: game.cover ?? "",
            logo: game.logo ?? "",
          };
        });
        setDrafts(next);
      } catch {
        if (active) setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const save = async (slug: string) => {
    setSaving(slug);
    setError(null);
    try {
      const res = await fetch("/api/games", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          cover: drafts[slug]?.cover ?? null,
          logo: drafts[slug]?.logo || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      setNotice("บันทึกแล้ว");
      window.setTimeout(() => setNotice(null), 2400);
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 rounded-2xl border border-ink/[0.08] bg-white py-16 text-ink-mute">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">กำลังโหลด…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {notice ? (
        <p className="flex items-center gap-2 rounded-xl border border-sky/60 bg-sky-soft px-4 py-3 text-[13px] font-medium text-[#1B6E96]">
          <Check className="h-4 w-4" />
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-xl border border-pink/50 bg-pink-soft px-4 py-3 text-[13px] font-medium text-[#A8447A]">
          {error}
        </p>
      ) : null}

      {games.map((game) => (
        <section
          key={game.slug}
          className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-mute">
                {game.code}
              </p>
              <h3 className="font-display text-lg font-extrabold text-ink">
                {game.fullName}
              </h3>
            </div>
            <span className="text-[11.5px] text-ink-mute">/games/{game.slug}</span>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1fr_200px]">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`cover-${game.slug}`}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
              >
                ภาพปก (cover)
              </label>
              <input
                id={`cover-${game.slug}`}
                value={drafts[game.slug]?.cover ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [game.slug]: {
                      ...prev[game.slug],
                      cover: e.target.value,
                    },
                  }))
                }
                placeholder="/images/games/rov/cover.jpg"
                className={inputClass}
              />
              <p className="text-[11.5px] leading-relaxed text-ink-mute">
                แนะนำ 1600 × 900 px (16:9)
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor={`logo-${game.slug}`}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
              >
                โลโก้ (logo) — สี่เหลี่ยม 1:1
              </label>
              <input
                id={`logo-${game.slug}`}
                value={drafts[game.slug]?.logo ?? ""}
                onChange={(e) =>
                  setDrafts((prev) => ({
                    ...prev,
                    [game.slug]: {
                      ...prev[game.slug],
                      logo: e.target.value,
                    },
                  }))
                }
                placeholder="/images/games/rov/logo.png"
                className={inputClass}
              />
              <p className="text-[11.5px] leading-relaxed text-ink-mute">
                แนะนำ 400 × 400 px (1:1) พื้นหลังโปร่งใส · เว้นว่างไว้จะใช้ตรา
                ข้อความอัตโนมัติ
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
                ตัวอย่าง
              </p>
              <div className="flex items-end gap-3">
                <div
                  className={cn(
                    "flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-sky-soft ring-1 ring-ink/10",
                  )}
                >
                  {drafts[game.slug]?.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={drafts[game.slug].logo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-display text-lg font-extrabold text-ink">
                      {game.slug === "rov" ? "RoV" : "FF"}
                    </span>
                  )}
                </div>
                <div className="h-12 w-24 overflow-hidden rounded-xl bg-sky-soft ring-1 ring-ink/10">
                  {drafts[game.slug]?.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={drafts[game.slug].cover}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => save(game.slug)}
                disabled={saving === game.slug}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1b3767] disabled:opacity-60"
              >
                {saving === game.slug ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                บันทึก
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-ink/10 bg-sky-soft/40 px-4 text-[14px] text-ink outline-none transition-all duration-300 placeholder:text-ink-mute/70 focus:border-sky/70 focus:bg-white focus:ring-4 focus:ring-sky/20";
