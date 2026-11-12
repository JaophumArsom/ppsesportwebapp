"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import type { FieldDef } from "@/data/admin-schemas";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  CollectionManager — ฟอร์มเพิ่ม / แก้ไข / ลบ แบบทั่วไป
 * ----------------------------------------------------------------------------
 *  ใช้ร่วมกันทุกชนิดข้อมูล (สมาชิก / ผลงาน / แกลเลอรี) โดยกำหนด schema ของฟิลด์
 * ============================================================================
 */

export interface CollectionItem {
  id?: string;
  slug?: string;
  /** คีย์ที่ใช้จัดกลุ่มสำหรับปุ่มจัดลำดับอัตโนมัติ */
  groupKey?: string;
  [key: string]: unknown;
}

interface Props {
  /** ปลายทาง API เช่น "/api/members" */
  endpoint: string;
  /** เปิดให้ลากจัดลำดับรายการได้ */
  reorderable?: boolean;
  /** กลุ่มสำหรับปุ่ม "จัดลำดับอัตโนมัติ" เช่น [{ id, label }] */
  sortGroups?: { id: string; label: string }[];
  /** ชื่อฟิลด์ที่เก็บค่ากลุ่ม (เช่น "rosterType") */
  groupKeyField?: string;
  /** พารามิเตอร์ของรายการเดียว เช่น "slug" */
  idParam?: string;
  fields: FieldDef[];
  /** ข้อความกำกับใต้ชื่อรายการ */
  subtitle?: string;
  /** ป้ายกำกับใต้ชื่อรายการ (badge) */
  badges?: (item: CollectionItem) => { label: string; className?: string }[];
  /** ข้อความหลักของรายการ */
  primary?: (item: CollectionItem) => string;
  /** ข้อความรองของรายการ */
  secondary?: (item: CollectionItem) => string;
  /** ค่าเริ่มต้นของฟอร์ม */
  defaults?: Record<string, unknown>;
}

