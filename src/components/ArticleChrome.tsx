import Link from "next/link";
import { StructuredData } from "./StructuredData";
import { siteUrl } from "../lib/seo";
export function QuizCta({ title = "あなたは何型っぽく見える？", label = "16問で診断する" }: { title?: string; label?: string }) {
  return <aside className="article-cta"><p>{title}</p><Link href="/quiz" className="button primary">{label} <span aria-hidden="true">↗</span></Link><p className="fine">無料・登録不要・約2分</p></aside>;
}
export function Breadcrumbs({ type }: { type?: string }) {
  const items = [{ name: "何型っぽ？", path: "/" }, { name: "血液型の性格・特徴", path: "/blood-type" }, ...(type ? [{ name: `${type}型っぽい人の特徴`, path: `/blood-type/${type.toLowerCase()}` }] : [])];
  return <><nav className="breadcrumbs" aria-label="パンくず"><ol>{items.map((item, index) => <li key={item.path}>{index === items.length - 1 ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}</li>)}</ol></nav><StructuredData value={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: new URL(item.path, siteUrl()).href })) }} /></>;
}
export function ScienceNote() {
  return <section className="science-note"><h2>血液型と性格について</h2><p>血液型と性格の科学的な関連性が確立されているわけではありません。本サービスは、一般的に語られる血液型イメージをもとにしたエンタメコンテンツです。</p><p>実際の血液型を当てる確率や、医学的・心理学的な評価を示すものではありません。自分や誰かを決めつけるためではなく、日常の行動を振り返るきっかけとしてお楽しみください。</p><Link href="/about">診断の考え方を詳しく見る</Link></section>;
}
