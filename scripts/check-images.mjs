/**
 * ============================================================================
 *  check-images.mjs — ตรวจไฟล์ข้อมูลก่อน build
 * ----------------------------------------------------------------------------
 *  1. JSON ต้อง parse ผ่าน (กันพังตอนแก้ไฟล์ผ่าน GitHub เว็บ)
 *  2. path ของรูปต้องตรงกับไฟล์จริงแบบ case-sensitive
 *     (macOS / Linux / Vercel แยก "RoV.jpg" กับ "rov.jpg" ได้)
 * ============================================================================
 */

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const dataDir = path.join(root, "data");

/* ---------------------------- 1) ตรวจ JSON ---------------------------- */

const refs = [];
let invalidJson = 0;

if (fs.existsSync(dataDir)) {
  for (const file of fs.readdirSync(dataDir)) {
    if (!file.endsWith(".json")) continue;
    const abs = path.join(dataDir, file);

    let data;
    try {
      data = JSON.parse(fs.readFileSync(abs, "utf8"));
    } catch (error) {
      invalidJson += 1;
      console.error(
        `\n❌ JSON ผิดรูปแบบ: data/${file}\n   ${error.message}\n   แก้ไขให้เป็น JSON ที่ถูกต้อง เช่น ไม่มีเครื่องหมายจุลภาคท้ายสุด และใช้ " แทน ' ได้`,
      );
      continue;
    }

    const walkData = (node) => {
      if (typeof node === "string") {
        if (node.startsWith("/images/")) {
          refs.push({ from: `data/${file}`, path: node });
        }
        return;
      }
      if (Array.isArray(node)) {
        node.forEach(walkData);
        return;
      }
      if (node && typeof node === "object") {
        Object.values(node).forEach(walkData);
      }
    };
    walkData(data);
  }
}

if (invalidJson > 0) {
  process.exit(1);
}

/* ---------------------- 2) ตรวจ path ของรูป (case-sensitive) ---------------------- */

const realFiles = new Map(); // lower-case -> path จริง

(function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs);
    else {
      const rel = "/" + path.relative(publicDir, abs).split(path.sep).join("/");
      realFiles.set(rel.toLowerCase(), rel);
    }
  }
})(publicDir);

const missing = [];
const caseMismatch = [];

for (const ref of refs) {
  const actual = realFiles.get(ref.path.toLowerCase());

  if (!actual) {
    missing.push(ref);
  } else if (actual !== ref.path) {
    caseMismatch.push({ ...ref, actual });
  }
}

console.log(`[check-images] ตรวจ JSON ผ่าน · path ของรูป ${refs.length} จุด`);

if (missing.length) {
  console.log(`\n⚠️  ยังไม่มีไฟล์รูป ${missing.length} จุด (จะแสดง Placeholder แทน):`);
  missing.forEach((r) => console.log(`   · ${r.path}   (${r.from})`));
}

if (caseMismatch.length) {
  console.log(`\n❌ ชื่อไฟล์ไม่ตรงตัวพิมพ์ (case) ${caseMismatch.length} จุด — จะพังบน macOS/Linux/Vercel:`);
  caseMismatch.forEach((r) =>
    console.log(
      `   · path: ${r.path}\n     ไฟล์จริง: ${r.actual}\n     แก้: เปลี่ยนชื่อไฟล์เป็น "${r.path.split("/").pop()}" หรือแก้ path ใน ${r.from}`,
    ),
  );
  process.exit(1);
}

if (!missing.length) {
  console.log("✅ ทุก path ตรงกับไฟล์จริงแบบ case-sensitive");
}
