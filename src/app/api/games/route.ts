import { NextResponse } from "next/server";
import { getGames, updateGame } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const games = await getGames();
  return NextResponse.json({ items: games });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const slug = body?.slug;
    if (!slug) {
      return NextResponse.json({ error: "ไม่พบเกม" }, { status: 400 });
    }

    const patch = { ...body };
    delete patch.slug;
    const game = await updateGame(slug, patch);
    if (!game) {
      return NextResponse.json({ error: "ไม่พบเกม" }, { status: 404 });
    }

    return NextResponse.json({ item: game });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "แก้ไขไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
