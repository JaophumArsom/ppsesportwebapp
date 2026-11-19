"use client";

import { useState } from "react";
import { Gamepad2, Medal, Trophy, Users } from "lucide-react";
import { CollectionManager } from "@/components/admin/CollectionManager";
import { GamesManager } from "@/components/admin/GamesManager";
import { BrandingManager } from "@/components/admin/BrandingManager";
import { achievementFields, memberFields } from "@/data/admin-schemas";
import { rosterTypeLabel, rosterTypeOptions } from "@/data/member-meta";
import { cn } from "@/lib/utils";

/**
 * AdminPanel — แผงควบคุมข้อมูลทั้งหมดของเว็บไซต์
 */
const tabs = [
  { id: "members", label: "สมาชิก", icon: Users },
  { id: "achievements", label: "ผลงาน", icon: Trophy },
  { id: "games", label: "โลโก้เกม", icon: Gamepad2 },
  { id: "branding", label: "โลโก้ทีม/โรงเรียน", icon: Medal },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function AdminPanel() {
  const [tab, setTab] = useState<TabId>("members");

  return (
    <div className="flex flex-col gap-8">
      {/* -------------------------------- Tabs ------------------------------- */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {tabs.map((item) => {
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-pressed={active}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold transition-all duration-300",
                active
                  ? "bg-ink text-white shadow-[0_10px_24px_-14px_rgba(20,43,80,0.8)]"
                  : "border border-ink/10 bg-white text-ink-soft hover:border-ink/25 hover:text-ink",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* ------------------------------ Content ------------------------------ */}
      {tab === "members" ? (
        <CollectionManager
          endpoint="/api/members"
          idParam="slug"
          fields={memberFields}
          subtitle="บันทึกลง data/members.json"
          reorderable
          sortGroups={rosterTypeOptions.map((option) => ({
            id: option.id,
            label: option.label,
          }))}
          groupKeyField="rosterType"
          primary={(item) => String(item.realName ?? "")}
          secondary={(item) =>
            [item.inGameName, item.role].filter(Boolean).join(" · ")
          }
          badges={(item) => {
            const list = [];
            if (item.rosterType) {
              list.push({
                label: rosterTypeLabel[
                  item.rosterType as keyof typeof rosterTypeLabel
                ],
                className:
                  item.rosterType === "starter"
                    ? "bg-pink-soft text-[#A8447A]"
                    : item.rosterType === "substitute"
                      ? "bg-sky-soft text-[#1B6E96]"
                      : item.rosterType === "coach"
                        ? "bg-[#FFF3D6] text-[#8A6200]"
                        : "bg-ink/[0.06] text-ink-soft",
              });
            }
            if (item.game) {
              list.push({
                label: String(item.game).toUpperCase(),
                className:
                  item.game === "rov"
                    ? "bg-pink-soft text-[#A8447A]"
                    : "bg-sky-soft text-[#1B6E96]",
              });
            }
            return list;
          }}
        />
      ) : null}

      {tab === "achievements" ? (
        <CollectionManager
          endpoint="/api/achievements"
          fields={achievementFields}
          subtitle="บันทึกลง data/achievements.json"
          primary={(item) => String(item.tournament ?? "")}
          secondary={(item) =>
            [item.rank, item.teamName, item.date]
              .filter(Boolean)
              .join(" · ")
          }
        />
      ) : null}

      {tab === "games" ? <GamesManager /> : null}

      {tab === "branding" ? <BrandingManager /> : null}
    </div>
  );
}
