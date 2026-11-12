import { NextResponse } from "next/server";
import { getBranding, getHero, saveBranding, saveHero } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [branding, hero] = await Promise.all([getBranding(), getHero()]);
  return NextResponse.json({ branding, hero });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    // รองรับการแก้ไขภาพพื้นหลังหน้าแรกในคำขอเดียวกัน
    if (body && "heroImages" in body) {
      const images = Array.isArray(body.heroImages)
        ? body.heroImages
            .map((item: unknown) => String(item ?? "").trim())
            .filter(Boolean)
        : [];
      await saveHero({ images });
      delete body.heroImages;
    }

    const branding = await saveBranding(body ?? {});
    const hero = await getHero();
    return NextResponse.json({ branding, hero });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "บันทึกไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
