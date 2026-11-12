import { makeItemHandlers } from "@/lib/api-helpers";
import { deleteAchievement, updateAchievement } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = makeItemHandlers({
  param: "id",
  update: updateAchievement,
  remove: deleteAchievement,
});

export const PATCH = handlers.PATCH;
export const DELETE = handlers.DELETE;
