# Phase 3〜5 実装報告

対象: `/Users/yama/Documents/血液型`。2026-09-20確認。

## 実装概要

ユーザー確認を受け、Phase 3〜5を実装した。Phase 1〜2の診断配点・式・結果文章は変更していない。API、Supabase、公開、SEO記事などPhase 6以降には進んでいない。

- `/`: モバイル向けトップ、診断の説明、結果例、CTA。本文は静的HTML。
- `/quiz`: 診断説明→16問4択→短い分析演出。回答は200msで次問へ移動（reduced-motionでは即時）。戻る・回答変更・進捗・途中復元に対応。
- `/result`: primaryType色のHero、指数、サブタイプ、一言コピー、長所2つ、弱点1つ、展開式7軸グラフ、固定説明、選択回答の理由、secondaryType、4タイプ指数。
- 結果表示後のみactualTypeを選択し、一致・不一致・不明を表示。計算済み診断を変更しない。
- Web Share API、LINE、X、URLコピー。失敗/キャンセル/未対応の処理、コピーできない場合の選択可能URL、ネイティブ共有待機時の代替導線。
- 再診断で回答・結果・実血液型をリセットしてQ1へ戻る。

## 保存とプライバシー

localStorage: 途中回答・質問位置・quizVersionのみ。完了時に削除。

sessionStorage: 完了した回答・quizVersionのみ。同じタブで結果をリロードした場合は再計算。actualTypeはReactのメモリ内だけに持ち、再読み込み・再診断でリセット。

ストレージのJSON破損、不正回答、質問位置の不整合、古いバージョン、過大データを無視する。ストレージが拒否された場合もメモリ上で診断を続けられる設計。

サーバーへの回答送信・匿名DB保存はまだない。収集しているような表示を避け、Phase 6で保存実装とプライバシー文言を同時に追加する。共有文にはactualTypeを含めず、共有URLはトップのoriginのみ（回答や結果のクエリなし）。

## 主要ファイル

| 領域 | ファイル |
|---|---|
| トップ | src/app/page.tsx |
| 診断画面 | src/app/quiz/page.tsx、src/components/QuizFlow.tsx |
| 結果画面 | src/app/result/page.tsx、src/components/ResultView.tsx |
| 答え合わせ | src/components/ActualTypeSelector.tsx、src/lib/quiz/comparison.ts |
| 共有 | src/components/ShareButtons.tsx、src/lib/quiz/share.ts |
| 状態・復元 | src/components/QuizSession.tsx、src/lib/browser/storage.ts |
| 色・表示文・演出設定 | src/lib/quiz/presentation.ts |
| デザイン・アクセシビリティ | src/app/globals.css、src/components/SiteChrome.tsx |
| 診断ロジック | src/lib/quiz/scoring.ts、scoreMath.ts、questions.ts、bloodTypeProfiles.ts、subtypes.ts、reasons.ts、resultCopy.ts、versions.ts |
| Unit Test | tests/quiz.test.ts、spec-parity.test.ts、browser-helpers.test.ts |
| E2Eコード | playwright.config.ts、tests/e2e/experience.spec.ts |
| API・DB・Security Headers・SEO記事 | 後続Phase。まだ実装していない |

## 自動テスト結果

| 項目 | 結果 |
|---|---|
| pnpm lint | 成功、警告0 |
| pnpm typecheck | 成功 |
| pnpm test | 3ファイル、70テスト成功 |
| 診断テスト | 4,096回答パターン、7軸境界、4タイプ、12式、同点順、actualType不変性、仕様書との一致 |
| 新しいUnit Test | 途中復元の異常入力、version確認、余分なactualType除去、共有URL、native share成功/キャンセル/失敗/未対応、コピー成功/失敗 |
| pnpm build | 成功。/、/quiz、/resultを静的生成 |
| HTTP smoke | 3ルートが200、固有titleとnoindex/followを確認。トップの説明本文をHTMLで確認 |
| pnpm audit --json | 全severity 0件 |
| pnpm peers check | 問題なし |
| API tests | 未実施。API未実装 |
| Playwright E2E | 10シナリオ作成。実行はブラウザ起動段階で失敗。アプリのテスト成功とはしていない |

