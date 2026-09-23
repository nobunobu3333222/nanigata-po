import type { Metadata } from "next";
import { QuizSession } from "../components/QuizSession";
import { Header, Footer } from "../components/SiteChrome";
import "./globals.css";
import { siteUrl } from "../lib/seo";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { metadataBase: siteUrl(), verification: { google: "8bBPBi9x8JniuJ41IYEd7sAwY3gCxfgEwZA9XsHNpJc" }, title: "何型っぽ？｜血液型印象診断", description: "16問の日常行動から、あなたの見られ方をチェック。", robots: { index: false, follow: true } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body><QuizSession><Header />{children}<Footer /></QuizSession></body></html>;
}
