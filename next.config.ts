import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * การอ่านข้อมูลจากโฟลเดอร์ `data/` ทำด้วย fs.readFile ซึ่ง Next.js
   * มักตามหาไฟล์ไม่เจอ (เพราะชื่อไฟล์เป็น dynamic) → ต้องบอกให้ชัดเจน
   * ว่าให้รวมโฟลเดอร์นี้เข้าไปใน deployment (สำคัญมากบน Vercel)
   */
  outputFileTracingIncludes: {
    "/**": ["./data/**/*.json"],
  },
};

export default nextConfig;
