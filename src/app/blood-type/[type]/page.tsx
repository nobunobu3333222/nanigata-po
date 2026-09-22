import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOOD_TYPE_ARTICLES } from "../../../lib/bloodTypeArticles";
import { pageMetadata } from "../../../lib/seo";
import { Breadcrumbs, QuizCta, ScienceNote } from "../../../components/ArticleChrome";
type Props = { params: Promise<{ type: string }> };
function articleFor(type: string) { return Object.hasOwn(BLOOD_TYPE_ARTICLES, type) ? BLOOD_TYPE_ARTICLES[type] : undefined; }
export async function generateMetadata({ params }: Props) {
  const { type } = await params;
  const article = articleFor(type);
  if (!article) return {};
  return pageMetadata(`/blood-type/${type}`, `${article.type}型っぽい人の性格・特徴とは？${article.keywords}｜何型っぽ？`, `${article.type}型っぽく見られやすい行動や長所、誤解されやすいところを紹介。${article.keywords}という一般的なイメージを、日常の場面から振り返ります。`);
}
export default async function BloodTypePage({ params }: Props) {
  const { type } = await params;
  const article = articleFor(type);
  if (!article) notFound();
  return <main className={`article-shell article-${type}`}><Breadcrumbs type={article.type} /><article>
    <header className="article-header"><span className="article-type" aria-hidden="true">{article.type}</span><p className="eyebrow">A DIFFERENT SIDE OF YOU</p><h1>{article.type}型っぽい人の<br />性格・特徴とは？</h1><p>{article.intro}</p></header>
    <QuizCta title={`あなたは本当に${article.type}型っぽい？`} label="無料で診断する" />
    <section><h2>{article.type}型っぽい人に見られやすい特徴</h2>{article.features.map((feature) => <div key={feature.title}><h3>{feature.title}</h3><p>{feature.body}</p></div>)}</section>
    <section><h2>{article.type}型っぽい人の長所</h2><p>{article.strengths}</p></section>
    <section><h2>{article.type}型っぽい人が誤解されやすいところ</h2><p>{article.misunderstanding}</p></section>
    <QuizCta title="「自分は少し違うかも」と思ったら？" label="何型っぽいかチェックする" />
    <section><h2>日常ではこんな行動に出やすい</h2><ul>{article.daily.map((line) => <li key={line}>{line}</li>)}</ul><p>当てはまるものがあっても、実際の血液型を意味するわけではありません。同じ人でも、相手や場面によって行動は変わります。</p></section>
    <section><h2>他のタイプの印象との違い</h2><p>{article.difference}</p></section>
    <section><h2>あなたは{article.type}型っぽい？</h2><p>一つの特徴だけでは分からない、あなたの見られ方。16問の回答から7つの傾向を組み合わせて、どのイメージに近いか見てみませんか。</p><QuizCta /></section>
    <ScienceNote />
    <nav className="related-types" aria-label="他の血液型を見る"><h2>他の血液型を見る</h2>{Object.entries(BLOOD_TYPE_ARTICLES).filter(([key]) => key !== type).map(([key, value]) => <Link key={key} href={`/blood-type/${key}`}>{value.type}型っぽい人の特徴 <span aria-hidden="true">↗</span></Link>)}<Link href="/blood-type">血液型別のイメージを比較する</Link></nav>
  </article></main>;
}
