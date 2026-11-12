import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/Primitives";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-brand-radial py-24 lg:py-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]"
        aria-hidden="true"
      />

      <div className="container-page flex flex-col items-center text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-ink shadow-soft">
          <Search className="h-6 w-6" />
        </span>

        <p className="mt-8 font-display text-[clamp(3.5rem,14vw,7rem)] font-extrabold leading-none tracking-[-0.04em] text-gradient-soft">
          404
        </p>

        <h1 className="mt-4 text-2xl font-extrabold text-ink sm:text-3xl">
          ไม่พบหน้าที่คุณกำลังค้นหา
        </h1>

        <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-mute">
          หน้านี้อาจถูกย้าย เปลี่ยนชื่อ หรือยังไม่ได้ถูกสร้างขึ้น — ลองกลับไปหน้าแรก
          หรือเลือกดูหน้าต่าง ๆ ของสังกัดได้ด้านล่าง
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/" size="lg" icon={<Home className="h-4 w-4" />} iconPosition="left">
            กลับหน้าแรก
          </Button>
          <Button href="/members" size="lg" variant="outline" icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
            พบกับทีมงาน
          </Button>
        </div>
      </div>
    </section>
  );
}
