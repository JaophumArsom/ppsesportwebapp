# 📸 คู่มือใส่รูปภาพ — PPSESPORT

คู่มือฉบับนี้อธิบายทุกอย่างที่ต้องรู้เพื่อใส่รูปจริงลงเว็บไซต์
อ่านจบแล้วทำตามได้เลยโดยไม่ต้องแตะส่วนอื่นของโค้ด

---

## ภาค 1 — เข้าใจก่อน: รูปภาพไหลผ่านระบบอย่างไร

```
  ไฟล์รูป                    ไฟล์ข้อมูล                  Component                หน้าเว็บ
  ────────                   ──────────                  ──────────                ────────
  public/images/    ──►     src/data/*.ts        ──►    src/components/   ──►    หน้าเว็บ
  members/                   members.ts                       ui/Media.tsx
  rov-player-01.jpg              │                             │
      (ไฟล์จริง)                │ image:                       │ <Image>
                                │   "/images/members/          │   src={...}
                                │    rov-player-01.jpg"        │
                                ▼                             ▼
                          path ที่บันทึกไว้            next/image
                                                           (resize + WebP)
```

### หัวใจสำคัญ 3 ข้อ

1. **ข้อมูล (ข้อความ) และรูปภาพ แยกจากกัน**
   ข้อความอยู่ใน `src/data/*.ts` ส่วนไฟล์รูปอยู่ใน `public/images/`
   ระบบเชื่อมสองอย่างด้วย **path ข้อความ** เช่น `"/images/members/rov-player-01.jpg"`

2. **path ที่ใส่ต้องขึ้นต้นด้วย `/images/`**
   เพราะทุกอย่างใน `public/` ถูกเสิร์ฟที่ root URL
   `public/images/a.jpg` → `https://เว็บคุณ.com/images/a.jpg`

3. **ถ้าใส่ `null` → เว็บจะแสดงกรอบ Placeholder แบบ Branded**
   ซึ่งออกแบบมาให้เข้ากับธีมอยู่แล้ว จึงไม่เสียหายถ้ายังไม่มีรูปจริง
   แต่ถ้าใส่ path ที่ **ไม่มีไฟล์จริง** ภาพจะพัง (ขีดกากบาท) — ดูหัวข้อ 7

---

## ภาค 2 — 3 ขั้นตอน (หลักใจของทุกอย่าง)

### ขั้นที่ 1 — ก๊อปไฟล์รูปเข้า `public/images/`

วางในโฟลเดอร์ที่ถูกต้องตามชนิดของรูป (ดูภาค 3)
ถ้าโฟลเดอร์ยังไม่มี ให้สร้างเองได้เลย

### ขั้นที่ 2 — เขียน path ลงในไฟล์ข้อมูล

แก้ไฟล์ที่เกี่ยวข้องใน `src/data/` ใส่ path ของไฟล์ที่เพิ่งก๊อป

### ขั้นที่ 3 — รีเฟรชเว็บ

```bash
npm run dev                     # โหมดพัฒนา เห็นผลทันที (แนะนำตอนใส่รูป)
```

```bash
npm run build && npm run start  # โหมด production ต้อง build ใหม่ทุกครั้ง
```

> ⚠️ **สำคัญเรื่อง cache**: `npm run start` (production) โหลดไฟล์รูปและ HTML ไว้ใน
> memory ตอนเริ่มเซิร์ฟเวอร์ ถ้าเพิ่มรูปแล้วรูปไม่เปลี่ยน
> → ต้อง `npm run build` ใหม่ แล้ว restart `npm run start`
> ระหว่างพัฒนาให้ใช้ `npm run dev` จะไม่มีปัญหานี้

---

## ภาค 3 — คู่มือแยกตามชนิดของรูป

### 3.1 ภาพปกเกม (Cover) — ใช้ในการ์ดเกม + หน้าเกม

**วางไฟล์ที่**
```
public/images/games/rov/cover.webp        ← ✅ มีแล้ว
public/images/games/freefire/cover.jpg     ← ✅ มีแล้ว
```

**แก้โค้ดที่** `src/data/games.ts`
```ts
{
  slug: "rov",
  cover: "/images/games/rov/cover.jpg",     // ← เขียน path ตรงนี้
  logo: null,                               // ← โลโก้ ถ้ายังไม่มีใส่ null ไว้ก่อน
}
```

**ขนาดแนะนำ** 1600 × 900 px (16:9)

**หน้าตาจะเป็นแบบไหน**
- การ์ดเกมในหน้า Home → รูปกว้างเต็มการ์ด
- หน้า `/games/[slug]` → รูปใหญ่ฝั่งขวา
- หน้า `/games` → รูปใหญ่ฝั่งขวา

