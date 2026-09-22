# Phase 1〜2 実装報告

## 範囲

対象: `/Users/yama/Documents/血液型`。7仕様書のみのフォルダから、Next.js App Router / TypeScript strict / Tailwind / ESLint / Vitestの基盤と独立した診断計算を作成した。元の仕様書は変更していない。

Phase 3〜5はユーザー確認待ち。UI完成・DB保存・本番公開は未完了。

## 診断ロジック

- q01〜q16の4択、仕様通りの配点。
- 7軸の生スコア、質問データから求めた理論上のmin/maxによる0〜100への整数正規化。
- 4タイプの平均絶対距離から類似度算出。合計100%に変換しない。
- primary/secondary、固定同点順、12サブタイプの式。サブタイプの式は丸めず比較。
- 選択回答を他の3選択肢に置き換えた場合との類似度差から、正の寄与の最大3件を抽出。
- 固定の結果文章・長所2つ・弱点1つ・7軸の段階別文章。
- scoreGap/isTie/isCloseの分析用情報。DB保存はまだない。
- actualTypeはscoreQuizの引数に存在しない。診断後の付加関数にA/B/O/AB/unknown/nullを渡しても診断結果が変わらないことをテスト。

主要ファイルはREADME「技術構成・主要ファイル」を参照。API/DB/Security Headers/SEOの実装ファイルは後続Phaseで追加。

## テスト結果

実行環境: Node v24.19.0 / pnpm 11.19.0。

| 検証 | 結果 |
|---|---|
| pnpm install --frozen-lockfile | 成功 |
| pnpm lint | 成功、警告0 |
| pnpm typecheck | 成功 |
| pnpm test | 2ファイル、51テスト成功 |
| 回答パターン検証 | 固定seedの4,096ケース。4タイプ出現、範囲、順位、理由の整合性を確認 |
| 軸境界 | 全7軸で、実回答から最小0・最大100へ到達 |
| サブタイプ | 12式、タイプ内で全12種が選択可能、同点順を確認 |
| actualType不変性 | A/B/O/AB/unknown/nullで全診断フィールド不変 |
| 仕様一致 | 64選択肢の文言・配点と12結果文章を仕様原文と比較 |
| pnpm build | 成功、仮トップを静的生成 |
| production HTTP smoke | GET / が200。仮トップ本文・noindexを確認 |
| pnpm audit --json | info/low/moderate/high/criticalすべて0 |
| pnpm peers check | 問題なし |
| API tests | 未実施。APIはPhase 6 |
| E2E / 375px UI検証 | 未実施。診断UIはPhase 3〜5 |

4^16全組み合わせの総当たりではない。DB・HTTP入力・画面のactualType変更は、それぞれ対応Phaseで統合検証が必要。

ESLint 9.39.5はプラグイン互換性のため採用したが、レジストリ上のサポート終了警告がある。ESLint 10に対応したプラグインへの移行を後続の依存関係点検で行う。audit 0件は将来の安全性の保証ではない。

## SECURITY_SPEC.md 全項目レビュー

「完了」は今回の実装範囲内の確認を意味する。API/DB/UIがない項目を実装完了とはしていない。

