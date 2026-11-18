import Image from "next/image";
import { teamLogoPath } from "@/data/site";
import { getBranding } from "@/lib/collections";

/**
 * ============================================================================
 *  DetailLoading
 * ----------------------------------------------------------------------------
 *  หน้ารอกลางสำหรับ route ที่ต้องโหลดข้อมูลรายการ (สายเกม / สมาชิก)
 *  ใช้โลโก้ทีมจริงแทนตราว่าง หรือตัวอักษร เพื่อให้แบรนด์ยังอยู่ตอนรอ
 * ============================================================================
 */
export async function DetailLoading() {
  const branding = await getBranding();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 bg-brand-radial px-6"
    >
      <div className="relative">
        <div
          className="absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-br from-pink/50 via-transparent to-sky/50 blur-2xl animate-pulse"
          aria-hidden="true"
        />
        <span className="animate-pulse">
          <Image
            src={branding.teamLogo ?? teamLogoPath}
            alt={`โลโก้${branding.teamName}`}
            width={72}
            height={72}
            priority
            className="h-[72px] w-[72px] object-contain"
          />
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <div className="h-1 w-32 overflow-hidden rounded-full bg-ink/10">
          <div className="h-full w-1/2 animate-[shimmer_1.6s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-pink-deep to-sky-deep" />
        </div>
        <p className="text-xs font-medium tracking-[0.12em] text-ink-mute">
          กำลังโหลด...
        </p>
      </div>
    </div>
  );
}
