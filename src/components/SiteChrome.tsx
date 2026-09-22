import Link from "next/link";
import { DISCLAIMER } from "../lib/quiz/presentation";
export function Header() {
  return <header className="site-header"><Link href="/" className="wordmark" aria-label="何型っぽ？ トップへ">何型っぽ<span>？</span></Link><span className="header-note">16問で、わたしの見られ方。</span></header>;
}
export function Disclaimer() { return <p className="disclaimer">{DISCLAIMER}</p>; }
export function Footer() {
  return <footer className="site-footer"><Link href="/" className="wordmark small">何型っぽ？</Link><nav className="footer-nav" aria-label="サービス情報"><Link href="/blood-type">血液型の性格・特徴</Link><Link href="/about">サービスについて</Link><Link href="/privacy">プライバシーポリシー</Link></nav><Disclaimer /><p className="fine">© 何型っぽ？</p></footer>;
}
