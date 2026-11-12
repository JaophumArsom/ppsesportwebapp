# 🚀 คู่มือ Deploy: GitHub + Vercel

คู่มือนี้เขียนเฉพาะโปรเจกต์ **PPSESPORT** เลยครับ

---

## ✅ สิ่งที่ผมเตรียมไว้ให้แล้ว

| สิ่งที่ทำ | ทำไม |
|---|---|
| `git init` + commit แรกแล้ว (97 ไฟล์) | ไม่มี `node_modules` / `.next` / `.env` ปน |
| `next.config.ts` → `outputFileTracingIncludes` | ให้แน่ใจว่าโฟลเดอร์ `data/` **ถูกแพ็กไปบน Vercel** (โค้ดอ่านไฟล์ด้วย `fs.readFile` ซึ่ง Next.js มักหาไฟล์ไม่เจอเอง) |
| `package.json` → `engines.node: ">=20.9.0"` | ให้ Vercel ใช้ Node เวอร์ชันที่ถูกต้อง |
| `scripts/check-images.mjs` (รันก่อน build) | กันภาพพังจากชื่อไฟล์ตัวพิมพ์ใหญ่/เล็ก ตอน deploy บน Linux |

---

## 📌 เข้าใจเรื่องนี้ก่อน (สำคัญที่สุด)

> ⚠️ **หน้า Admin บน Vercel จะ "อ่านได้ แต่เขียนไม่ได้"**
>
> เพราะระบบไฟล์ของ Vercel เป็น **read-only** (ไม่ใช่ดิสก์จริง)
> → การ**อ่าน**ข้อมูล (ดูเว็บ) ทำงานปกติ ✅
> → การ**เพิ่ม/แก้ไข/ลบ**ผ่านหน้า Admin **จะ error** ❌

### มี 3 ทางเลือก

| ทางเลือก | ความยาก | Admin ใช้ได้บน production? | เหมาะกับ |
|---|---|---|---|
| **A. จัดการข้อมูลผ่าน Git** (แนะนำตอนนี้) | ⭐ ง่ายมาก | ❌ (แก้ในเครื่องตัวเองแล้ว push) | ทีมเล็ก แก้ข้อมูลไม่บ่อย |
| **B. ต่อ Supabase** | ปานกลาง | ✅ เต็มที่ | ต้องให้ทีมแก้ข้อมูลจากที่ไหนก็ได้โดยไม่ต้อง commit |
| **C. Vercel Blob / KV** | ปานกลาง | ✅ | อยากเก็บรูปใน cloud |

> 💡 **คำแนะนำ: เริ่มจาก A ก่อน** ให้เว็บขึ้น production ได้เร็วๆ ค่อยค่อยอัปเกรดเป็น B ทีหลัง
> ขั้นตอนต่อ Supabase มีอยู่ใน `README.md` หัวข้อ "การเชื่อมต่อ Supabase"

---

## ส่วนที่ 1 — สร้าง Repo บน GitHub

### 1.1 สร้าง repo (ผ่านเว็บ — ง่ายที่สุด)

1. เปิด https://github.com/new
2. **Repository name**: `ppsesportwebapp`
3. **Public** (เพื่อให้ Vercel อ่านได้ฟรี) หรือ Private + ต่อ Vercel แบบ GitHub App
4. ✅ **Add a README file** → **ไม่ต้องเลือก** (เรามี README แล้ว)
5. ✅ **Add .gitignore** → **ไม่ต้องเลือก**
6. กด **Create repository**

### 1.2 ผูก repo เข้ากับเครื่องตัวเอง + push

```bash
cd C:\Users\witch\OneDrive\Desktop\project\ppsesportwebapp

# เพิ่ม remote (แทน <ชื่อuser> / <ชื่อrepo> ด้วยของจริง)
git remote add origin https://github.com/<ชื่อuser>/ppsesportwebapp.git

# ตั้ง branch หลักเป็น main
git branch -M main

# ส่งขึ้น GitHub
git push -u origin main
```

> ถ้า GitHub ถามรหัสผ่าน → ใช้ **Personal Access Token** (ไม่ใช่รหัสผ่านบัญชี) สร้างที่
> GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
> ให้สิทธิ์ `repo` + `workflow`

**ทางเลือก: ใช้ GitHub CLI (ถ้าติดตั้ง `gh`)**
```bash
gh auth login
gh repo create ppsesportwebapp --public --source=. --push
```

---

## ส่วนที่ 2 — Deploy บน Vercel

### 2.1 เข้าเว็บ Vercel

1. เปิด https://vercel.com → **Sign Up** (ใช้ GitHub account ง่ายสุด)
2. ติดตั้ง Vercel GitHub App → เลือก repo `ppsesportwebapp` → **Install**

### 2.2 Import Project

1. หน้า Dashboard → กด **Add New... → Project**
2. เลือก repo `ppsesportwebapp` → **Import**
3. ตรวจ settings:

| ช่อง | ค่า |
|---|---|
| **Framework Preset** | `Next.js` (ตรวจให้อัตโนมัติ) |
| **Root Directory** | เว้นว่าง (อยู่ที่ root แล้ว) |
| **Install Command** | `npm install` (default) |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | เว้นว่าง (default) |
| **Environment Variables** | ยังไม่ต้องใส่อะไร — ถ้าจะต่อ Supabase ค่อยเพิ่มทีหลัง |

