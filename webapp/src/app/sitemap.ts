import type { MetadataRoute } from "next";
import { loadOrganizations } from "@/server/loaders/load-organizations";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.WEBAPP_URL || "https://marumie.team-mir.ai";

  const { organizations } = await loadOrganizations();

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];

  // 各組織のページを追加
  organizations.forEach((org) => {
    // 組織のメインページ
    sitemap.push({
      url: `${baseUrl}/o/${org.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });

    // 組織のtransactionsページ
    sitemap.push({
      url: `${baseUrl}/o/${org.slug}/transactions`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  return sitemap;
}
