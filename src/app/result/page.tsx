import { pageMetadata } from "../../lib/seo";
import { ResultView } from "../../components/ResultView";
export const metadata = pageMetadata("/result", "あなたの診断結果｜何型っぽ？", "7つの傾向からわかる、あなたの血液型っぽさ。", true);
export default function ResultPage() { return <ResultView />; }
