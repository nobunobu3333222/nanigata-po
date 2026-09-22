# Phase 6〜10 実装・検証報告

確認日: 2026-09-21 / 作業フォルダ: `/Users/yama/Documents/血液型`

## 実装概要

Phase 1〜5の診断体験に、匿名保存API、Supabase migration、SEO全8ページ、Technical SEO、セキュリティ対策と検証を追加しました。**アプリのローカル実装は揃っていますが、本番公開のDefinition of Doneは未達です。** Supabase/Vercel/GitHub/ドメイン/Search Consoleは未接続・未設定です。

- APIは16問の回答・バージョン・actualTypeだけを受け、サーバーで診断を再計算します。
- actualType選択後に保存します。失敗・429・未設定でも結果、比較、共有を維持します。同一画面の同じ選択は再送しません。選択変更は匿名の別レコードになります。
- DBにRLS、anon/authenticatedの全権限revoke、service_roleのINSERT限定、型・範囲・整合性CHECKを追加。
- Vercel Firewall SDKを接続。ローカル、未設定、ルール不明、通信障害時は保存停止。単一プロセスのメモリカウンターを本番制限の代わりにしていません。
- ハブ・A/B/O/AB・About・Privacy本文をSSRで出力。各ページ固有のmetadata、canonical、WebSite/Breadcrumb JSON-LD、sitemap、robots、favicon、5種OG画像。
- 毎リクエストnonceを使うCSPとSecurity Headers。HTMLは動的SSR。style属性に限りinline許可、productionのscriptはunsafe-inline/evalなし。
- GitHub CIとDependabot設定ファイルを追加。GitHub上ではまだ実行していません。

## 主要ファイル

| 領域 | ファイル |
|---|---|
| 診断ロジック | `src/lib/quiz/scoring.ts`, `scoreMath.ts`, `questions.ts`, `bloodTypeProfiles.ts`, `subtypes.ts`, `resultCopy.ts` |
| 保存UI | `src/components/ActualTypeSelector.tsx`, `src/lib/browser/saveResult.ts` |
| API | `src/app/api/results/route.ts`, `src/lib/server/resultsHandler.ts`, `resultSchema.ts`, `resultRecord.ts`, `supabase.ts` |
| DB | `supabase/migrations/202609200001_quiz_results.sql` |
| Security | `src/lib/server/rateLimit.ts`, `src/proxy.ts`, `src/lib/security/headers.ts`, `next.config.ts` |
| SEO | `src/lib/seo.ts`, `bloodTypeArticles.ts`, `src/app/blood-type/`, `about/`, `privacy/`, `sitemap.ts`, `robots.ts`, `og/route.tsx`, `icon.svg` |
| 構造化データ | `src/components/StructuredData.tsx`, `ArticleChrome.tsx` |
| テスト | `tests/api.test.ts`, `server-adapters.test.ts`, `database.test.ts`, `seo-security.test.ts`, `tests/e2e/` |
| 運用 | `README.md`, `.env.example`, `.github/workflows/ci.yml`, `.github/dependabot.yml` |

## テスト結果

| 項目 | 結果・範囲 |
|---|---|
| lint | 成功、警告0 |
| typecheck | 成功、TypeScript strict |
| Unit / API / DB | **158件成功 / 7ファイル** |
| APIテスト | 不正・不足・余剰回答、型/version改変、派生値注入、Origin/Host、巨大body、Content-Type、レート制限、保存障害、再計算、全actualType不変性 |
| DBローカル試験 | **26件成功**（158件内）。PGliteのPostgreSQLでmigrationを実行。RLS、8拒否操作、service_role INSERT/他操作拒否、CHECK制約 |
| Supabase pgTAP | 12件のSQLを作成。CLI/Docker/実プロジェクト未設定のため未実行 |
| 本番HTTP E2E | **5件成功**。SEO初期HTML・固有メタ、nonce、noindex/robots/sitemap/404、5OG PNG(1200×630)、実Route Handlerの異常入力と未設定停止 |
| ブラウザE2E | 13シナリオ作成。代表シナリオを再実行したがChromium起動時にmacOS MachPort権限が拒否され、テスト本体開始前に停止。全13件の成功は未確認 |
| アプリ内ブラウザ | 下記の操作を実施し成功 |
| production build | 成功。記事とアプリはSSR、icon/robots/sitemapは静的出力 |
| dependency audit | 全severity 0件（489依存の検証） |
| peer dependencies | 不整合なし |
| Client Bundle Secret | テスト用のダミーSecret付きbuild後、配信JS13ファイルを検索。ダミー値、SUPABASE_SECRET_KEY/SUPABASE_URL、sb_secret_、service_roleの一致0 |