---

### 3.2 โลโก้เกม — ป้ายเล็ก ๆ ข้างชื่อเกม

**วางไฟล์ที่**
```
public/images/games/rov/logo.png
public/images/games/freefire/logo.png
```

**แก้โค้ดที่** `src/data/games.ts`
```ts
logo: "/images/games/rov/logo.png",
```

**ขนาดแนะนำ** PNG โปร่งใส กว้างประมาณ 2:1 (เช่น 400 × 200)

**หน้าตาจะเป็นแบบไหน**
ระบบจะวาดเป็น **แบนเนอร์แนวกว้าง** (96×54 px) เพื่อให้โลโก้แบบ wordmark
อ่านออกชัด ถ้ายังไม่ใส่ `logo` ระบบจะแสดงตราสัญลักษณ์ข้อความ "RoV" / "FF"
แทน (ดีไซน์สำรอง ดูได้ที่ `src/components/games/GameLogo.tsx`)

> 💡 ถ้า cover ของคุณเป็นภาพโลโก้อยู่แล้ว (เช่น Free Fire ตอนนี้)
> ใส่ path เดียวกันในทั้ง `cover` และ `logo` ได้เลย

---

### 3.3 รูปสมาชิก — การ์ดสมาชิก + หน้าโปรไฟล์

**วางไฟล์ที่**
```
public/images/members/rov-player-01.jpg
public/images/members/ff-coach-01.jpg
public/images/members/org-advisor-01.jpg
... (ดูรายชื่อทั้งหมดในภาค 4)
```

**แก้โค้ดที่** `src/data/members.ts`
```ts
{
  slug: "rov-player-01",
  realName: "RoV Player 01",
  inGameName: "PPS_IGN_01",
  role: "นักกีฬา / Player — Mid",
  category: "rov",
  game: "rov",
  bio: "...",
  image: "/images/members/rov-player-01.jpg",   // ← เขียน path ตรงนี้
  highlights: ["..."],
  socials: [],
  order: 1,
}
```

**ขนาดแนะนำ** 800 × 1000 px (4:5) — แนวตั้ง

**หน้าตาจะเป็นแบบไหน**
- การ์ดสมาชิกในหน้า `/members` → รูปสี่เหลี่ยมจัตุรัส 80×80 px
- หน้าโปรไฟล์ `/members/[slug]` → รูปใหญ่แนวตั้งฝั่งซ้าย

> 💡 ระบบใช้ `object-cover` คือรูปจะถูก **ตัดให้เต็มกรอบเสมอ**
> ถ้าอัดส่วนสำคัญไว้กลาง ๆ รูปจะไม่ถูกตัด แต่ถ้าอยู่ข้าง ๆ อาจถูกตัดทิ้ง

---

### 3.4 รูปถ้วยรางวัล — การ์ดผลงานการแข่งขัน

**วางไฟล์ที่**
```
public/images/achievements/ach-001.jpg
public/images/achievements/ach-002.jpg
...
```

**แก้โค้ดที่** `src/data/achievements.ts`
```ts
{
  id: "ach-001",
  tournament: "ชื่อรายการแข่งขัน",
  game: "rov",
  rank: "อันดับ 1",
  tier: "champion",
  scope: "national",
  date: "2025-11-08",
  teamName: "PPS ROV",
  image: "/images/achievements/ach-001.jpg",   // ← เขียน path ตรงนี้
  note: "...",
}
```

**ขนาดแนะนำ** 1200 × 900 px (4:3)

**หน้าตาจะเป็นแบบไหน**
รูปด้านบนของการ์ด มีทับด้วยไล่สีเข้ม + ป้ายอันดับ (ทอง = แชมป์, เงิน = รองชนะเลิศ, ฟ้า = Top 3)

---

## ภาค 4 — Checklist รายชื่อไฟล์ทั้งหมด

### 4.1 ภาพปกเกม (2)

```
public/images/games/rov/cover.webp        ← ✅ มีแล้ว
public/images/games/freefire/cover.jpg     ← ✅ มีแล้ว
```

### 4.2 โลโก้เกม (2 — ใส่ถ้ามี)

```
public/images/games/rov/logo.png
public/images/games/freefire/logo.png           ← ตอนนี้ใช้ cover แทนชั่วคราว
```

### 4.3 รูปสมาชิก (21)

