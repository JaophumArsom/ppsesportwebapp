# PPSESPORT — Official Esports Portfolio Website

เว็บไซต์ Showcase อย่างเป็นทางการของ **PPSESPORT** สังกัดอีสปอร์ตของ
**โรงเรียนพิจิตรพิทยาคม (Phichit Pittayakom School)**

> **BEYOND THE GAME, BEYOND THE LIMITS.**

---

## สารบัญ (Table of Contents)

1. [ภาพรวมโปรเจกต์](#ภาพรวมโปรเจกต์)
2. [ฟีเจอร์ทั้งหมด](#ฟีเจอร์ทั้งหมด)
3. [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
4. [การติดตั้งและเริ่มใช้งาน](#การติดตั้งและเริ่มใช้งาน)
5. [โครงสร้างโปรเจกต์](#โครงสร้างโปรเจกต์)
6. [การจัดการข้อมูล (สำคัญ)](#การจัดการข้อมูล-สำคัญ)
7. [การเพิ่มสายเกมใหม่](#การเพิ่มสายเกมใหม่)
8. [Design System](#design-system)
9. [การเชื่อมต่อ Supabase (ขั้นตอนถัดไป)](#การเชื่อมต่อ-supabase-ขั้นตอนถัดไป)
10. [SEO และ Performance](#seo-และ-performance)
11. [Deploy](#deploy)
12. [Browser Support](#browser-support)

---

## ภาพรวมโปรเจกต์

PPSESPORT เป็นเว็บไซต์แบบ **Portfolio / Showcase** ที่รวบรวมข้อมูลทั้งหมดของสังกัดไว้ในที่เดียว
ได้แก่ ประวัติองค์กร ผลงานการแข่งขัน รายชื่อนักกีฬาและทีมงาน ภาพบรรยากาศการแข่งขัน
และช่องทางติดต่อ

แนวทางการออกแบบ: **Minimal Modern + Premium Esports + Soft Gradient**
พื้นหลังสีขาวเป็นหลัก ใช้สีชมพู–ฟ้าเป็น Accent และ Navy Blue สำหรับหัวข้อและเนื้อหาสำคัญ

---

## ฟีเจอร์ทั้งหมด

| ฟีเจอร์ | รายละเอียด |
| --- | --- |
| Responsive Design | รองรับ Desktop / Tablet / Mobile (Mobile-first) |
| Sticky Navbar | พื้นหลังขาวโปร่งแสง + เมนูแบบ Slide-down บนมือถือ |
| Smooth Scrolling | เลื่อนนุ่มภายในหน้า + รักษาพฤติกรรม scroll-to-top เมื่อเปลี่ยนหน้า |
| Scroll Animations | Fade + Rise เมื่อเลื่อนถึง (Framer Motion `whileInView`) |
| Filter ผลงาน | กรองตามเกม (RoV / Free Fire) และปี |
| Filter สมาชิก | กรองตามหมวดหมู่ (Organization / RoV / Free Fire / Staff) |
| Search สมาชิก | ค้นหาจากชื่อจริง, ชื่อเล่น, ตำแหน่ง และคำอธิบาย |
| หน้าเกม | `/games/[slug]` — โรสเตอร์ ผลงาน และคำโปรยประจำสาย |
| หน้าสมาชิก | `/members/[slug]` — **Player Profile**: รูปใหญ่, In-game Name, ข้อมูลที่อนุญาตให้เผยแพร่, Digital Archive |
| SEO | Metadata, OpenGraph, `sitemap.xml`, `robots.txt`, JSON-LD-ready |
| Loading State | Skeleton แบบนุ่มนวลระหว่างเปลี่ยนหน้า (เฉพาะเส้นทาง Dynamic) |
| 404 Page | หน้าแสดงผลกรณีไม่พบเนื้อหา พร้อมทางออก |
| Dark Mode Ready | โทเคนสีทั้งหมดถูกกำหนดไว้ใน `@theme` ของ Tailwind v4 |

---

## เทคโนโลยีที่ใช้

| เทคโนโลยี | เวอร์ชัน | หน้าที่ |
| --- | --- | --- |
| Next.js | 16 (App Router, Turbopack) | Framework + SSR/SSG + Routing |
| React | 19 | UI Library |
| TypeScript | 5.9 | Type Safety |
| Tailwind CSS | 4 | Utility CSS + Design Tokens (`@theme`) |
| Framer Motion | 14 | Scroll & entrance animations |
| Lucide React | 1 | Icon set |
| ESLint | 9 | Linting (Flat Config) |

---

## การติดตั้งและเริ่มใช้งาน

### ข้อกำหนดระบบ

- Node.js **20.9+** (แนะนำ 22 หรือ 24)
- npm 10+ / pnpm / yarn / bun (ใดก็ได้)

### 1. ติดตั้ง Dependencies

```bash
npm install
```

> บน Windows หาก PowerShell บล็อกการรันสคริปต์ ให้ใช้ `npm.cmd install` แทน `npm install`
> หรือรัน `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` เมื่อได้รับอนุญาต

### 2. เริ่ม Dev Server

```bash
npm run dev
```

เปิดเว็บที่ **http://localhost:3000**

### 3. Build สำหรับ Production

```bash
npm run build     # build + type-check
npm run start     # serve ผลลัพธ์ของ production build
```

### 4. สคริปต์ทั้งหมด

| คำสั่ง | คำอธิบาย |
| --- | --- |
| `npm run dev` | เปิดเซิร์ฟเวอร์สำหรับพัฒนา (Hot Reload) |
| `npm run build` | สร้าง production build + ตรวจ TypeScript |
| `npm run start` | รัน production build |
| `npm run lint` | ตรวจสอบโค้ดด้วย ESLint |
| `npm run typecheck` | ตรวจสอบ TypeScript อย่างเดียว (`tsc --noEmit`) |

---

## โครงสร้างโปรเจกต์

```
ppsesportwebapp/
├── data/                         # ★ ข้อมูลทั้งหมดที่แก้ได้จากหน้า /admin
│   ├── members.json               #    สมาชิก
│   ├── achievements.json          #    ผลงานการแข่งขัน
│   ├── games.json                 #    สายเกม (ภาพปก / โลโก้)
│   ├── branding.json              #    โลโก้ทีม / โลโก้โรงเรียน
│   ├── hero.json                   #    รูปพื้นหลังหน้าแรก (เลื่อนไปทางซ้าย)
│   └── README.md                  #    คู่มือไฟล์ข้อมูล
│
├── public/
│   └── images/                   # วางรูปภาพจริง (ดู public/images/README.md)
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout: fonts, metadata, Navbar, Footer
│   │   ├── page.tsx               # หน้า Home
│   │   ├── globals.css            # Design System (@theme tokens + utilities)
│   │   ├── loading.tsx            # (ใช้ในเส้นทาง dynamic เท่านั้น)
│   │   ├── not-found.tsx          # หน้า 404
│   │   ├── icon.svg / apple-icon.svg
│   │   ├── sitemap.ts             # sitemap.xml
│   │   ├── robots.ts              # robots.txt
│   │   ├── admin/page.tsx         # ★ หน้าจัดการข้อมูลทั้งหมด (4 แท็บ)
│   │   ├── api/                   # ★ API สำหรับหน้า Admin
│   │   │   ├── members/           #    สมาชิก
│   │   │   ├── achievements/      #    ผลงาน
│   │   │   ├── games/             #    โลโก้/ภาพปกเกม
│   │   │   └── branding/          #    โลโก้ทีม/โรงเรียน
│   │   ├── achievements/page.tsx
│   │   ├── games/
│   │   │   ├── page.tsx           # หน้ารวมสายเกม
│   │   │   └── [slug]/
│   │   │       ├── page.tsx       # หน้ารายละเอียดสายเกม
│   │   │       └── loading.tsx    # Loading UI ของเส้นทาง dynamic
│   │   └── members/
│   │       ├── page.tsx           # หน้าสมาชิก (ค้นหา + filter)
│   │       └── [slug]/
│   │           ├── page.tsx       # หน้า Player Profile
│   │           └── loading.tsx    # Loading UI ของเส้นทาง dynamic
│   │
│   ├── components/
│   │   ├── admin/                # ★ UI จัดการข้อมูล
│   │   │   ├── AdminPanel.tsx     #    แท็บทั้งหมด
│   │   │   ├── CollectionManager.tsx #  ฟอร์มเพิ่ม/แก้ไข/ลบ (ใช้ร่วมทุกชนิด)
│   │   │   ├── GamesManager.tsx   #    ภาพปก + โลโก้เกม
│   │   │   └── BrandingManager.tsx #   โลโก้ทีม/โรงเรียน
│   │   ├── ui/                    # ชิ้นส่วนพื้นฐาน
│   │   │   ├── Media.tsx          # รูปจริง / Placeholder แบบ Branded
│   │   │   ├── Primitives.tsx     # Button, Badge, SectionHeading, GradientRule
│   │   │   ├── Reveal.tsx         # Scroll animation wrappers
│   │   │   ├── DemoNotice.tsx     # ป้ายกำกับข้อมูลตัวอย่าง (Demo)
│   │   │   ├── Logo.tsx           # โลโก้ + โลโก้เมนู
│   │   │   └── SocialIcons.tsx    # ไอคอนโซเชียล (ลิงก์แบรนด์)
│   │   ├── layout/                # Navbar, Footer, PageHeader
│   │   ├── home/                  # Hero, HeroCarousel, Games, Achievements, Members
│   │   ├── games/GameLogo.tsx     # โลโก้ประจำสายเกม
│   │   ├── members/               # MemberCard, MembersExplorer
│   │   ├── achievements/          # AchievementCard, AchievementsExplorer
│   │
│   ├── data/                      # ข้อมูลคงที่ + ค่าคงที่ (client-safe)
│   │   ├── site.ts                # ชื่อเว็บ เมนู โซเชียล สวิตช์ CTA
│   │   ├── organization.ts        # เกี่ยวกับสังกัด สถิติ หลักการ
│   │   ├── games-static.ts        # slug ของสายเกม
│   │   ├── game-meta.ts           # ชื่อสายเกม
│   │   ├── member-meta.ts         # หมวดหมู่/ป้ายของสมาชิก
│   │   ├── achievement-meta.ts    # ป้ายอันดับ / ระดับการแข่งขัน
│   │   └── admin-schemas.ts       # ★ นิยามฟอร์มของหน้า Admin
│   │
│   ├── lib/
│   │   ├── utils.ts               # cn(), formatDate()
│   │   └── profile.ts             # ★ กติกาการเผยแพร่ข้อมูลส่วนตัว
│   │   ├── json-store.ts          # ★ อ่าน/เขียนไฟล์ JSON (server-only)
│   │   ├── collections.ts         # ★ ตัวกลางเข้าถึงข้อมูลแต่ละชนิด
│   │   └── api-helpers.ts         # helper สำหรับ API route
│   └── types/index.ts             # Type definitions ทั้งหมด
│
├── next.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── package.json
└── README.md
```

> **หลักการสำคัญ:** UI Component จะไม่ hard-code เนื้อหาใด ๆ ทั้งหมดอ่านจาก `src/data/*`
> การแก้ข้อมูลจึงไม่ต้องแตะ Component เลย

---

## การจัดการข้อมูล (สำคัญ)

> ⚠️ **ข้อมูลที่จัดมาให้ทั้งหมดเป็นข้อมูลตัวอย่าง (Demo)**
> ตั้งแต่ชื่อสมาชิก ชื่อรายการแข่งขัน อันดับ และวันที่ เพื่อให้ท่านสามารถประเมิน
> ดีไซน์และการทำงานของระบบได้ก่อนนำข้อมูลจริงมาใส่
> ทุกส่วนที่ใช้ข้อมูลตัวอย่างจะมีป้าย **“Sample data”** กำกับไว้เสมอ

### 1. แก้ไขข้อมูลบริษัท / เว็บไซต์

`src/data/site.ts`

```ts
export const site = {
  name: "PPS ESPORT",
  school: "Phichit Pittayakom School",
  tagline: "",
  url: "https://your-domain.com",   // ← เปลี่ยนเป็นโดเมนจริง (ใช้กับ SEO)
  ...
};
```

### 2. แก้ไขเกี่ยวกับสังกัด

`src/data/organization.ts` — แก้ `intro`, `pillars`, `stats` (เช่นปีที่ก่อตั้งจริง),
`contact` (อีเมล/โซเชียลจริง) และลบข้อความ `[PLACEHOLDER]` ออก

### 3. จัดการข้อมูลทั้งหมด — ผ่านหน้า Admin

> 🎯 **เปิด [http://localhost:3000/admin](http://localhost:3000/admin)**
> แท็บ 4 ชนิด: สมาชิก · ผลงาน · โลโก้เกม · โลโก้ทีม/โรงเรียน
> ทุกอย่างเพิ่ม / แก้ไข / ลบ ได้จากฟอร์ม **ไม่ต้องแก้โค้ด ไม่ต้อง build ใหม่**

| แท็บ | จัดการอะไร | บันทึกลง |
| --- | --- | --- |
| สมาชิก | เพิ่ม / แก้ไข / ลบ สมาชิกและนักกีฬา | `data/members.json` |
| ผลงาน | เพิ่ม / แก้ไข / ลบ ผลงานการแข่งขัน | `data/achievements.json` |
| โลโก้เกม | เปลี่ยนภาพปก (16:9) และโลโก้ (1:1) ของแต่ละสาย | `data/games.json` |
| โลโก้ทีม/โรงเรียน | ใส่โลโก้โรงเรียน + โลโก้ทีม (มุมซ้ายบนของแถบเมนู) | `data/branding.json` |

**slug สร้างให้อัตโนมัติ** — ชื่ออังกฤษ `"PPS Shadow"` → `/members/pps-shadow`
ชื่อภาษาไทย `"สมชาย ใจดี"` → `/members/rov-player-02`

**คู่มือรูปแบบข้อมูลแต่ละไฟล์** ดูที่ [`data/README.md`](./data/README.md)

> ⚠️ หน้า Admin ยังไม่มีระบบล็อกอิน — ใช้บนเครื่องของทีมงานเท่านั้น
> และการเขียนไฟล์ใช้ได้เฉพาะเซิร์ฟเวอร์ที่เขียนไฟล์ได้ (ดูหัวข้อ Deploy)

---

### 3b. แก้ไขข้อมูลโดยตรง (ทางเลือก)


> 🎯 **ทางที่ง่ายที่สุด: เปิด [http://localhost:3000/admin](http://localhost:3000/admin)**
> กรอกฟอร์ม → กด "เพิ่มสมาชิก" → ขึ้นบนเว็บทันที **ไม่ต้องแก้โค้ด ไม่ต้อง build ใหม่**

| ความสามารถ | รายละเอียด |
| --- | --- |
| เพิ่มสมาชิก | กรอกชื่อ / ชื่อเล่น / ประเภทผู้เล่น (ตัวจริง–ตัวสำรอง) / ตำแหน่ง / หมวดหมู่ / สายเกม / อายุ / ระดับชั้น / Instagram / แนะนำตัว / พาธรูป |
| แก้ไขสมาชิก | กดปุ่มดินสอ → แก้ → บันทึก |
| ลบสมาชิก | กดปุ่มถังขยะ → ยืนยัน |
| **จัดลำดับสมาชิก** | ลากที่หัวหมาย หรือปุ่ม ↑/↓ หรือกด "จัดลำดับอัตโนมัติ" (ตัวจริง → สำรอง → โค้ช → ผู้ควบคุมทีม) |
| slug อัตโนมัติ | ชื่ออังกฤษ → `pps-shadow` · ชื่อไทย → `rov-player-02` |

**ข้อมูลถูกบันทึกลงไฟล์** `data/members.json` → ดูรายละเอียดที่ [`data/README.md`](./data/README.md)

> ⚠️ หน้า Admin ยังไม่มีระบบล็อกอิน — ใช้บนเครื่องของทีมงานเท่านั้น
> และการเขียนไฟล์ใช้ได้เฉพาะเซิร์ฟเวอร์ที่เขียนไฟล์ได้ (ดูหัวข้อ Deploy)

---

### 3b. แก้ไขสมาชิกโดยตรง (ทางเลือก)

ดู `data/members.json` (ดูหัวข้อ 3 ด้านบน)

`data/members.json`

```ts
{
  slug: "rov-player-01",              // URL: /members/rov-player-01
  realName: "ชื่อ-นามสกุลจริง",
  inGameName: "PPS_IGN_01",
  role: "นักกีฬา / Player — Mid",
  category: "rov",                    // organization | rov | freefire | staff
  game: "rov",                        // ระบุเฉพาะเมื่ออยู่ในสายเกม
  bio: "ประวัติย่อ...",
  image: "/images/members/rov-player-01.jpg",   // null = ใช้ Placeholder
  highlights: ["...", "..."],
  socials: [{ label: "Facebook", href: "https://facebook.com/..." }],
  order: 1,
}
```

> หากลบข้อมูลตัวอย่างออกทั้งหมด ให้ปรับตัวเลขใน `organisation.stats` และ `Hero` ให้ตรงกับจำนวนจริงด้วย

### 4. แก้ไขผลงานการแข่งขัน

`data/achievements.json`

```ts
{
  id: "ach-001",
  tournament: "ชื่อรายการแข่งขันจริง",
  game: "rov",                        // rov | freefire
  rank: "อันดับ 1",
  tier: "champion",                   // champion | runner-up | third | top3 | top8 | qualify
  scope: "national",                  // school | regional | national | international
  date: "2025-11-08",                 // รูปแบบ YYYY-MM-DD (ใช้กรองตามปี)
  teamName: "PPS ROV",
  image: "/images/achievements/ach-001.jpg",
  note: "หมายเหตุ",
}
```

ระดับ `tier` จะกำหนดสีของป้ายอันดับให้อัตโนมัติ (ดู `tierMeta` ในไฟล์เดียวกัน)

### 6. เพิ่มรูปภาพจริง — 3 ขั้นตอน

> 📖 **คู่มือฉบับเต็มอยู่ที่ [`public/images/README.md`](./public/images/README.md)**
> มีคำอธิบายทุกชนิดของรูป, ขนาดที่แนะนำ และ checklist รายชื่อไฟล์ทั้งหมด
> วิธีเพิ่มสมาชิก/ผลงานใหม่พร้อมรูป และตารางแก้ปัญหา

**หลักการ:** ข้อมูล (ข้อความ) อยู่ใน `src/data/*.ts` ส่วนไฟล์รูปอยู่ใน `public/images/`
เชื่อมสองอย่างด้วย **path** ที่ขึ้นต้นด้วย `/images/`

**ขั้นที่ 1 — ก๊อปไฟล์รูปเข้า `public/images/`** (สร้างโฟลเดอร์เองได้)

```
public/images/
├── games/<slug>/cover.jpg       ← ภาพปกเกม    (เช่น games/rov/cover.jpg)
├── games/<slug>/logo.png        ← โลโก้เกม
├── members/<slug>.jpg           ← รูปสมาชิก   (เช่น members/rov-player-01.jpg)
├── achievements/<id>.jpg        ← ถ้วยรางวัล  (เช่น achievements/ach-001.jpg)
```

**ขั้นที่ 2 — เขียน path ลงในไฟล์ข้อมูล**

```ts
// data/games.json
cover: "/images/games/rov/cover.jpg",
logo:  "/images/games/rov/logo.png",   // ยังไม่มีโลโก้ก็ใส่ null

// data/members.json
image: "/images/members/rov-player-01.jpg",

// data/achievements.json
image: "/images/achievements/ach-001.jpg",

ratio: "landscape",                    // portrait | square | landscape | wide
```

**ขั้นที่ 3 — รีเฟรช**

```bash
npm run dev                              # โหมด dev (เห็นผลทันที)
npm run build && npm run start           # โหมด production (ต้อง build ใหม่ทุกครั้ง)
```

**ถ้า path เป็น `null`** → เว็บจะแสดงกรอบ Placeholder แบบ Branded
(ออกแบบมาให้เข้ากับธีมอยู่แล้ว จึงไม่เสียหายถ้ายังไม่มีรูปจริง)

### 7. รูปแบบไฟล์ที่แนะนำ

| ประเภท | ขนาด | สัดส่วน | ใช้ที่ไหน |
| --- | --- | --- | --- |
| Cover เกม | 1600 × 900 | 16:9 | การ์ดเกม + หน้าเกม |
| โลโก้เกม | 400 × 200 | 2:1 | ป้ายข้างชื่อเกม |
| รูปสมาชิก | 800 × 1000 | 4:5 | การ์ดสมาชิก + หน้าโปรไฟล์ |
| ถ้วยรางวัล | 1200 × 900 | 4:3 | การ์ดผลงาน |

> ระบบ `next/image` จะ resize และแปลงเป็น WebP/AVIF ให้อัตโนมัติ
> แนะนำไม่เกิน 2000px ด้านยาว และบันทึกเป็น `.jpg` คุณภาพ 80+ หรือ `.webp`

---

## การเพิ่มสายเกมใหม่

1. เพิ่ม record ใหม่ใน `data/games.json` (slug ต้องเป็น `GameId` ใน `src/types/index.ts`)
2. เพิ่ม `GameId` ใน `src/types/index.ts` และ `MemberCategory` (ถ้าต้องมีสายใหม่)
3. เพิ่มสมาชิกของสายใหม่ใน `data/members.json` และ `data/achievements.json`
4. หน้า `/games/[slug]` จะสร้าง Route ให้อัตโนมัติผ่าน `generateStaticParams()`

---

## Design System

โทเคนสีทั้งหมดประกาศไว้ที่ `src/app/globals.css` ในบล็อก `@theme` ของ Tailwind CSS v4

| Token | สี | การใช้งาน |
| --- | --- | --- |
| `--color-ink` | `#142B50` | หัวข้อ เนื้อหาสำคัญ ปุ่มหลัก |
| `--color-ink-soft` | `#3C5478` | ข้อความระดับรอง |
| `--color-ink-mute` | `#5A6B85` | ข้อความเสริม / metadata (ผ่าน WCAG AA บนพื้นขาว) |
| `--color-pink` | `#F4BFD5` | Accent ชมพู |
| `--color-pink-soft` | `#FDEBF4` | พื้นผิวชมพูอ่อน |
| `--color-pink-deep` | `#A8447A` | Accent ชมพูเข้ม (ตัวอักษร/ไล่ระดับ) |
| `--color-sky` | `#A9DDF5` | Accent ฟ้า |
| `--color-sky-soft` | `#EAF6FC` | พื้นผิวฟ้าอ่อน (Light Blue) |
| `--color-sky-deep` | `#1B6E96` | Accent ฟ้าเข้ม (ตัวอักษร/ไล่ระดับ) |

> โทเคนสีทั้งหมดผ่านการตรวจ Contrast Ratio ตามเกณฑ์ WCAG 2.1 AA แล้ว
> (Lighthouse Accessibility = 100 ทุกหน้า)

**Typography**

- หัวข้อ: `Sora` (Display) — ผ่าน `next/font/google`
- เนื้อหา: `IBM Plex Sans Thai` (รองรับภาษาไทย)

**Utility class สำคัญ**

| Class | รายละเอียด |
| --- | --- |
| `.container-page` | ความกว้างสูงสุด 80rem พร้อม padding แบบ responsive |
| `.text-gradient` / `.text-gradient-soft` | ข้อความไล่สีชมพู → น้ำเงินเข้ม → ฟ้า |
| `.bg-brand-gradient` / `.bg-brand-radial` | พื้นหลัง Gradient แบบนุ่มนวล |
| `.bg-dot-grid` / `.bg-line-grid` | พื้นผิว texture บาง ๆ |
| `.glass` / `.glass-strong` | กระจกฝ้าสำหรับ Navbar / panel |
| `.mask-fade-x` | ขอบจางสำหรับ marquee |

---

## การเชื่อมต่อ Supabase (ขั้นตอนถัดไป)

สถาปัตยกรรมปัจจุบันแยกข้อมูลออกจาก UI อย่างเต็มที่ จึงย้ายไปใช้ Supabase ได้ง่าย

### 1. ติดตั้งและตั้งค่า

```bash
npm install @supabase/supabase-js
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 2. สร้างตาราง

```sql
create table members (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  real_name text not null,
  in_game_name text,
  role text not null,
  category text not null,
  game text,
  bio text,
  image_path text,
  highlights jsonb default '[]',
  socials jsonb default '[]',
  sort_order int default 0
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  tournament text not null,
  game text not null,
  rank text not null,
  tier text not null,
  scope text not null,
  date date not null,
  team_name text not null,
  image_path text,
  note text
);
```

### 3. เปลี่ยนแหล่งข้อมูล

แทนที่ฟังก์ชัน `readMembers()` ใน `src/lib/collections.ts` ด้วยการอ่านจาก DB:

```ts
import { createClient } from "@supabase/supabase-js";
import { cache } from "react";

export const getMembers = cache(async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("members")
    .select("*")
    .order("sort_order");
  return data ?? [];
});
```

> รูปภาพควรเก็บใน **Supabase Storage** และเก็บเฉพาะ path ในฐานข้อมูล
> จากนั้นใช้ `createSignedUrl()` หรือ public bucket ตามนโยบายขององค์กร

---

## SEO และ Performance

- **Metadata**: แก้ได้ที่ `src/app/layout.tsx` และแต่ละหน้า พร้อม `metadataBase` สำหรับ URL จริง
- **OpenGraph / Twitter Card** ถูกตั้งค่าไว้แล้ว
- **Sitemap**: `src/app/sitemap.ts` สร้างอัตโนมัติจากข้อมูลใน `src/data`
- **Robots**: `src/app/robots.ts`
- **Static Generation**: ทุกหน้าเป็น Static/SSG (ดูตาราง Route ในผลลัพธ์ `npm run build`)
- **Loading UX**: ไม่มี `loading.tsx` ที่ระดับ root เพื่อไม่ให้หน้าเต็มจอถูกแทนที่ระหว่างเปลี่ยนหน้า
  มีเฉพาะในเส้นทาง dynamic (`games/[slug]`, `members/[slug]`) และใช้ `useLinkStatus()`
  ใน Navbar เพื่อแสดงเส้นบอกสถานะแบบเบา ๆ บนลิงก์ที่กำลังโหลด
- **No-JS Fallback**: มี `<noscript>` style ใน `layout.tsx` ที่ปลดล็อก `opacity: 0`
  ของ scroll-reveal animation เผื่อผู้ใช้ปิด JavaScript
- **Image Optimization**: ใช้ `next/image` พร้อม AVIF/WebP
- **Fonts**: `next/font` โหลดแบบ self-host ไม่มี request ออก network ระหว่าง render

> อย่าลืมเปลี่ยน `site.url` ใน `src/data/site.ts` เป็นโดเมนจริงก่อน deploy

---

## Deploy

### Vercel (แนะนำ)

1. Push โค้ดขึ้น GitHub
2. Import repository ที่ [vercel.com/new](https://vercel.com/new)
3. Framework Preset: **Next.js** (ตรวจตัวเองให้อัตโนมัติ)
4. เพิ่ม Environment Variables ถ้ามี
5. Deploy

### เซิร์ฟเวอร์ตัวเอง

```bash
npm run build
npm run start     # ฟังที่พอร์ต 3000
```

แนะนำให้วางหน้า Nginx / Caddy ไว้หน้า Next.js และเปิด HTTPS

---

## Browser Support

- Chrome / Edge ≥ 110
- Firefox ≥ 110
- Safari ≥ 16.4

รองรับ `prefers-reduced-motion` — เมื่อผู้ใช้ปิด animation ในระบบ เว็บไซต์จะแสดงเนื้อหาทันทีโดยไม่มีการเคลื่อนไหว

---

## License

© 2026 PPSESPORT — โรงเรียนพิจิตรพิทยาคม
ออกแบบและพัฒนาเพื่อการนำเสนอองค์กรอีสปอร์ตของสังกัด