export function CollectionManager({
  endpoint,
  idParam = "id",
  fields,
  subtitle,
  badges,
  primary,
  secondary,
  reorderable = false,
  sortGroups,
  groupKeyField = "groupKey",
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dragSlug, setDragSlug] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      setItems(data.items ?? []);
      setError(null);
    } catch {
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(endpoint, { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        setItems(data.items ?? []);
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
  }, [endpoint]);

  const flash = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const reset = () => {
    setForm({});
    setEditingId(null);
  };

  /* ------------------------- จัดลำดับรายการ (ลากวาง) ------------------------- */

  const itemSlug = (item: CollectionItem) =>
    String(item[idParam] ?? item.id ?? "");

  /** ส่งลำดับใหม่ขึ้นเซิร์ฟเวอร์ */
  const persistOrder = async (ordered: CollectionItem[]) => {
    setSavingOrder(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: ordered.map(itemSlug) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "จัดลำดับไม่สำเร็จ");
        return;
      }
      setItems(data.items ?? ordered);
      flash("จัดลำดับใหม่แล้ว");
      router.refresh();
    } catch {
      setError("จัดลำดับไม่สำเร็จ");
    } finally {
      setSavingOrder(false);
    }
  };

  /** ย้ายรายการไปตำแหน่งใหม่ */
  const moveItem = (from: number, to: number) => {
    if (from === to || to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    void persistOrder(next);
  };

  /** จัดลำดับอัตโนมัติตามกลุ่มที่กำหนด (เช่น ตัวจริง → สำรอง → โค้ช → ผู้ควบคุมทีม) */
  const sortByGroups = () => {
    if (!sortGroups?.length) return;
    const rank = new Map(sortGroups.map((g, i) => [g.id, i]));
    const next = [...items].sort((a, b) => {
      const ra = rank.get(String(a[groupKeyField] ?? "")) ?? 999;
      const rb = rank.get(String(b[groupKeyField] ?? "")) ?? 999;
      if (ra !== rb) return ra - rb;
      return 0;
    });
    void persistOrder(next);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const missing = fields.find((field) => field.required && !form[field.key]?.trim());
    if (missing) {
      setError(`กรุณากรอก "${missing.label.replace("*", "")}"`);
      return;
    }

    setSaving(true);
    setError(null);

    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "toggle") {
        payload[field.key] = form[field.key] === "on";
        continue;
      }
      const value = form[field.key] ?? "";
      if (field.type === "number") {
        payload[field.key] = value ? Number(value) : null;
        continue;
      }
      if (field.type === "select") {
        payload[field.key] = value || undefined;
        continue;
      }
      payload[field.key] = value || null;
    }

    try {
      const url = editingId
        ? `${endpoint}/${encodeURIComponent(editingId)}`
        : endpoint;
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "บันทึกไม่สำเร็จ");
        return;
      }

      flash(editingId ? "อัปเดตข้อมูลแล้ว" : "เพิ่มข้อมูลแล้ว");
      reset();
      await load();
      router.refresh();
    } catch {
      setError("บันทึกไม่สำเร็จ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`ลบ "${name}" ออกจริงหรือไม่?`)) return;

    setError(null);
    try {
      const res = await fetch(
        `${endpoint}/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ลบไม่สำเร็จ");
        return;
      }
      if (editingId === id) reset();
      flash("ลบข้อมูลแล้ว");
      await load();
      router.refresh();
    } catch {
      setError("ลบไม่สำเร็จ");
    }
  };

  const startEdit = (item: CollectionItem) => {
    const id = String(item[idParam] ?? item.id ?? "");
    setEditingId(id);
    const next: Record<string, string> = {};
    for (const field of fields) {
      next[field.key] =
        field.type === "toggle"
          ? item[field.key] === true
            ? "on"
            : ""
          : String(item[field.key] ?? "");
    }
    setForm(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:items-start">
      {/* ------------------------------- Form ------------------------------- */}
      <section className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-extrabold text-ink">
            {editingId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูลใหม่"}
          </h2>
          {editingId ? (
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

        <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.key}
              className={cn(
                "flex flex-col gap-1.5",
                field.full && "sm:col-span-2",
              )}
            >
              <label
                htmlFor={`field-${field.key}`}
                className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink-mute"
              >
                {field.label}
              </label>

              {field.type === "toggle" ? (
                <label
                  htmlFor={`field-${field.key}`}
                  className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/10 bg-sky-soft/40 px-4 py-3 transition-colors hover:border-ink/20 hover:bg-sky-soft"
                >
                  <input
                    id={`field-${field.key}`}
                    type="checkbox"
                    checked={form[field.key] === "on"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        [field.key]: e.target.checked ? "on" : "",
                      }))
                    }
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink/20 accent-[#142B50]"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="text-[13.5px] font-semibold text-ink">
                      {field.label}
                    </span>
                    {field.toggleHint ? (
                      <span className="text-[11.5px] leading-relaxed text-ink-mute">
                        {field.toggleHint}
                      </span>
                    ) : null}
                  </span>
                </label>
              ) : field.type === "textarea" ? (
                <textarea
                  id={`field-${field.key}`}
                  rows={3}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className={cn(inputClass, "resize-y")}
                />
              ) : field.type === "select" ? (
                <select
                  id={`field-${field.key}`}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  className={inputClass}
                >
                  <option value="">— ไม่ระบุ —</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`field-${field.key}`}
                  type={
                    field.type === "date"
                      ? "date"
                      : field.type === "number"
                        ? "number"
                        : "text"
                  }
                  inputMode={field.type === "number" ? "numeric" : undefined}
                  min={field.type === "number" ? 0 : undefined}
                  value={form[field.key] ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [field.key]: e.target.value }))
                  }
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )}

              {field.hint ? (
                <p className="flex items-start gap-1.5 text-[11.5px] leading-relaxed text-ink-mute">
                  {field.type === "image" ? (
                    <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  ) : null}
                  {field.hint}
                </p>
              ) : null}
            </div>
          ))}

          {error ? (
            <p className="sm:col-span-2 rounded-xl border border-pink/50 bg-pink-soft px-4 py-3 text-[13px] font-medium text-[#A8447A]">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="sm:col-span-2 flex items-center gap-2 rounded-xl border border-sky/60 bg-sky-soft px-4 py-3 text-[13px] font-medium text-[#1B6E96]">
              <Check className="h-4 w-4" />
              {notice}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white transition-colors hover:bg-[#1b3767] disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editingId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
          </button>
        </form>
      </section>

      {/* ------------------------------- List ------------------------------- */}
      <section className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">
              ทั้งหมด
            </h2>
            <p className="mt-1 text-[13px] text-ink-mute">
              {items.length} รายการ{subtitle ? ` · ${subtitle}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {reorderable && sortGroups?.length ? (
              <button
                type="button"
                onClick={sortByGroups}
                disabled={savingOrder}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-ink/10 px-3 text-[12.5px] font-semibold text-ink-soft transition-colors hover:border-ink/25 hover:bg-sky-soft hover:text-ink disabled:opacity-60"
              >
                {savingOrder ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5" />
                )}
                จัดลำดับอัตโนมัติ
              </button>
            ) : null}
            <button
              type="button"
              onClick={load}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:bg-sky-soft hover:text-ink"
              aria-label="โหลดใหม่"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>

        {reorderable ? (
          <p className="mt-4 flex items-start gap-2 rounded-xl border border-dashed border-ink/15 bg-sky-soft/40 px-4 py-3 text-[12px] leading-relaxed text-ink-mute">
            <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>
              ลากที่หัวหมายเพื่อจัดลำดับ หรือใช้ปุ่มลูกศรขึ้น/ลง — ลำดับนี้จะถูกใช้แสดงผลบนหน้าเว็บทันที
              {sortGroups?.length ? (
                <span className="mt-1 block">
                  ลำดับแนะนำ: {sortGroups.map((g) => g.label).join(" → ")}
                </span>
              ) : null}
            </span>
          </p>
        ) : null}

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-3 py-12 text-ink-mute">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">กำลังโหลด…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-ink/15 bg-sky-soft/50 px-6 py-12 text-center">
            <p className="font-display text-base font-bold text-ink">
              ยังไม่มีข้อมูล
            </p>
            <p className="mt-1.5 text-[13px] text-ink-mute">
              เพิ่มรายการแรกจากฟอร์มด้านซ้าย
            </p>
          </div>
        ) : (
          <ul className="mt-6 flex flex-col gap-3">
            {items.map((item, index) => {
              const id = String(item[idParam] ?? item.id ?? "");
              return (
                <li
                  key={id}
                  draggable={reorderable}
                  onDragStart={() => setDragSlug(id)}
                  onDragEnd={() => setDragSlug(null)}
                  onDragOver={(event) => {
                    if (reorderable) event.preventDefault();
                  }}
                  onDrop={(event) => {
                    if (!reorderable || !dragSlug) return;
                    event.preventDefault();
                    const from = items.findIndex(
                      (entry) => itemSlug(entry) === dragSlug,
                    );
                    setDragSlug(null);
                    if (from !== -1) moveItem(from, index);
                  }}
                  className={cn(
                    "flex flex-wrap items-center gap-4 rounded-xl border border-ink/[0.07] bg-white px-4 py-3 transition-colors hover:border-ink/15",
                    reorderable && "cursor-grab active:cursor-grabbing",
                    dragSlug === id && "opacity-60 ring-2 ring-sky/60",
                  )}
                >
                  {reorderable ? (
                    <span
                      className="hidden shrink-0 text-ink-mute/60 sm:block"
                      aria-hidden="true"
                    >
                      <GripVertical className="h-4 w-4" />
                    </span>
                  ) : null}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-display text-sm font-bold text-ink">
                        {primary ? primary(item) : String(item.id ?? "")}
                      </p>
                      {badges?.(item).map((badge) => (
                        <span
                          key={badge.label}
                          className={cn(
                            "rounded-full bg-ink/[0.05] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-ink-mute",
                            badge.className,
                          )}
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                    {secondary ? (
                      <p className="mt-0.5 truncate text-[12px] text-ink-mute">
                        {secondary(item)}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    {reorderable ? (
                      <>
                        <button
                          type="button"
                          onClick={() => moveItem(index, index - 1)}
                          disabled={index === 0 || savingOrder}
                          aria-label={`ย้าย ${primary ? primary(item) : id} ขึ้น`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-sky/60 hover:bg-sky-soft hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(index, index + 1)}
                          disabled={index === items.length - 1 || savingOrder}
                          aria-label={`ย้าย ${primary ? primary(item) : id} ลง`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-sky/60 hover:bg-sky-soft hover:text-ink disabled:opacity-35 disabled:hover:bg-transparent"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      aria-label="แก้ไข"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-sky/60 hover:bg-sky-soft hover:text-ink"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          id,
                          primary ? primary(item) : String(item.id ?? ""),
                        )
                      }
                      aria-label="ลบ"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-ink/10 text-ink-mute transition-colors hover:border-pink/60 hover:bg-pink-soft hover:text-[#A8447A]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-xl border border-ink/10 bg-sky-soft/40 px-4 text-[14px] text-ink outline-none transition-all duration-300 placeholder:text-ink-mute/70 focus:border-sky/70 focus:bg-white focus:ring-4 focus:ring-sky/20";
