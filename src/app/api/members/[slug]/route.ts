import { makeItemHandlers } from "@/lib/api-helpers";
import { deleteMember, updateMember } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = makeItemHandlers({
  param: "slug",
  update: updateMember,
  remove: deleteMember,
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
