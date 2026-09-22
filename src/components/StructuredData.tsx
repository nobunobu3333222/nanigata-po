import { headers } from "next/headers";
export async function StructuredData({ value }: { value: Record<string, unknown> }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  // 管理された固定データだけを使い、タグ終端も無害化。ユーザー回答は埋め込まない。
  return <script type="application/ld+json" nonce={nonce}>{JSON.stringify(value).replace(/</g, "\\u003c")}</script>;
}
