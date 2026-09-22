import { pageMetadata } from "../../lib/seo";
import { QuizFlow } from "../../components/QuizFlow";
export const metadata = pageMetadata("/quiz", "16問の血液型印象診断｜何型っぽ？", "日常の行動から、あなたの見られ方をチェック。", true);
export default function QuizPage() { return <QuizFlow />; }
