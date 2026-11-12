import { NextResponse } from "next/server";
import { makeCollectionHandlers } from "@/lib/api-helpers";
import { createMember, getMembers, reorderMembers } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = makeCollectionHandlers({
  list: getMembers,
  create: createMember,
});

export const GET = handlers.GET;
export const POST = handlers.POST;

/** จัดลำดับสมาชิกใหม่ — body: { order: ["slug-a", "slug-b", ...] } */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body?.order)) {
      await reorderMembers(body.order.map((slug: unknown) => String(slug)));
      const members = await getMembers();
      return NextResponse.json({ items: members });
    }

    return NextResponse.json({ error: "ไม่พบข้อมูลที่ต้องการอัปเดต" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "จัดลำดับไม่สำเร็จ" },
      { status: 500 },
    );
  }
}
