import type { MetadataRoute } from "next";

import { APP_CONFIG } from "@/config/app-config";

const ROUTES = [
  "/",
  "/dashboard/generator",
  "/dashboard/markimg",
  "/dashboard/calendar",
  "/dashboard/timestamp",
  "/dashboard/wallhaven",
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