```
public/images/members/org-advisor-01.jpg
public/images/members/org-manager-01.jpg
public/images/members/org-coordinator-01.jpg
public/images/members/rov-player-01.jpg
public/images/members/rov-player-02.jpg
public/images/members/rov-player-03.jpg
public/images/members/rov-player-04.jpg
public/images/members/rov-player-05.jpg
public/images/members/rov-coach-01.jpg
public/images/members/rov-manager-01.jpg
public/images/members/ff-player-01.jpg
public/images/members/ff-player-02.jpg
public/images/members/ff-player-03.jpg
public/images/members/ff-player-04.jpg
public/images/members/ff-coach-01.jpg
public/images/members/ff-manager-01.jpg
public/images/members/staff-designer-01.jpg
public/images/members/staff-creator-01.jpg
public/images/members/staff-photographer-01.jpg
public/images/members/staff-production-01.jpg
public/images/members/staff-support-01.jpg
```

### 4.4 รูปถ้วยรางวัล (10)

```
public/images/achievements/ach-001.jpg
public/images/achievements/ach-002.jpg
public/images/achievements/ach-003.jpg
public/images/achievements/ach-004.jpg
public/images/achievements/ach-005.jpg
public/images/achievements/ach-006.jpg
public/images/achievements/ach-007.jpg
public/images/achievements/ach-008.jpg
public/images/achievements/ach-009.jpg
public/images/achievements/ach-010.jpg
```

**รวมทั้งหมด 33 ไฟล์**

---

## ภาค 5 — ตารางขนาดและสัดส่วน

| ประเภท | ขนาด (px) | สัดส่วน | ใช้ที่ไหน | ความสำคัญ |
| --- | --- | --- | --- | --- |
| Cover เกม | 1600 × 900 | 16:9 | การ์ดเกม, hero | สูง |
| โลโก้เกม | 400 × 400 | 1:1 | ป้ายข้างชื่อเกม | กลาง |
| รูปสมาชิก | 800 × 1000 | 4:5 | การ์ด, หน้าโปรไฟล์ | สูง |
| ถ้วยรางวัล | 1200 × 900 | 4:3 | การ์ดผลงาน | กลาง |

### เรื่องความเร็ว (สำคัญ)

ระบบใช้ `next/image` ซึ่ง:
- resize รูปให้พอดีกับกรอบที่แสดงผล
- แปลงเป็น **WebP / AVIF** อัตโนมัติ (เล็กกว่า JPG 30–50%)
- โหลดแบบ lazy (ยกเว้นรูปแรกที่ `priority`)

→ ถ้าใส่รูปต้นฉบับ 4000px ก็ยังเร็ว เพียงแต่ยิ่งใหญ่ยิ่งเสียเวลา build
→ แนะนำไม่เกิน **2000px** ด้านยาว และบันทึกเป็น `.jpg` คุณภาพ 80+ หรือ `.webp`

---

## ภาค 6 — วิธีเพิ่มสมาชิก / ผลงาน / ภาพใหม่ (พร้อมรูป)

### เพิ่มสมาชิกใหม่

**1. ก๊อปรูป** → `public/images/members/<slug>.jpg`

**2. เพิ่มข้อมูล** ใน `src/data/members.ts`
```ts
{
  slug: "rov-player-06",                       // ← ต้องตรงกับชื่อไฟล์
  realName: "ชื่อจริง",
  inGameName: "PPS_IGN_06",
  role: "นักกีฬา / Player — Exp",
  category: "rov",                             // organization | rov | freefire | staff
  game: "rov",
  bio: "ประวัติย่อ...",
  image: "/images/members/rov-player-06.jpg",  // ← path ของไฟล์
  highlights: ["จุดเด่น 1", "จุดเด่น 2"],
  socials: [{ label: "Facebook", href: "https://facebook.com/..." }],
  order: 6,
}
```

**3. รีเฟรช** → เว็บจะสร้างหน้า `/members/rov-player-06` ให้อัตโนมัติ

> 🔑 `slug` คือตัวกำหนด URL ของหน้านั้น และต้อง**ไม่ซ้ำ**กับของเดิม
> ถ้าเปลี่ยน slug ของคนที่มีอยู่แล้ว URL เดิมจะพัง

### เพิ่มผลงานใหม่

**1. ก๊อปรูป** → `public/images/achievements/ach-011.jpg`
**2. เพิ่มข้อมูล** ใน `src/data/achievements.ts` (ใส่ `id` ที่ไม่ซ้ำ)
**3. เลือก `tier` ให้ถูก** เพราะมันกำหนดสีป้ายอันดับ:

| tier | ป้าย | สี |
| --- | --- | --- |
| `champion` | CHAMPION | ทอง |
| `runner-up` | RUNNER-UP | เงิน |
| `third` / `top3` | TOP 3 | ฟ้า |
| `top8` | TOP 8 | ชมพู |
| `qualify` | QUALIFIED | เทา |

