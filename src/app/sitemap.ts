import type { MetadataRoute } from "next";
import { INDEX_PATHS, siteUrl } from "../lib/seo";
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEX_PATHS.map((path) => ({ url: new URL(path, siteUrl()).href }));
}
