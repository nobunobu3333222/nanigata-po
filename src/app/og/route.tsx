import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { NextRequest } from "next/server";
import { TYPE_THEMES } from "../../lib/quiz/presentation";
import { BLOOD_TYPES, type BloodType } from "../../types/quiz";
export const runtime = "nodejs";
const font = readFile(join(process.cwd(), "src/assets/NotoSansJP-OG.ttf"));
export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("type")?.toUpperCase();
  const type = BLOOD_TYPES.includes(input as BloodType) ? input as BloodType : null;
  const color = type ? TYPE_THEMES[type].color : "#D6ED89";
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#FAF9F5", color: "#272A27", padding: 60, flexDirection: "column", fontFamily: "Noto", fontWeight: 700 }}>
    <div style={{ display: "flex", fontSize: 32 }}>何型っぽ？　血液型印象診断</div>
    <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}><div style={{ fontSize: 28 }}>{type ? `${type}型っぽい人の特徴` : "16問でわかる"}</div><div style={{ fontSize: 70 }}>{type ? `${type}型っぽ？` : "あなたは何型っぽ？"}</div><div style={{ fontSize: 25 }}>日常行動から、見られ方をチェック</div></div>
      <div style={{ display: "flex", width: 180, height: 210, background: color, borderRadius: 48, alignItems: "center", justifyContent: "center", fontSize: type === "AB" ? 85 : 130, transform: "rotate(8deg)" }}>{type ?? "？"}</div>
    </div><div style={{ display: "flex", fontSize: 25 }}>無料　登録不要</div>
  </div>, { width: 1200, height: 630, fonts: [{ name: "Noto", data: await font, weight: 700, style: "normal" }], headers: { "Cache-Control": "public, max-age=86400" } });
}