### เพิ่มสมาชิกใหม่

**1. ก๊อปรูป** → `public/images/members/<slug>.jpg`

**2. เพิ่มข้อมูล** ใน `src/data/members.ts`
```ts
{
  slug: "rov-player-06",                       // ← ต้องตรงกับชื่อไฟล์
  realName: "ชื่อจริง",
  inGameName: "PPS_IGN_06",
  role: "นักกีฬา / Player — Exp",
  category: "rov",                             // organization | rov | freefire | staff
  game: "rov",
  bio: "ประวัติย่อ...",
  image: "/images/members/rov-player-06.jpg",  // ← path ของไฟล์
  highlights: ["จุดเด่น 1", "จุดเด่น 2"],
  socials: [{ label: "Facebook", href: "https://facebook.com/..." }],
  order: 6,
}
```

**3. รีเฟรช** → เว็บจะสร้างหน้า `/members/rov-player-06` ให้อัตโนมัติ

> 🔑 `slug` คือตัวกำหนด URL ของหน้านั้น และต้อง**ไม่ซ้ำ**กับของเดิม
> ถ้าเปลี่ยน slug ของคนที่มีอยู่แล้ว URL เดิมจะพัง

### เพิ่มผลงานใหม่

**1. ก๊อปรูป** → `public/images/achievements/ach-011.jpg`
**2. เพิ่มข้อมูล** ใน `src/data/achievements.ts` (ใส่ `id` ที่ไม่ซ้ำ)
**3. เลือก `tier` ให้ถูก** เพราะมันกำหนดสีป้ายอันดับ:

| tier | ป้าย | สี |
| --- | --- | --- |
| `champion` | CHAMPION | ทอง |
| `runner-up` | RUNNER-UP | เงิน |
| `third` / `top3` | TOP 3 | ฟ้า |
| `top8` | TOP 8 | ชมพู |
| `qualify` | QUALIFIED | เทา |

---

## ภาค 7 — แก้ปัญหาที่พบบ่อย

| อาการ | สาเหตุ | วิธีแก้ |
| --- | --- | --- |
| ภาพพัง (ขีดกากบาท) | path ในข้อมูลไม่ตรงกับไฟล์จริง | เช็ค 2 อย่าง: (1) path ขึ้นต้น `/images/` (2) ชื่อไฟล์ตรงกัน case-sensitive |
| ภาพไม่เปลี่ยน | ใช้ `npm run start` ซึ่ง cache ไฟล์ไว้ | `npm run build` ใหม่ แล้ว restart |
| ภาพเล็ก / ทรงผิด | อัตราส่วนไฟล์ไม่ตรงกับกรอบที่ใช้ | ใช้รูปที่ตัดมาแล้ว หรือปรับขนาดตามตารางข้างบน |
| ภาพถูกตัดส่วนสำคัญ | `object-cover` ตัดขอบอัตโนมัติ | จัดตำแหน่งสำคัญไว้กลางภาพ หรือใช้ `position` prop |
| รูปไม่ขึ้นในหน้าแรก | ยังไม่ได้ build ใหม่ | รัน `npm run build && npm run start` |
| `EADDRINUSE` พอร์ต 3000 | เซิร์ฟเวอร์เก่ายังค้าง | `Stop-Process -Id (PID) -Force` |
| ไฟล์รูปใหญ่เกิน 2MB | บันทึกจากกล้อง/โทรศัพท์โดยไม่ย่อ | บันทึกใหม่เป็น `.jpg` คุณภาพ 80 หรือใช้ `.webp` |

---

## ภาค 8 — สรุปสั้น ๆ (สิ่งที่ต้องจำ)

```
1. ก๊อปไฟล์รูป → public/images/<ชนิด>/<ชื่อที่ตรงกับ slug หรือ id>
2. ใส่ path ใน src/data/<ไฟล์>.ts   →   image: "/images/....jpg"
3. รีเฟรช (npm run dev)
```

**เส้นทางไฟล์สำคัญ**

| เส้นทาง | หน้าที่ |
| --- | --- |
| `public/images/` | เก็บไฟล์รูปทั้งหมด |
| `src/data/games.ts` | ข้อมูลเกม + `cover` + `logo` |
| `src/data/members.ts` | ข้อมูลสมาชิก + `image` |
| `src/data/achievements.ts` | ข้อมูลผลงาน + `image` |
| `src/components/ui/Media.tsx` | Component ที่ใช้แสดงรูปทั้งหมด (รูปจริง / Placeholder) |
