import { makeCollectionHandlers } from "@/lib/api-helpers";
import { createAchievement, getAchievements } from "@/lib/collections";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = makeCollectionHandlers({
  list: getAchievements,
  create: createAchievement,
});

export const GET = handlers.GET;
export const POST = handlers.POST;
