"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/Primitives";
import { categoryLabel, memberCategories, memberGames } from "@/data/member-meta";
import type { Member, MemberCategory } from "@/types";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  MemberManager — หน้าจัดการสมาชิก (เพิ่ม / แก้ไข / ลบ)
 * ----------------------------------------------------------------------------
 *  บันทึกลงไฟล์ data/members.json ผ่าน API /api/members
 * ============================================================================
 */

type FormState = {
  realName: string;
  inGameName: string;
  role: string;
  category: MemberCategory;
  game: "" | "rov" | "freefire";
  bio: string;
  image: string;
};

const emptyForm: FormState = {
  realName: "",
  inGameName: "",
  role: "",
  category: "rov",
  game: "rov",
  bio: "",
  image: "",
};

export function MemberManager() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members", { cache: "no-store" });
      const data = await res.json();
      setMembers(data.members ?? []);
      setError(null);
    } catch {
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, []);

  // โหลดข้อมูลครั้งแรก (มี guard กันการอัปเดต state หลัง unmount)
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/members", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setMembers(data.members ?? []);
        setError(null);
      } catch {
        if (!active) return;
        setError("โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const reset = () => {
    setForm(emptyForm);
    setEditing(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.realName.trim()) {
      setError("กรุณากรอกชื่อจริง");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      realName: form.realName,
      inGameName: form.inGameName,
      role: form.role,
      category: form.category,
      game: form.category === "rov" || form.category === "freefire" ? form.game : undefined,
      bio: form.bio,
      image: form.image,
    };

    try {
      const res = await fetch(
        editing ? `/api/members/${editing}` : "/api/members",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "บันทึกไม่สำเร็จ");
        return;
      }

      flash(editing ? "อัปเดตข้อมูลแล้ว" : "เพิ่มสมาชิกแล้ว");
      reset();
      await load();
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`ลบ ${name} ออกจริงหรือไม่?`)) return;

    setError(null);
    try {
      const res = await fetch(`/api/members/${slug}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "ลบไม่สำเร็จ");
        return;
      }

      if (editing === slug) reset();
      flash("ลบสมาชิกแล้ว");
      await load();
      router.refresh();
    } catch {
      setError("ลบไม่สำเร็จ");
    }
  };

  const startEdit = (member: Member) => {
    setEditing(member.slug);
    setOpen(true);
    setForm({
      realName: member.realName,
      inGameName: member.inGameName === "—" ? "" : member.inGameName,
      role: member.role,
      category: member.category,
      game: (member.game ?? "") as FormState["game"],
      bio: member.bio,
      image: member.image ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
      {/* ------------------------------- Form ------------------------------- */}
      <section className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-ink">
            {editing ? "แก้ไขสมาชิก" : "เพิ่มสมาชิกใหม่"}
          </h2>
          {editing ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-mute transition-colors hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
              ยกเลิก
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <Field label="ชื่อจริง *">
            <input
              value={form.realName}
              onChange={(e) => update("realName", e.target.value)}
              placeholder="เช่น สมชาย ใจดี"
              className={inputClass}
            />
          </Field>

          <Field label="ชื่อเล่น / In-game name">
            <input
              value={form.inGameName}
              onChange={(e) => update("inGameName", e.target.value)}
              placeholder="เช่น PPS_IGN_01"
              className={inputClass}
            />
          </Field>

          <Field label="ตำแหน่ง">
            <input
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              placeholder="เช่น นักกีฬา / Player — Mid"
              className={inputClass}
            />
          </Field>

          <Field label="หมวดหมู่ *">
            <select
              value={form.category}
              onChange={(e) =>
                update("category", e.target.value as MemberCategory)
              }
              className={inputClass}
            >
              {memberCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          {form.category === "rov" || form.category === "freefire" ? (
            <Field label="สายเกม">
              <select
                value={form.game}
                onChange={(e) =>
                  update("game", e.target.value as FormState["game"])
                }
                className={inputClass}
              >
                {memberGames.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          <Field label="แนะนำตัวสั้น ๆ">
            <textarea
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={3}
              placeholder="ประวัติย่อ / จุดเด่นของสมาชิก"
              className={cn(inputClass, "resize-y")}
            />
          </Field>

          <Field label="พาธรูปโปรไฟล์">
            <input
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="/images/members/xxx.jpg"
              className={inputClass}
            />
            <p className="mt-1.5 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
              <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              วางไฟล์รูปไว้ที่ <code className="text-ink">public/images/members/</code>{" "}
              แล้วใส่ชื่อไฟล์ เช่น{" "}
              <code className="text-ink">/images/members/rov-player-02.jpg</code>
            </p>
          </Field>

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
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-[#1b3767] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editing ? "บันทึกการแก้ไข" : "เพิ่มสมาชิก"}
          </button>
        </form>
      </section>

      {/* ------------------------------- List ------------------------------- */}
      <section className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">
              สมาชิกทั้งหมด
            </h2>
            <p className="mt-1 text-[13px] text-ink-mute">
              {members.length} คน · บันทึกลง <code>data/members.json</code> อัตโนมัติ
            </p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:bg-sky-soft hover:text-ink"
            aria-label="โหลดใหม่"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-3 py-12 text-ink-mute">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">กำลังโหลด…</span>
          </div>
        ) : members.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-ink/15 bg-sky-soft/50 px-6 py-12 text-center">
            <p className="font-display text-base font-bold text-ink">
              ยังไม่มีสมาชิก
            </p>
            <p className="mt-1.5 text-[13px] text-ink-mute">
              เพิ่มสมาชิกคนแรกจากฟอร์มด้านซ้าย
            </p>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {members.map((member) => (
              <li
                key={member.slug}
                className="flex flex-wrap items-center gap-4 rounded-xl border border-ink/[0.07] bg-white px-4 py-3 transition-colors hover:border-ink/15"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-display text-sm font-bold text-ink">
                      {member.realName}
                    </p>
                    <Badge tone="neutral" className="px-2.5 py-0.5 text-[9px]">
                      {categoryLabel[member.category]}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-ink-mute">
                    {member.inGameName !== "—" ? `${member.inGameName} · ` : ""}
                    {member.role}
                  </p>
                  <p className="mt-0.5 truncate font-mono text-[11px] text-ink-mute">
                    /members/{member.slug}
                  </p>
                </div>

                <div className="flex shrink-0 gap-1.5">
                  <button
                    type="button"
                    onClick={() => startEdit(member)}
                    aria-label={`แก้ไข ${member.realName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-sky/60 hover:bg-sky-soft hover:text-ink"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(member.slug, member.realName)}
                    aria-label={`ลบ ${member.realName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-pink/60 hover:bg-pink-soft hover:text-[#A8447A]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-6 text-[12.5px] font-semibold text-ink-mute underline decoration-pink decoration-2 underline-offset-4 transition-colors hover:text-ink lg:hidden"
        >
          {open ? "ซ่อนฟอร์ม" : "แสดงฟอร์มเพิ่มสมาชิก"}
        </button>
      </section>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-ink/10 bg-sky-soft/40 px-4 text-[14px] text-ink outline-none transition-all duration-300 placeholder:text-ink-mute/70 focus:border-sky/70 focus:bg-white focus:ring-4 focus:ring-sky/20";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}
