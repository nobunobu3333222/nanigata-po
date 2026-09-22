import { pageMetadata, siteUrl } from "../lib/seo";
import { StructuredData } from "../components/StructuredData";
import Link from "next/link";
export const metadata = pageMetadata("/", "血液型診断｜16問でわかる「あなたは何型っぽい？」｜何型っぽ？", "16問の日常行動から、あなたがA型・B型・O型・AB型のどれに見られやすいか診断。計画性、慎重さ、社交性など7つの傾向から「何型っぽい？」を無料でチェックできます。");
const types = [{ type: "A", label: "丁寧で、気配り上手？" }, { type: "B", label: "好奇心に、まっすぐ？" }, { type: "O", label: "おおらかで、芯がある？" }, { type: "AB", label: "冷静で、感性豊か？" }];
export default function Home() {
  return <main className="home-shell"><StructuredData value={{ "@context": "https://schema.org", "@type": "WebSite", name: "何型っぽ？", alternateName: "血液型印象診断 何型っぽ？", url: siteUrl().href }} />
    <section className="home-hero" aria-labelledby="home-title"><p className="eyebrow">A LITTLE DISCOVERY ABOUT YOU</p><p className="hero-kicker"><span className="tiny-dot" />16問でわかる、血液型印象診断</p>
      <h1 id="home-title">16問でわかる<br />あなたは<span className="title-highlight">何型っぽい？<svg viewBox="0 0 350 14" aria-hidden="true"><path d="M4 10 Q170 -1 346 7" /></svg></span></h1>
      <p className="home-lead">あなたは周りから<br />何型っぽく見られそう？</p>
      <div className="type-playground" aria-hidden="true"><span className="type-sticker sticker-a">A<span>きっちり？</span></span><span className="type-sticker sticker-b">B<span>自由人？</span></span><span className="type-sticker sticker-o">O<span>おおらか？</span></span><span className="type-sticker sticker-ab">AB<span>マイワールド？</span></span><span className="playground-question">?</span><span className="playground-star">✳</span></div>
      <Link className="button primary" href="/quiz">無料で診断する <span aria-hidden="true">↗</span></Link><div className="cta-notes"><span>約2分</span><span>登録不要</span><span>全16問</span></div><p className="fine">※エンタメとしてお楽しみください。</p>
    </section>
    <section className="home-section about-section"><p className="eyebrow">A NEW WAY TO SEE YOURSELF</p><h2>「自分って、<br />こう見られるんだ。」</h2><p>血液型を当てるだけじゃない。<br />いつもの行動から見えてくる、<br />あなたの、ちょっと意外な一面。</p><h2>何型っぽ？とは？</h2><p>16問の日常行動から、A型・B型・O型・AB型のどれに見られやすいかをチェックする血液型印象診断です。</p></section>
    <section className="home-section"><div className="section-heading"><p className="eyebrow">WHAT YOU’LL FIND</p><h2>どんなことがわかる？</h2></div>
      <div className="sample-result"><p className="sample-label">たとえば、こんな結果。</p><div className="sample-main"><strong>A<span>型っぽ！</span></strong><span className="sample-score">78<small>%</small></span></div><p className="sample-subtype">きっちり安心タイプ</p><p>ちゃんとしていて、任せると安心な人</p><span className="sample-flower" aria-hidden="true">✳</span></div>
      <div className="discovery-list"><article><span>01</span><div><h3>あなたらしさを、7つの傾向で。</h3><p>計画性や社交性など、日常に表れるあなたのプロフィール。</p></div></article><article><span>02</span><div><h3>「なんで？」にも、少し納得。</h3><p>選んだ回答から、結果につながった理由がわかります。</p></div></article><article><span>03</span><div><h3>本当の血液型とのギャップも。</h3><p>「予想はA型、実際はO型！」そんな違いも楽しめます。</p></div></article></div>
    </section>
    <section className="home-section how-section"><p className="eyebrow">HOW IT WORKS</p><h2>診断の流れ</h2><p>旅行、LINE、休日、友達との時間。<br />身近な16シーンに、直感で答えてみよう。</p><ol className="steps"><li><span>1</span>16問に答える</li><li><span>2</span>結果と理由を見る</li><li><span>3</span>本当の血液型と比べる</li></ol></section>
    <section className="home-section"><p className="eyebrow">FOUR IMPRESSIONS</p><h2>A型・B型・O型・AB型の特徴</h2><div className="type-grid">{types.map(({ type, label }) => <Link href={`/blood-type/${type.toLowerCase()}`} key={type} className={`type-mini type-${type.toLowerCase()}`}><strong>{type}<small>型</small></strong><p>{label}</p></Link>)}</div><p className="fine">一般的に語られるイメージです。血液型で性格が決まるという意味ではありません。</p></section>
    <section className="home-section bottom-cta"><p className="eyebrow">READY TO FIND OUT?</p><h2>さて、あなたは何型っぽい？</h2><Link className="button primary" href="/quiz">無料で診断する <span aria-hidden="true">↗</span></Link><p className="fine">約2分 · 全16問 · 登録不要</p></section>
  </main>;
}