実際のSecretを使って試験したわけではありません。サーバーSDKとクライアントの境界、生成bundleの両方を確認しています。Git履歴の検査はGitリポジトリが未初期化のため未実施です。

### ブラウザで確認したこと

- SEO8ページを375px/1440pxで表示: 横はみ出しなし、H1は各1件。
- A型記事の375px実表示を目視確認。本文、パンくず、CTA、余白、型カラーを確認。
- CSP適用後の16問を375pxで全問回答。全問に横はみ出しなし、自動遷移、結果O74%表示。
- actualTypeをA/B/O/AB/unknownへ切り替え、全5選択でHero・7軸が同一。
- 未設定時の保存失敗メッセージを確認し、比較・結果・リンクコピーが引き続き利用可能。
- リロードで結果を復元し、actualTypeはリセット。
- 結果→対応する血液型記事へのリンク、各SEOページ表示、ConsoleにCSP/JSエラーなし。
- Phase 3〜5で戻る・変更・途中復元・再診断・キーボード・375/390/430/768/1440pxを確認済み。今回もCSP下の診断経路を再確認。
- OSのネイティブ共有完了、iOS Safari/Android Chrome実機は未確認。共有失敗/キャンセルはUnit Testで検証。

## Security Review（SECURITY_SPEC 全項目）

「完了」はローカルコードと検証の範囲です。外部設定・実環境確認を同じ意味で完了とは扱いません。

| § | 項目 | 状態 | 根拠・残作業 |
|---|---|---|---|
| 1 | 最小権限・最小データ | 完了 | 匿名保存、入力最小化、公開読取APIなし |
| 2 | Secret | 完了＋外部設定必要 | server-only、現行Secretのみ。実キーはVercelへ設定必要 |
| 3 | ブラウザからDB操作しない | 完了 | 同一origin Route Handlerのみ |
| 4 | Database権限 | 完了＋外部設定必要 | migration・ローカルPG成功。Supabaseへ適用必要 |
| 5 | DBテスト | 完了＋外部確認必要 | anon/auth 8拒否をローカルPGで実行。Supabase Data API/pgTAPは未実行 |
| 6 | API validation | 完了 | strict3項目、unknown拒否 |
| 7 | answers validation | 完了 | exact16問、a/b/c/d、own keys |
| 8 | actualType | 完了 | 5値限定、null/その他拒否 |
| 9 | version | 完了 | 1.0のみ |
| 10 | 再計算 | 完了 | answersのみからpure function、actualType不変性試験 |
| 11 | Request size | 完了 | Content-Lengthとstream双方2,048bytes、読込期限 |
| 12 | Content-Type | 完了 | JSONのみ、圧縮拒否 |
| 13 | Rate Limit | 実装完了・外部設定必要 | Vercel SDK、失敗時保存停止。Firewall `quiz-results` 作成と429試験必要 |
| 14 | Bot | 外部設定必要 | Vercel Bot Protection、エッジWAF、異常時Challenge。未有効化 |
| 15 | Origin | 完了 | 設定originとHost照合、cross-site拒否 |
| 16 | Headers | 完了＋外部確認必要 | nonce CSP、nosniff、Referrer、Permissions、frame禁止。本番HTTPS/HSTSは公開環境で確認 |
| 17 | Browser permissions | 完了 | camera/mic/geolocation/payment等禁止 |
| 18 | XSS | 完了 | ユーザーHTMLなし。dangerouslySetInnerHTMLなし。固定JSON-LDはタグ終端escape |
| 19 | SQL injection | 完了 | REST JSON、動的SQLなし。DB試験もパラメータ化 |
| 20 | Error | 完了 | 固定エラーのみ、SQL/stack/Secretを返さない |
| 21 | Logging | 完了＋外部確認必要 | 固定カテゴリのみ。インフラ側保持設定は管理者確認 |
| 22 | 個人情報 | 完了 | PII入力なし、IP/識別子を診断DBへ保存しない |
| 23 | localStorage | 完了 | 途中回答/位置/版のみ、完了時削除 |
| 24 | Dependencies | 完了・保守残あり | audit0、CI追加。ESLint9サポート終了警告への更新検討は未完了 |
| 25 | Secret Scanning | 外部設定必要 | GitHub上の機能有効化・非公開報告窓口設定 |
| 26 | Git | ignore完了・Git未初期化 | 環境権限によりgit init未完了、commit/pushなし |
| 27 | HTTPS | 外部設定必要 | Vercel/DNS/証明書/redirect確認 |
| 28 | Admin | 完了 | アプリ管理画面・公開Admin APIなし |
| 29 | 変更API制限 | 完了 | POSTのみ、GET/UPDATE/DELETEなし |
| 30 | Security Test | ローカル完了・実環境未完了 | bundle/API/SQL/headers/audit/build成功。外部DB/Firewall/HTTPSと画面E2Eの追加確認必要 |
| 31 | SECURITY.md | 未完了（仕様上任意） | 報告先未決定。READMEに公開Issueへ書かない方針を記載 |
| 32 | 最終原則 | 完了 | 不要データ/権限を追加せず、入力・Secretを分離 |

