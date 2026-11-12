import { NextResponse } from "next/server";

/**
 * Generic API handlers for the admin collection routes.
 * Each collection route file re-exports these with its own file/param names.
 */

export function makeCollectionHandlers<T extends object>(options: {
  list: () => Promise<T[]>;
  create: (body: Partial<T>) => Promise<T>;
}) {
  return {
    async GET() {
      const items = await options.list();
      return NextResponse.json({ items });
    },

    async POST(request: Request) {
      try {
        const body = await request.json();
        const item = await options.create(body ?? {});
        return NextResponse.json({ item }, { status: 201 });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "เพิ่มข้อมูลไม่สำเร็จ" },
          { status: 500 },
        );
      }
    },
  };
}

export function makeItemHandlers<T extends object>(options: {
  param: string;
  update: (id: string, body: Partial<T>) => Promise<T | undefined>;
  remove: (id: string) => Promise<boolean>;
}) {
  return {
    async PATCH(
      request: Request,
      { params }: { params: Promise<Record<string, string>> },
    ) {
      try {
        const resolved = await params;
        const id = resolved[options.param];
        const body = await request.json();
        const item = await options.update(id, body ?? {});
        if (!item) {
          return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
        }
        return NextResponse.json({ item });
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "แก้ไขข้อมูลไม่สำเร็จ",
          },
          { status: 500 },
        );
      }
    },

    async DELETE(
      _request: Request,
      { params }: { params: Promise<Record<string, string>> },
    ) {
      try {
        const resolved = await params;
        const id = resolved[options.param];
        const removed = await options.remove(id);
        if (!removed) {
          return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
        }
        return NextResponse.json({ ok: true });
      } catch (error) {
        return NextResponse.json(
          {
            error: error instanceof Error ? error.message : "ลบข้อมูลไม่สำเร็จ",
          },
          { status: 500 },
        );
      }
    },
  };
}