| 節 | 項目 | 状態・根拠 |
|---|---|---|
| 1 | 基本方針 | 完了（現範囲）。外部送信・個人情報取得なし |
| 2 | Supabase Secret | 完了（雛形）。空のサーバー専用環境変数のみ。実接続・bundle確認はPhase 6/9 |
| 3 | ブラウザからDB操作禁止 | 完了（現範囲）。Supabaseクライアントなし。API経路は未完了 |
| 4 | DB権限 | 未完了。RLS/revokeはPhase 6 |
| 5 | DB拒否テスト | 未完了。anon/authenticatedの4操作はPhase 6 |
| 6 | APIフィールド検証 | 未完了。Phase 6 |
| 7 | answers検証 | 計算入口は完了。16件の自前キー、a/b/c/d、余分なキー拒否。HTTP側は未完了 |
| 8 | actualType検証 | 未完了。HTTP側はPhase 6 |
| 9 | quizVersion検証 | 定数1.0は完了。サーバーで未知version拒否は未完了 |
| 10 | サーバー再計算 | 共通pure functionとactualType分離は完了。Route Handler接続は未完了 |
| 11 | Request Size | 未完了。Phase 6 |
| 12 | Content-Type | 未完了。Phase 6 |
| 13 | Rate Limit | 外部サービス側で設定必要。Phase 6/9で正常/過剰POST試験 |
| 14 | Bot対策 | 外部サービス側で設定必要。Vercelで設定 |
| 15 | Origin/Host | 未完了。Phase 6 |
| 16 | Security Headers/CSP | 未完了。Phase 9で実画面と検証 |
| 17 | Browser Permissions | 未完了。Permissions-PolicyはPhase 9 |
| 18 | XSS | 完了（現範囲）。固定文字列、HTML挿入なし。UI追加後に再検証 |
| 19 | SQL Injection | 未完了。DB処理なし。Phase 6でパラメータ化経路 |
| 20 | Error Message | 未完了。API未実装。Phase 6/9 |
| 21 | Logging | 完了（現範囲）。診断データ・Secretのログ出力なし |
| 22 | 個人情報 | 完了（現範囲）。取得・送信・保存なし |
| 23 | localStorage | 未完了。Phase 3で途中回答/位置だけ保存 |
| 24 | Dependencies | audit 0件・peer互換性確認済み。ESLintサポート終了への対応は未完了 |
| 25 | Secret Scanning | 外部サービス側で設定必要。GitHub未接続 |
| 26 | Git | .gitignoreは完了。ローカルGit初期化は環境の.git作成制限で未完了 |
| 27 | HTTPS | 外部サービス側で設定必要。Vercel/ドメインで確認 |
| 28 | Admin | 完了。作成していない |
| 29 | DELETE/UPDATE公開禁止 | 完了（現範囲）。公開APIなし |
| 30 | Security Test | 部分完了。計算入力検証・actualType不変・audit/build。DB/API/Headersは未完了 |
| 31 | SECURITY.md | 任意項目、未作成。公開前に実在する非公開報告先を確定する |
| 32 | 最終原則 | 完了（現範囲）。最小データ・診断入力検証を維持 |

## Definition of Done 各項目

| 項目 | 現状 |
|---|---|
| TOP表示 | 起動確認用の仮ページのみ。製品TOPは未完了 |
| 16問回答 | 計算用データ完了、画面未完了 |
| 戻る | 未完了 |
| 回答変更 | 未完了 |
| リロード復元 | 未完了 |
| 7軸0〜100 | 完了・テスト済み |
| 4タイプ判定 | 完了・テスト済み |
| subtype判定 | 完了・テスト済み |
| secondaryType | 完了・テスト済み |
| 理由 | 抽出完了、表示未完了 |
| actualType選択 | 画面未完了 |
| actualTypeで結果不変 | 計算層で完了・テスト済み |
| match/mismatch表示 | 比較関数完了、画面未完了 |
| SNS共有 | 未完了 |
| DB保存 | 未完了 |
| 保存失敗でも表示 | 未完了 |
| API Validation | 未完了 |
| server-side recalculation | 共通関数完了、API接続未完了 |
| RLS | 未完了 |
| DB grants | 未完了 |
| Rate Limit | 外部設定必要・未完了 |
| CSP | 未完了 |
| Security Headers | 未完了 |
| Secret非公開 | 雛形対応完了、実接続後の検証未完了 |
| mobile responsive | 製品UI未実装・未検証 |
| accessibility | 製品UI未実装・未検証 |
| unique metadata | 未完了 |
| canonical | 未完了 |
| sitemap | 未完了 |
| robots | 未完了 |
| noindex | 仮トップのみ設定、/quiz・/result未作成 |
| JSON-LD | 未完了 |
| Privacy | 未完了 |
| disclaimer | 仮トップにエンタメ説明、各本番画面への配置は未完了 |
| lint success | 完了 |
| typecheck success | 完了 |
| test success | Phase 2 unit tests完了 |
| production build success | 完了 |

## 手動設定・次の進め方

現在の計算テストには外部サービス設定は不要。READMEにGitHub、Supabase、migration、Vercel、Rate Limit/Bot、Domain、Search Consoleの設定手順と未実施であることを記載した。

ローカルGitを利用する場合は、対象フォルダでユーザーのターミナルから`git init -b main`を実行する。今回の環境では.git作成が実行環境の権限制約で拒否されたため、コミット・pushは実施していない。

確認後にPhase 3〜5（トップ・診断UI→結果UI→答え合わせ・共有）へ進む。Phase 6〜10はその後の工程として未着手。
