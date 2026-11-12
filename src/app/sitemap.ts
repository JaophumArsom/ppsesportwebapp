import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { games } from "@/data/games-static";
import { getMembers } from "@/lib/collections";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const members = await getMembers();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/games`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/achievements`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/members`, lastModified, changeFrequency: "weekly", priority: 0.9 },
  ];

  const gameRoutes: MetadataRoute.Sitemap = games.map((game) => ({
    url: `${site.url}/games/${game.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const memberRoutes: MetadataRoute.Sitemap = members.map((member) => ({
    url: `${site.url}/members/${member.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...gameRoutes, ...memberRoutes];
}
