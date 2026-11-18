"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 *  HeroCarousel — ภาพพื้นหลังหน้าแรกที่เคลื่อนไหวไปทางซ้ายอย่างต่อเนื่อง
 * ----------------------------------------------------------------------------
 *  • รูปทั้งหมดถูกวางเรียงแนวนอน แล้วเลื่อนไปทางซ้ายแบบไม่มีจุดหยุด
 *  • ตัดรูปให้พอดีกรอบด้วย object-cover
 *  • มีชั้นไล่สีทับเพื่อให้ข้อความด้านหน้าอ่านออกชัด
 * ============================================================================
 */

export function HeroCarousel({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  if (!images.length) return null;

  // ทำรูปซ้ำ 2 ชุด เพื่อให้เลื่อนวนได้โดยไม่เห็นรอยต่อ
  const loop = [...images, ...images];

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
      aria-hidden="true"
    >
      <motion.div
        className="flex h-full w-max items-stretch gap-3 will-change-transform"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: Math.max(20, images.length * 7),
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {loop.map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-full w-[78vw] shrink-0 overflow-hidden sm:w-[52vw] lg:w-[38vw]"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, 38vw"
              className="object-cover"
              priority={index < 2}
            />
          </div>
        ))}
      </motion.div>

      {/* ชั้นไล่สีทับ เพื่อให้ตัวอักษรอ่านออกชัด โดยยังเห็นภาพได้ */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 via-45% to-white/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-transparent to-white/45" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white to-transparent" />
    </div>
  );
}
