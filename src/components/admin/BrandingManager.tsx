"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, ImageIcon, Loader2, Save } from "lucide-react";

/**
 * BrandingManager — โลโก้ทีม โลโก้โรงเรียน และชื่อที่แสดงบนหัวเว็บไซต์
 */
export function BrandingManager() {
  const router = useRouter();
  const [form, setForm] = useState({
    schoolLogo: "",
    teamLogo: "",
    teamName: "",
    schoolName: "",
    tagline: "",
  });
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/branding", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        const b = data.branding ?? {};
        setForm({
          schoolLogo: b.schoolLogo ?? "",
          teamLogo: b.teamLogo ?? "",
          teamName: b.teamName ?? "",
          schoolName: b.schoolName ?? "",
          tagline: b.tagline ?? "",
        });
        setHeroImages(data.hero?.images ?? []);
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

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/branding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolLogo: form.schoolLogo || null,
          teamLogo: form.teamLogo || null,
          teamName: form.teamName,
          schoolName: form.schoolName,
          tagline: form.tagline,
          heroImages,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "บันทึกไม่สำเร็จ");
        return;
      }
      setNotice("บันทึกแล้ว — โลโก้จะแสดงในหัวเว็บทันที");
      window.setTimeout(() => setNotice(null), 2800);
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
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
    <form
      onSubmit={save}
      className="grid gap-6 rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft lg:grid-cols-[1fr_320px] lg:items-start"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="schoolLogo"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
          >
            โลโก้โรงเรียน
          </label>
          <input
            id="schoolLogo"
            value={form.schoolLogo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, schoolLogo: e.target.value }))
            }
            placeholder="/images/branding/school-logo.png"
            className={inputClass}
          />
          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            วางไฟล์ที่ public/images/branding/ · แนะนำ 400 × 400 px (1:1) PNG
            โปร่งใส
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="teamLogo"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
          >
            โลโก้ทีม
          </label>
          <input
            id="teamLogo"
            value={form.teamLogo}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, teamLogo: e.target.value }))
            }
            placeholder="/images/branding/team-logo.png"
            className={inputClass}
          />
          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            วางไฟล์ที่ public/images/branding/ · แนะนำแนวนอน 600 × 200 px PNG
            โปร่งใส
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="teamName"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
            >
              ชื่อทีม
            </label>
            <input
              id="teamName"
              value={form.teamName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, teamName: e.target.value }))
              }
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="schoolName"
              className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
            >
              ชื่อโรงเรียน
            </label>
            <input
              id="schoolName"
              value={form.schoolName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, schoolName: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="tagline"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
          >
            คำโปรย
          </label>
          <input
            id="tagline"
            value={form.tagline}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, tagline: e.target.value }))
            }
            className={inputClass}
          />
        </div>

        {/* --------------------- ภาพพื้นหลังหน้าแรก (Hero) --------------------- */}
        <div className="flex flex-col gap-1.5 rounded-2xl border border-ink/[0.08] bg-sky-soft/40 p-4">
          <label
            htmlFor="heroImages"
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
          >
            ภาพพื้นหลังหน้าแรก (เลื่อนไปทางซ้าย)
          </label>
          <textarea
            id="heroImages"
            rows={4}
            value={heroImages.join("\n")}
            onChange={(e) =>
              setHeroImages(
                e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              )
            }
            placeholder={"/images/hero/01.jpg\n/images/hero/02.jpg\n/images/hero/03.jpg"}
            className={`${inputClass} resize-y font-mono text-[12.5px]`}
          />
          <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
            <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            บรรทัดละ 1 รูป · วางไฟล์ไว้ที่{" "}
            <code className="rounded bg-white px-1.5 py-0.5 text-[11.5px] text-ink">
              public/images/hero
            </code>{" "}
            แนะนำ 1600 × 1000 px (8:5) · เว้นว่างไว้ถ้ายังไม่มีรูป
          </p>
        </div>

        {error ? (
          <p className="rounded-xl border border-pink/50 bg-pink-soft px-4 py-3 text-[13px] font-medium text-[#A8447A]">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="flex items-center gap-2 rounded-xl border border-sky/60 bg-sky-soft px-4 py-3 text-[13px] font-medium text-[#1B6E96]">
            <Check className="h-4 w-4" />
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-[#1b3767] disabled:opacity-60 sm:w-fit sm:px-8"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          บันทึกแบรนดิ้ง
        </button>
      </div>

      {/* ----------------------------- Preview ----------------------------- */}
      <div className="rounded-2xl border border-ink/[0.07] bg-sky-soft/50 p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
          ตัวอย่างหัวเว็บไซต์
        </p>

        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-ink/[0.07]">
          {form.schoolLogo ? (
            <Image
              src={form.schoolLogo}
              alt=""
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 object-contain"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sky-soft text-[10px] font-bold text-ink-mute">
              โรง
            </span>
          )}

          {form.teamLogo ? (
            <Image
              src={form.teamLogo}
              alt=""
              width={152}
              height={44}
              className="h-11 max-w-[9.5rem] w-auto shrink-0 object-contain"
            />
          ) : (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-soft text-[11px] font-extrabold text-ink">
              PN
            </span>
          )}

          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[15px] font-extrabold text-ink">
              {form.teamName || "PPSESPORT"}
            </span>
            <span className="block truncate text-[9px] font-semibold uppercase tracking-[0.24em] text-ink-mute">
              {form.schoolName || "โรงเรียนพิจิตรพิทยาคม"}
            </span>
          </span>
        </div>

        <p className="mt-4 text-[11.5px] leading-relaxed text-ink-mute">
          โลโก้ทั้งสองจะแสดงที่มุมซ้ายบนของแถบเมนู โดยโลโก้ทีมอยู่ในตำแหน่งเดิมของตรา
          &quot;PN&quot; (คลิกแล้วกลับหน้าแรก) และทั้งสองโลโก้มีความสูงเท่ากัน (หน้าจอเล็กจะซ่อน
          โลโก้โรงเรียนไว้เพื่อความสะอาดของหน้าจอ)
        </p>
      </div>
    </form>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-ink/10 bg-sky-soft/40 px-4 text-[14px] text-ink outline-none transition-all duration-300 placeholder:text-ink-mute/70 focus:border-sky/70 focus:bg-white focus:ring-4 focus:ring-sky/20";
