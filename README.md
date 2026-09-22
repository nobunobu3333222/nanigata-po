# 何型っぽ？

16問の日常行動から7つの傾向を計算し、A・B・O・ABの「っぽさ」、12サブタイプ、回答理由を表示するスマートフォン向けエンタメWebアプリです。血液型と性格の科学的因果を主張しません。

Phase 1〜10のアプリ実装を追加済みです。**外部サービスへのアプリ接続・公開は未完了**。GitHub・Vercel・Supabaseのアカウント作成、およびSupabase初期SQLの4項目がtrueであることはユーザーから確認済みです。公開前に下記の手動設定と実環境試験が必要です。現在の詳細な確認結果は `docs/phase-6-10-report.md`、前段階の記録は `docs/phase-1-2-report.md` / `docs/phase-3-5-report.md` を参照してください。

## ローカル実行

Node.js **24.x**（検証: 24.19.0）、pnpm **11.19.0** を使用します。

```sh
nvm install
nvm use
npm install --global pnpm@11.19.0
pnpm install --frozen-lockfile
pnpm dev
```

`http://localhost:3000` を開きます。環境変数がなくても診断・比較・共有は使えます。DB保存は未設定時に503となり、画面には保存失敗だけを表示します。ローカルで制限を無効にして保存する抜け道はありません。

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm start
pnpm check # lint → 型チェック → 全158テスト → production build
pnpm audit
pnpm peers check
```

テストにはVitest、実PostgreSQLエンジンのPGlite（テスト専用）、Playwrightを使用します。PGliteは本番依存ではありません。ブラウザのSupabase SDK、広告・行動追跡SDKは導入していません。

```sh
pnpm exec playwright install chromium
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3100 pnpm build
pnpm test:e2e
# ブラウザ起動が不要な本番HTTP検証だけ実行
pnpm exec playwright test tests/e2e/http.spec.ts
```

E2E用サーバーは3100番です。既に起動中の場合は同じ環境変数・最新buildのサーバーを使ってください。Playwrightは13件の画面テストと5件のHTTPテストがあります。このCodex環境ではChromiumのmacOS起動権限が拒否され、画面テストは未完走です。HTTP5件は成功し、画面はアプリ内ブラウザで別途検証しました。一般環境またはGitHub Actionsで全件実行してください。

## 技術と主要ファイル

Next.js 16.3.5 App Router / React 19.3.0 / TypeScript 5.9.3 strict / Tailwind CSS 4.3.3。

| 分野 | ファイル | 役割 |
|---|---|---|
| 診断 | `src/lib/quiz/scoring.ts`, `scoreMath.ts` | 回答だけから算出するpure function |
| 固定仕様 | `questions.ts`, `bloodTypeProfiles.ts`, `subtypes.ts`, `resultCopy.ts`, `versions.ts` | 質問・配点・プロトタイプ・12分類・文章・版を分離 |
| 理由 | `src/lib/quiz/reasons.ts` | 選択回答と他選択肢の平均類似度を比較し、正の寄与から最大3件 |
| 比較 | `src/lib/quiz/comparison.ts` | actualTypeを計算に使わず付加 |
| UI | `src/components/QuizFlow.tsx`, `ResultView.tsx`, `ActualTypeSelector.tsx`, `ShareButtons.tsx` | 診断・結果・比較保存・共有 |
| 復元 | `src/lib/browser/storage.ts`, `src/components/QuizSession.tsx` | バージョン付き回答の復元、壊れたデータの拒否 |
| API | `src/app/api/results/route.ts`, `src/lib/server/resultsHandler.ts` | POSTのみ、入力制限・再計算・保存 |
| 入力 | `src/lib/server/resultSchema.ts` | Zod strict、q01〜q16、4択、版、実血液型 |
| 保存 | `src/lib/server/resultRecord.ts`, `supabase.ts` | サーバー再計算、現行SecretでREST INSERT |
| DB | `supabase/migrations/202609200001_quiz_results.sql` | CHECK制約、RLS、grants、INSERT専用 |
| DB試験 | `tests/database.test.ts`, `supabase/tests/database/quiz_results.test.sql` | PostgreSQLローカル試験、Supabase pgTAP用試験 |
| Security | `src/lib/server/rateLimit.ts`, `src/proxy.ts`, `src/lib/security/headers.ts`, `next.config.ts` | 分散制限、nonce CSP、権限ヘッダー |
| SEO | `src/lib/seo.ts`, `bloodTypeArticles.ts`, `src/app/blood-type/`, `about/`, `privacy/` | SSR本文、固有メタ情報、内部リンク |
| Technical SEO | `sitemap.ts`, `robots.ts`, `icon.svg`, `og/route.tsx`, `StructuredData.tsx` | sitemap、robots、favicon、OG、JSON-LD |
| CI | `.github/workflows/ci.yml`, `.github/dependabot.yml` | 検証、audit、ブラウザ試験、依存更新 |

`src/lib/quiz/`内の同点順はA→B→O→AB、サブタイプは仕様順です。理由の同寄与は質問ID順。指数は確率ではなく、合計100にはなりません。正規化分母0の場合だけ50を返します。actualType変更では7軸・4指数・primary/secondary/subtypeは不変です。

## APIとデータ

許可するリクエストは `quizVersion` / `answers` / `actualType` の3項目のみ。未知フィールドは400。全16問必須、値はa/b/c/d。actualTypeはA/B/O/AB/unknown、quizVersionは1.0のみ。

- POST `/api/results` のみ。GET/UPDATE/DELETE APIはありません。
- JSONのみ、圧縮body不可。Content-Lengthだけでなくstreamを**2,048 bytes**で制限。body読込5秒、制限確認3秒、保存5秒。
- Origin/Hostを設定済み本番originと照合。これを認証・Bot防御の代替にはしません。
- 回答からサーバーで再計算。成功201 `{success:true}`、不正400、外部origin403、巨大413、形式415、上限429、保存・設定・保護障害503。
- 保存処理は `server-only`。現行`sb_secret_`を`apikey`にだけ設定。Authorizationへ転用せず、リダイレクトを許可しません。
- 実血液型選択時だけ保存。選択変更は別レコード、同一画面・同じ選択の再送を抑制します。本人識別子を作らないため、再読込や再診断を含む完全な重複排除は行いません。分析時はこの偏りを考慮してください。
- 診断結果と共有は保存成否から独立。actualTypeはReactメモリのみ。localStorageは途中回答・位置・版のみで完了時に削除。sessionStorageは完了回答・版のみで結果は再計算。
- 氏名、メール、位置、SNS ID、Cookie ID、IP、fingerprintを診断DBに保存しません。生データの閲覧APIもありません。

DATA_SPEC旧例の計算値付きpayloadよりSECURITY_SPECの厳格な3項目を優先しました。旧service_role例より現行Secretを優先し、現行キー専用で実装しています。仕様書の元ファイルは変更していません。

## 環境変数

`.env.example`を`.env.local`へコピーし、実値は例ファイルやGitに書かないでください。

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | 公開用HTTPS origin。パス・query・認証情報なし。共有、canonical、sitemap、Origin確認に使用。変更後は再build |
| `SUPABASE_URL` | Supabase Project URL。HTTPSのみ、サーバー専用 |
| `SUPABASE_SECRET_KEY` | 現行Secret `sb_secret_…`。サーバー専用 |

`VERCEL` / `VERCEL_ENV` / 保護されたクライアントIPヘッダーはVercelが供給します。手作業でローカル環境に偽装しないでください。必要なpreview試験時の`VERCEL_AUTOMATION_BYPASS_SECRET`はVercel管理画面で設定し、ブラウザへ公開しません。

Secret名に`NEXT_PUBLIC_`を付けることは禁止です。空設定・ローカル実行・送信制限未設定時には保存を停止します。

## Supabaseの手動設定（未実施）

1. Supabaseプロジェクトを作成し、SettingsのAPI Keysから現行Secretを取得。URLとSecretをVercelのサーバー側環境変数へ登録します。チャット・README・Gitには貼りません。
2. Supabase CLIを公式手順で導入。Dockerが使える開発環境で `supabase init`（config未作成時）、`supabase start`、`supabase db reset`、`supabase test db` を実行します。最後のコマンドはpgTAP12件です。この環境ではCLI/Dockerがなく未実施です。
3. 対象プロジェクトを確認して `supabase login` → `supabase link --project-ref <対象ref>` → `supabase db push --dry-run` → `supabase db push`。専用の新規プロジェクトで適用してください。実運用DBの変更前はバックアップと対象確認が必要です。
4. Dashboardで`quiz_results`のRLS有効・公開policyなしを確認。anon/authenticatedのSELECT/INSERT/UPDATE/DELETEがすべて拒否され、service_roleはINSERTだけであることを検証します。migrationはPUBLICにも権限を付けません。
5. 非公開の検証用環境でPublishable Key/anonと認証済みトークンそれぞれからREST4操作の拒否を確認。Secretはサーバー内でのみ使用し、POST成功後にDashboardから保存値と再計算結果を比較します。
6. 保存期間・削除運用・バックアップ方針を決め、Privacy本文の運用と一致させます。管理画面はSupabase Dashboardを利用し、公開管理APIを作りません。

## Vercel・Rate Limit・Botの手動設定（未実施）

1. GitHubリポジトリをVercelにImport。Framework: Next.js、Node 24.x、install: `pnpm install --frozen-lockfile`、build: `pnpm build`。環境変数をProduction/Previewで分離して設定します。
2. **Firewall → Configure → New Rule**で条件`@vercel/firewall`、Rate limit ID **`quiz-results`** を作成。初期目安はIP単位**10回/600秒**、超過時は拒否。利用可能な期間・件数は管理画面とプランで確認し、同程度の制限に設定します。Review Changes→Publishまで行って初めて有効です。
3. SDKのルールが見つからない・ブロック・例外・タイムアウトはすべて保存を止めます。IPはVercel内で処理され、診断DBへ渡しません。SDKに任意HostやCookie/Authorizationを渡さない実装です。
4. **無料の個人・非商用試験公開では、Rate Limitは上記SDK用の1ルールに限定**します。Hobbyは1プロジェクト1ルールのため、別のエッジRate Limitを追加する前提にはしません。将来プランを変更した場合はPOST `/api/results`のエッジ制限や全体上限を追加検討します。SDK制限はFunction到達後に働くため、Functionへの大量アクセス自体は防げません。無料枠の使用量を監視し、異常時は保存機能または公開を停止する運用にします。カウンターはリージョン別であり、全世界で厳密な10回上限ではありません。
5. 利用可能な**Bot Protection / Bot Management**を有効化。正常利用への影響を確認し、異常POSTが続く場合はChallenge/WAFルールを追加。端末fingerprintをアプリへ導入しません。
6. Preview試験でSDKが動作するよう、公式SDK手順に従いSystem Environment VariablesとProtection Bypass for Automationを設定します。公開originと別のPreviewでは、そのPreviewに対応するNEXT_PUBLIC_SITE_URL/Firewall host設定を確認してください。Productionへの書込みテストで代用しないでください。
7. 正常1件保存、繰り返しPOST→429、ルール削除/不達→503・DB保存なし、DB障害時も結果表示維持を検証。制限機能がプランで使えない場合、このまま保護を外さず、分散制限の代替を実装してから公開します。

## CSP・セキュリティ運用

全HTMLはSSRで、毎リクエストのnonceをNext.jsへ渡します。scriptはnonce/strict-dynamic、productionのunsafe-eval/unsafe-inlineは禁止。型カラー・棒幅に必要なstyle属性だけ許可しています。外部JS、広告、iframe、camera/microphone/geolocationは不要なので許可していません。CSP・nosniff・Referrer-Policy・Permissions-Policy・X-Frame-Optionsを設定。公開HTTPS origin設定時はHSTSも付与します。

NonceのためHTMLは動的SSRです。SEO本文は初期HTML内にあります。CDNでHTMLを独自キャッシュするとnonce不一致の原因になるため、この構成では行わないでください。OG用Noto Sans JPは必要文字のサブセットを同梱し、実行時の外部フォント取得を不要にしています。ライセンスは `src/assets/OFL-NotoSansJP.txt`。

ログは固定エラーカテゴリのみ。リクエスト全体・診断・actualType・Secret・Cookie・Authorization・例外詳細を出しません。Vercel等の標準ログの保持/アクセス権も管理してください。

`pnpm audit`をCIで実行。Dependabotはnpm週次、Actions月次。ESLint9.39.5はNext付属プラグインとのpeer互換性のため固定していますが、サポート終了警告が残っています。互換性を確認して更新する作業が必要です。optional install hookは`pnpm-workspace.yaml`で制限しています。

## GitHub・ドメイン・Search Consoleの手動設定（未実施）

- **GitHub**: リポジトリを作成してpush。Git管理フォルダへの権限を追加し、ローカルGit初期化を完了しました。初期commit前に`.env*`が除外されることを確認し、Secret Scanning/Push Protectionを利用可能な範囲で有効化。漏洩したキーは削除だけでなく直ちにローテーション。ActionsのCI成功を確認し、必須チェックへ設定します。公開Issueへ秘密情報や未修正脆弱性を書かず、非公開の報告先を定めてください。
- **ドメイン**: Vercel Domainsで所有ドメインを追加し、提示されたDNSレコードを登録。正式HTTPS URLをNEXT_PUBLIC_SITE_URLに設定して再deploy。HTTP→HTTPS、証明書、canonical、OG画像の絶対URLを確認します。
- **運営情報**: 公開前に運営者名・非公開のセキュリティ報告窓口・一般問い合わせ先・データ保持運用を決め、About/Privacyへ実情報を追記してください。架空の連絡先は入れていません。
- **Search Console**: Domain propertyを作成しDNS TXTで所有権を確認。`https://<正式domain>/sitemap.xml`を送信。8ページのindex、/quizと/resultのnoindexをURL検査で確認。月1回、検索クエリ・表示・クリック・CTRと主要語を確認します。

本番HTTPS URLを設定したProductionでは公開8ページをindexにします。ローカル・未設定・Vercel Previewではnoindexです。robotsはquiz/resultをDisallowせず、Googleがnoindexを読めるようにしています。検索順位は保証しません。AnalyticsのCTAイベント送信とKPIダッシュボードは未実装で、外部追跡を勝手に追加していません。

## 仕様書と確認資料

PRODUCT_SPEC.md（全体） / SECURITY_SPEC.md（セキュリティ） / QUIZ_LOGIC.md（計算） / RESULT_CONTENT.md（固定文章） / UI_SPEC.md（UX） / DATA_SPEC.md（DB/API） / SEO_SPEC.md（検索）。領域ごとの優先順位はユーザー指示どおりです。

公式資料: [Next CSP](https://nextjs.org/docs/app/guides/content-security-policy)、[Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)、[Vercel Rate Limit SDK](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk)、[WAF設定](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting)。
