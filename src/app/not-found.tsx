import Link from "next/link";
export default function NotFound() { return <main className="quiz-shell missing-result"><p className="eyebrow">404</p><h1>ページが<br />見つかりません</h1><p>リンクを確認するか、トップから診断をお楽しみください。</p><Link href="/" className="button primary">トップへ戻る</Link></main>; }
