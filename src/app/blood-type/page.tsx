import Link from "next/link";
import { BLOOD_TYPE_ARTICLES } from "../../lib/bloodTypeArticles";
import { pageMetadata } from "../../lib/seo";
import { Breadcrumbs, QuizCta, ScienceNote } from "../../components/ArticleChrome";
export const metadata = pageMetadata("/blood-type", "血液型別の性格・特徴まとめ｜A型・B型・O型・AB型｜何型っぽ？", "A型・B型・O型・AB型に一般的に語られる性格イメージを比較。行動から受ける印象を知り、自分は何型っぽいか16問でチェックできます。");
export default function BloodTypeHub() {
  return <main className="article-shell"><Breadcrumbs /><article><header className="article-header"><p className="eyebrow">FOUR IMPRESSIONS</p><h1>A型・B型・O型・AB型<br />血液型別の性格・特徴</h1><p>「A型っぽいね」「意外とO型っぽいかも」。そんな会話で語られるイメージを、日常行動の視点で比べてみましょう。実際の血液型で性格を決めつけるための分類ではありません。</p></header><QuizCta title="自分は何型っぽい？" />
    <section><h2>血液型ごとのイメージを比較</h2><table className="type-table"><caption>一般的に語られる印象の例</caption><thead><tr><th scope="col">タイプ</th><th scope="col">イメージ</th></tr></thead><tbody>{Object.entries(BLOOD_TYPE_ARTICLES).map(([key, article]) => <tr key={key}><th scope="row"><Link href={`/blood-type/${key}`}>{article.type}型</Link></th><td>{article.keywords}</td></tr>)}</tbody></table><p>複数のタイプに当てはまっても自然なことです。計画性が高くても自由な時間が好き、社交的でも一人の時間が必要など、傾向は組み合わせで表れます。</p></section>
    {Object.entries(BLOOD_TYPE_ARTICLES).map(([key, article], index) => <div key={key}><section className={`hub-card article-${key}`}><h2>{article.type}型っぽい人</h2><p>{article.intro}</p><Link href={`/blood-type/${key}`}>{article.type}型っぽい人の特徴を読む ↗</Link></section>{index === 1 && <QuizCta title="あなたの中の「っぽさ」を見てみよう。" />}</div>)}
    <ScienceNote /><QuizCta title="読むだけでは分からない、あなたの見られ方。" /></article></main>;
}