Playwright失敗理由: macOSの実行制限により、ChromiumのMachPortRendezvousServer起動がPermission deniedで終了。テスト本体に入る前の環境エラー。権限を迂回せず、利用可能なアプリ内ブラウザに切り替えて下記を検証した。

## アプリ内ブラウザで実際に確認した項目

- トップ→説明→全16問→分析→結果の完走。
- Q3からQ2へ戻り、旧回答の選択状態を確認してA→Cへ変更。リロード後Q3に復元。
- A型76%の結果で、actualType=A/O/unknownの一致・不一致・不明の文章を確認。Heroと7軸は変更前後で完全一致。
- 結果のリロードで同じ結果に復元し、actualTypeは消えることを確認。
- URLコピーで「リンクをコピーしました！」を確認。
- 再診断でQ1・回答0件へ戻ることを確認。その後の/result直接アクセスでは「診断結果が見つかりません」を表示。
- キーボードで見出しからTab→選択肢→Enterで回答し、次の質問へフォーカスが移動することを確認。
- トップおよび全16問について375/390/430/768/1440pxの5幅で横はみ出しがないことをDOM寸法で確認。Q1の最小回答ボタン高さは76px（375pxでは約88px）。
- 結果画面も同5幅で横はみ出しなし。375pxのHeroでサービス名・判定・指数・サブタイプを同時に視認。
- 別の回答でB型87%・我が道タイプとなり、黄色系のテーマへ切り替わることを目視確認。
- 検証で見つかった質問フォーカス時のスクロールずれを修正。質問切替後はscrollY=0、進捗と戻るボタンも画面上部に表示。

ネイティブ共有はアプリ内ブラウザでPromise待機になり、OS側の共有シート完了を確認できなかった。送信やSNS投稿はしていない。キャンセル・失敗はUnit Test、LINE/Xは生成URL・文言で確認した。実機での共有完了、ストレージ全面拒否のブラウザ統合試験、全E2E一括成功は残る。

## Security Review（SECURITY_SPEC.md各節）

「完了」は今回までの実装範囲での確認であり、公開準備完了を意味しない。

| 節 | 項目 | 状態 |
|---|---|---|
| 1 | 基本方針 | 完了（現範囲）。最小データ、診断結果はローカル計算 |
| 2 | Secret | 完了（現範囲）。空の雛形だけ。実接続後のbundle検査は未完了 |
| 3 | ブラウザDB直接接続禁止 | 完了（現範囲）。Supabaseクライアント・直接通信なし |
| 4 | DB権限 | 未完了、Phase 6 |
| 5 | DB拒否テスト | 未完了、Phase 6 |
| 6 | API入力Validation | 未完了、Phase 6 |
| 7 | answers検証 | 計算入口・復元時は完了。HTTP入力は未完了 |
| 8 | actualType検証 | 固定ボタンと型は完了。HTTP入力は未完了 |
| 9 | version | 復元時の1.0確認は完了。APIは未完了 |
| 10 | サーバー再計算 | 共通pure function完了。APIへの接続は未完了 |
| 11 | Request Size | 未完了、Phase 6 |
| 12 | Content-Type | 未完了、Phase 6 |
| 13 | Rate Limit | 外部サービス側で設定必要。未完了 |
| 14 | Bot Protection | 外部サービス側で設定必要。未完了 |
| 15 | Origin/Host | 未完了、Phase 6 |
| 16 | CSP/Security Headers | 未完了、Phase 9 |
| 17 | Browser Permissions | 不要機能の利用なし。Permissions-Policyは未完了 |
| 18 | XSS | 完了（現範囲）。固定データをReactで描画。HTML挿入なし |
| 19 | SQL Injection | DB処理がないため未完了。Phase 6で確認 |
| 20 | production Error | 共有/復元で内部情報を表示しない。APIは未完了 |
| 21 | Logging | 完了（現範囲）。診断データ・Secretのconsole出力なし |
| 22 | 個人情報 | 完了（現範囲）。取得・送信なし |
| 23 | localStorage | 完了。途中回答/位置/versionのみ。actualTypeは保存しない |
| 24 | Dependencies | audit 0件。ESLint 9サポート終了対応は未完了 |
| 25 | Secret Scanning | GitHub側で設定必要、未実施 |
| 26 | Git | .gitignore完了。Git初期化/commit/pushは未実施 |
| 27 | HTTPS | 本番Vercel/Domain側で設定・確認必要 |
| 28 | Admin禁止 | 完了。作成なし |
| 29 | DELETE/UPDATE等のAPI禁止 | 完了（現範囲）。公開APIなし |
| 30 | Security Test | 部分完了。計算・復元・共有・audit/build。DB/API/Headersは未完了 |
| 31 | SECURITY.md | 任意、未作成。非公開報告先は公開前に確定 |
| 32 | 最終原則 | 完了（現範囲）。匿名・最小データ・入力を信用しない設計 |

