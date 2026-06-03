import type { MetadataRoute } from "next";

import { APP_CONFIG } from "@/config/app-config";

const ROUTES = [
  "/",
  "/dashboard/default",
  "/dashboard/crm",
  "/dashboard/finance",
  "/auth/v1/login",
  "/auth/v1/register",
  "/auth/v2/login",
  "/auth/v2/register",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${APP_CONFIG.url}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
