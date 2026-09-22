import type { Metadata } from "next";
export const SITE_NAME = "何型っぽ？";
export function siteUrl(): URL {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("invalid_site_url");
    return url;
  } catch { return new URL("http://localhost:3000"); }
}
export function isPublicSite() {
  const url = siteUrl();
  return url.protocol === "https:" && !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) && process.env.VERCEL_ENV !== "preview";
}
export function pageMetadata(path: string, title: string, description: string, noindex = false): Metadata {
  const canonical = new URL(path, siteUrl()).href;
  const type = path.startsWith("/blood-type/") ? path.split("/").at(-1) : undefined;
  const image = `/og${type ? `?type=${type}` : ""}`;
  return {
    title, description, alternates: { canonical }, robots: { index: !noindex && isPublicSite(), follow: true },
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: "website", locale: "ja_JP", images: [{ url: image, width: 1200, height: 630, alt: `${title} 血液型印象診断` }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}
export const INDEX_PATHS = ["/", "/blood-type", "/blood-type/a", "/blood-type/b", "/blood-type/o", "/blood-type/ab", "/about", "/privacy"];