## Definition of Done

| 項目 | 状態 |
|---|---|
| TOP表示 | 確認済み |
| 16問回答 | 確認済み |
| 戻る | 前段階で確認済み |
| 回答変更 | 前段階で確認済み |
| リロード途中復元 | 前段階で確認済み、結果復元は今回再確認 |
| 7軸0〜100 | テスト成功 |
| 4タイプ判定 | テスト成功 |
| subtype | テスト成功 |
| secondaryType | テスト・画面確認済み |
| 理由 | テスト・画面確認済み |
| actualType選択 | 確認済み |
| actualTypeで診断不変 | 計算/API/画面の全選択で確認済み |
| match/mismatch | 確認済み |
| SNS共有 | 導線・コピー・関数試験成功。OS共有完了は実機未確認 |
| DB保存 | adapter/ローカルPG成功。Supabase実接続は未完了 |
| 保存失敗でも表示 | 画面確認済み |
| API Validation | Unit/API/実HTTP成功 |
| server-side recalculation | 成功 |
| RLS | ローカルPG成功、実Supabase適用待ち |
| DB grants | ローカルPG成功、実Supabase適用待ち |
| Rate Limit | SDK実装と異常系成功、外部ルール設定/実429は未完了 |
| CSP | nonceと実画面動作確認済み |
| Security Headers | 実HTTP確認済み |
| Secret非公開 | bundle検査成功、実キー未設定 |
| mobile responsive | 新規8ページ375/1440px、診断全問375px、前段階5幅確認 |
| accessibility | 見出し・ラベル・focus・aria-live・reduced-motion対応。専門監査/全支援技術試験は未実施 |
| unique metadata | 8ページ固有title/descriptionをHTTP検証 |
| canonical | 実装・HTTP確認、本番ドメイン設定待ち |
| sitemap | 8URL生成、quiz/result/apiを除外 |
| robots | quiz/resultクロール許可 |
| noindex | quiz/result確認済み、ローカル/Previewも保護 |
| JSON-LD | WebSite/Breadcrumbを初期HTMLで確認 |
| Privacy | ページあり。実運営者連絡先・保持運用は公開前に追記必要 |
| disclaimer | 本文・フッター・結果に表示 |
| lint | 成功 |
| typecheck | 成功 |
| tests | 158件＋HTTP5件成功。ブラウザE2Eは環境制限で未完走 |
| production build | 成功 |

## 手動設定・未完了事項

詳細手順はREADMEに整理しました。順序は以下です。

1. GitHub作成・push、Secret Scanning/Push Protection、CI全件実行。
2. Supabase検証プロジェクト作成、migration適用、pgTAPとData APIの権限試験、現行Secret設定。
3. Vercel環境変数、Firewall `quiz-results`（初期目安10回/600秒/IP）、エッジのPOST制限、Bot Protectionを設定。
4. 正常保存・429・保存障害の実環境試験。本番用DB・設定へ反映。
5. 所有ドメイン/DNS/HTTPS、本番URLで再build。実運営者・問い合わせ先・保持運用をPrivacy/Aboutへ追記。
6. 実機Safari/Chromeで共有完了、戻る/復元、アクセシビリティを確認。
7. Search Console登録、sitemap送信、index/noindex確認。

未完了: 実環境設定と公開、ブラウザE2E完走、実機共有、ESLint更新互換性対応、任意のSECURITY.md/非公開報告先、SEO_SPECのAnalytics CTAイベント・KPI収集。Analyticsは現在未導入であり、計測済みとは扱いません。匿名保存の重複は完全排除せず、正確なユニーク利用者数を示すものではありません。

採用した実装方針は[Next.jsのCSP手順](https://nextjs.org/docs/app/guides/content-security-policy)、[Supabase現行APIキー](https://supabase.com/docs/guides/getting-started/api-keys)、[Vercel Rate Limit SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk)に基づきます。
