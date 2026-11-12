import "server-only";

import fs from "node:fs/promises";
import path from "node:path";

/**
 * ============================================================================
 *  JSON STORE — ที่เก็บข้อมูลทั้งหมดที่แก้ไขผ่านหน้า Admin ได้
 * ----------------------------------------------------------------------------
 *  ทุกอย่างอยู่ในโฟลเดอร์ `data/` ที่ระดับโปรเจกต์ (runtime-writable)
 * ============================================================================
 */

const DATA_DIR = path.join(process.cwd(), "data");

/** ฟิลด์ที่ใช้เป็นตัวระบุรายการ */
export type ItemKey = "id" | "slug";

export function dataFile(name: string): string {
  return path.join(DATA_DIR, name);
}

/** อ่านรายการจากไฟล์ JSON */
export async function readList<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(dataFile(file), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** เขียนรายการลงไฟล์ JSON */
export async function writeList<T>(file: string, list: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(dataFile(file), `${JSON.stringify(list, null, 2)}\n`, "utf8");
}

/** อ่านไฟล์ JSON ไฟล์เดียว (ไม่ใช่รายการ) */
export async function readObject<T extends object>(
  file: string,
  fallback: T,
): Promise<T> {
  try {
    const raw = await fs.readFile(dataFile(file), "utf8");
    return { ...fallback, ...JSON.parse(raw) };
  } catch {
    return fallback;
  }
}

/** เขียนไฟล์ JSON ไฟล์เดียว */
export async function writeObject<T extends object>(
  file: string,
  value: T,
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(dataFile(file), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

/** เพิ่มรายการใหม่ (ตัวระบุต้องไม่ซ้ำ) */
export async function addItem<T extends object>(
  file: string,
  item: T,
  key: ItemKey = "id",
): Promise<T> {
  const list = await readList<T>(file);
  const record = item as Record<string, unknown>;
  const value = String(record[key as string] ?? "");
  if (
    list.some(
      (existing) =>
        String((existing as Record<string, unknown>)[key as string]) === value,
    )
  ) {
    throw new Error("รหัสซ้ำกับที่มีอยู่แล้ว");
  }
  await writeList(file, [...list, item]);
  return item;
}

/** แก้ไขรายการ */
export async function patchItem<T extends object>(
  file: string,
  id: string,
  patch: Partial<T>,
  key: ItemKey = "id",
): Promise<T | undefined> {
  const list = await readList<T>(file);
  const index = list.findIndex(
    (item) => String((item as Record<string, unknown>)[key as string]) === id,
  );
  if (index === -1) return undefined;

  const next = { ...list[index], ...patch, [key]: id } as T;
  list[index] = next;
  await writeList(file, list);
  return next;
}

/** ลบรายการ */
export async function removeItem<T extends object>(
  file: string,
  id: string,
  key: ItemKey = "id",
): Promise<boolean> {
  const list = await readList<T>(file);
  const next = list.filter(
    (item) => String((item as Record<string, unknown>)[key as string]) !== id,
  );
  if (next.length === list.length) return false;
  await writeList(file, next);
  return true;
}

/**
 * สร้าง slug จากข้อความ
 * - ชื่อที่มีอักษรละติน → ใช้ชื่อนั้น เช่น "pps-shadow"
 * - ชื่อภาษาไทย → ใช้รหัสกลุ่ม + ลำดับ เช่น "rov-player-02"
 */
export function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function hasLatin(text: string): boolean {
  return /[a-z0-9]/.test(text);
}
