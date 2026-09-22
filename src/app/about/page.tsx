import Link from "next/link";
import { pageMetadata } from "../../lib/seo";
import { AXIS_LABELS } from "../../lib/quiz/presentation";
import { QuizCta, ScienceNote } from "../../components/ArticleChrome";
export const metadata = pageMetadata("/about", "「何型っぽ？」について｜血液型印象診断", "「自分ってこう見られるんだ」という発見を楽しむ、何型っぽ？のコンセプトと診断の仕組み。7つの傾向、結果の考え方、匿名データの利用について説明します。");
export default function About() { return <main className="article-shell"><article><header className="article-header"><p className="eyebrow">ABOUT US</p><h1>「何型っぽ？」について</h1><p>「自分って、こう見られるんだ」。いつもの行動から、ちょっと意外な一面に出会うための血液型印象診断です。</p></header>
  <section><h2>当てるだけではない、発見を楽しむ診断</h2><p>血液型の話をするとき、本当の型と周囲からの印象が違っていて盛り上がることがあります。「何型っぽ？」は、そのギャップを自分の行動を振り返るきっかけにしたいと考えました。</p><p>登録せず、16問に直感で答えるだけ。結果のラベルだけでなく、長所や気をつけたいところ、選んだ回答とのつながりを見られるようにしています。</p></section>
  <section><h2>7つの性格傾向を組み合わせます</h2><ul>{Object.values(AXIS_LABELS).map((label) => <li key={label}>{label}</li>)}</ul><p>質問ごとの配点を合計し、それぞれの軸を0〜100に正規化します。そのプロフィールと、一般的な血液型イメージを表す4つの基準プロフィールとの距離から「っぽさ指数」を計算します。</p><p>指数は当たる確率ではありません。4タイプの合計が100%になる必要もありません。最も近いタイプ、2番目に近いタイプ、12種類から選ばれるサブタイプを、あらかじめ定めた計算と文章で表示します。診断文をAIがその場で自由生成することはありません。</p></section>
  <section><h2>本当の血液型は、診断には使いません</h2><p>本当の血液型を聞くのは、結果が出た後だけです。入力は任意で、「わからない」も選べます。選択を変更しても、7軸・っぽさ指数・タイプ・サブタイプは変わりません。</p><p>結果につながった回答は、そのタイプの印象を強めた回答を優先して表示します。一つの回答だけで人柄が決まるという意味ではありません。</p></section>
  <ScienceNote /><section><h2>匿名データの活用</h2><p>答え合わせで血液型を選択した場合、16問の回答、診断結果、選択した血液型、診断バージョン、保存日時を匿名で保存します。利用状況の把握や回答傾向の分析、診断ロジックの改善に活用します。</p><p>氏名やメールアドレスなどを入力する機能はありません。他の人の回答を閲覧できるページも設けません。詳しくは<Link href="/privacy">プライバシーポリシー</Link>をご確認ください。</p></section><QuizCta /></article></main>; }