## Definition of Done

| 項目 | 現状 |
|---|---|
| TOP表示 | 完了・ブラウザ確認 |
| 16問回答 | 完了・ブラウザ確認 |
| 戻る | 完了・ブラウザ確認 |
| 回答変更 | 完了・ブラウザ確認 |
| リロード復元 | 完了・ブラウザ確認 |
| 7軸0〜100 | 完了・Unit Test |
| 4タイプ判定 | 完了・Unit Test |
| subtype判定 | 完了・Unit Test |
| secondaryType | 完了・Unit Test/画面確認 |
| 理由表示 | 完了・画面確認 |
| actualType選択 | 完了・画面確認 |
| actualTypeで結果不変 | 完了・Unit Test/画面比較 |
| match/mismatch表示 | 完了・画面確認 |
| SNS共有 | 導線実装。実機での送信完了は未確認 |
| DB保存 | 未完了、Phase 6 |
| 保存失敗でも結果表示 | DBは未実装。ローカル計算と独立する設計 |
| API Validation | 未完了、Phase 6 |
| server-side recalculation | 未完了、Phase 6 |
| RLS | 未完了、Phase 6 |
| DB grants | 未完了、Phase 6 |
| Rate Limit | 外部設定必要、未完了 |
| CSP | 未完了、Phase 9 |
| Security Headers | 未完了、Phase 9 |
| Secret非公開 | 現範囲で実値なし。実接続後の検証は後続 |
| mobile responsive | 全質問/結果を5幅で確認 |
| accessibility | Tab/Enter・見出しfocus確認。focus表示、44px以上ボタン、reduced-motion実装。全支援技術での確認は未実施 |
| unique metadata | 作成済み3ページで固有title/description。記事は未作成 |
| canonical | 未完了、Phase 8 |
| sitemap | 未完了、Phase 8 |
| robots.txt | 未完了、Phase 8 |
| noindex | /quiz・/resultに設定。公開前のためトップも暫定noindex |
| JSON-LD | 未完了、Phase 8 |
| Privacy | 未完了、Phase 7（データ保存前に対応が必要） |
| disclaimer | トップ・結果・共通フッターに配置 |
| lint success | 完了 |
| typecheck success | 完了 |
| test success | Unit 70件完了。E2E一括は環境ブロック |
| production build success | 完了 |

## 手動設定・未完了

現在のローカル試用にはSupabase/Vercel設定不要。READMEにNode 24、pnpm、dev/test/buildと、後続PhaseのGitHub/Supabase/migration/Vercel/Rate Limit/Bot/Domain/Search Consoleの手順を記載した。外部サービス上の操作は実施していない。

ESLint 9はNext.js付属プラグインのpeer依存に合わせて採用しているがサポート終了警告があり、プラグインのESLint 10対応後に更新が必要。

未完了: Phase 6〜10、ネイティブ共有の実機確認、Playwright E2E一括成功、Git初期化、SNS共有画像ファイル生成（任意機能）、Privacy/About記事・問い合わせ先。今回の画面では未作成ページへのリンクは出していない。

Phase 3〜5の実装・可能な範囲の検証で区切り、次はPhase 6以降の着手範囲を確認して進める。