4. กด **Deploy**

> ⏱️ รอประมาณ 1–3 นาที
> เมื่อเสร็จจะได้ URL เช่น `https://ppsesportwebapp.vercel.app`

### 2.3 (ทางเลือก) Deploy ด้วย Vercel CLI

```bash
npm i -g vercel
vercel          # deploy แบบ preview
vercel --prod   # deploy production
```

---

## ส่วนที่ 3 — หลัง Deploy

### 3.1 แก้ URL จริงในข้อมูลเว็บ (สำคัญต่อ SEO)

```bash
# แก้ src/data/site.ts
#   url: "https://ppsesportwebapp.vercel.app"
git add .
git commit -m "chore: set production url"
git push
```
→ Vercel จะ **redeploy อัตโนมัติ** และ `sitemap.xml` / `robots.txt` / OpenGraph จะชี้ถูกโดเมน

### 3.2 ตั้งโดเมนของตัวเอง (ถ้ามี)

Vercel → Project → **Settings → Domains** → เพิ่มโดเมน
(โดเมน `.com` ต้องซื้อที่ Namecheap/GoDaddy ฯลฯ แล้วชี้ DNS ไปที่ Vercel)

### 3.3 ตั้งค่า Environment Variables (ตอนต่อ Supabase)

Vercel → Project → **Settings → Environment Variables**

| ชื่อ | ค่า |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

> ⚠️ Environment variables ที่เพิ่มใน Vercel ต้อง **Redeploy** ถึงจะมีผล

---

## ส่วนที่ 4 — ทำงานต่อเนื่อง (Workflow)

```
แก้โค้ด/ข้อมูลบนเครื่อง
        ↓
git add . && git commit -m "..."
        ↓
git push
        ↓
Vercel ตรวจจับ commit → build ใหม่ → ขึ้น production อัตโนมัติ (~1-3 นาที)
```

### อัปเดตข้อมูลนักกีฬาแบบทางเลือก A (ผ่าน Git)

```bash
# 1. เปิดหน้า Admin บนเครื่องตัวเอง → http://localhost:3000/admin
#    เพิ่ม/ลบ/จัดลำดับผู้เล่นตามปกติ
# 2. บันทึกการเปลี่ยนแปลง
git add data/
git commit -m "data: อัปเดตรายชื่อนักกีฬา"
git push
```

---

## ส่วนที่ 5 — แก้ปัญหา

| อาการ | สาเหตุ | แก้ |
|---|---|---|
| Build ล้ม "Module not found" | ไม่ได้ install dependency | ตรวจว่า `package-lock.json` ถูก commit แล้ว |
| Build ล้มที่ `images:check` | ชื่อไฟล์รูปตัวพิมพ์ไม่ตรง | ทำตามที่สคริปต์บอก — เปลี่ยนชื่อไฟล์ให้เป็นตัวพิมพ์เล็กทั้งหมด |
| หน้าเว็บข้อมูลว่าง | `data/` ไม่ถูกแพ็ก | ตรวจว่า `next.config.ts` มี `outputFileTracingIncludes` (มีแล้ว) แล้ว redeploy |
| เพิ่มผู้เล่นใน Admin บน Vercel แล้วไม่ขึ้น | filesystem เป็น read-only | ใช้ทางเลือก A (commit + push) หรือต่อ Supabase |
| รูปไม่ขึ้นบน production แต่ขึ้นบนเครื่อง | ตัวพิมพ์ชื่อไฟล์ต่างกัน | `npm run images:check` |
| อยาก rollback | — | Vercel → Deployments → เมนู `...` → **Promote to Production** |
| อยาก preview ก่อน merge | — | เปิด Pull Request ใน GitHub → Vercel จะสร้าง Preview URL ให้อัตโนมัติ |

---

## 🎁 เคล็ดลับ

**Preview Deployment** — ทุก Pull Request จะได้ URL ของตัวเอง ทดสอบได้ก่อน merge

**Environment แยก** — Vercel ให้ตั้งค่าแยก Production / Preview / Development

**Analytics** — Vercel → Project → Analytics (ฟรี แต่ต้องเปิด Web Analytics ใน next.config)

**Deploy จากเครื่องตัวเอง (ไม่ผ่าน GitHub)**
```bash
npx vercel --prod --yes
```

---

## 📋 Checklist ก่อนกด Deploy

- [ ] `npm run lint` ไม่มี error
- [ ] `npm run build` ผ่าน
- [ ] `npm run images:check` ผ่าน (ไม่มี case mismatch)
- [ ] แก้ `site.url` ใน `src/data/site.ts` เป็นโดเมนจริง
- [ ] ตรวจว่า `data/*.json` ไม่มีข้อมูลตัวอย่างค้างอยู่
- [ ] ตรวจว่าไม่มีรหัสผ่าน/คีย์ในโค้ด (ใช้ `.env.local` แทน)
- [ ] `git status` สะอาด (ไม่มีไฟล์ค้างที่ยังไม่ commit)

---

พร้อมแล้วครับ — เหลือแค่สร้าง repo บน GitHub + import บน Vercel 🎯
