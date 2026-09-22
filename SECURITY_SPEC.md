# 何型っぽ？｜Security Specification

## 1. 基本方針

本サービスは最小権限・最小データを基本とする。

セキュリティ上の優先順位は以下。

1. Secretをブラウザへ出さない
2. DBをブラウザから直接操作させない
3. API入力を信用しない
4. 不要な個人情報を収集しない
5. 大量リクエスト・Botによるデータ汚染を防ぐ
6. XSS・クリックジャッキング等のWeb攻撃を抑える
7. 依存パッケージとSecret漏洩を継続監視する

---

# 2. Supabase Secret

可能であれば現行のSupabase Secret Keyを使用する。

```text
SUPABASE_SECRET_KEY
```

旧service_roleキーを使用する場合も、完全にサーバー専用とする。

以下は禁止。

```text
NEXT_PUBLIC_SUPABASE_SECRET_KEY
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
```

Secret Key / service_roleは、

- ブラウザ
- Client Component
- localStorage
- GitHub
- ログ
- エラーメッセージ

へ絶対に出さない。

`.env.local` を `.gitignore` 対象とする。

`.env.example` には値を記載しない。

---

# 3. ブラウザからSupabaseへ直接接続しない

MVPではブラウザからquiz_resultsを直接操作しない。

必ず、

```text
Browser
↓
POST /api/results
↓
Server
↓
Supabase
```

とする。

ブラウザ側にSupabaseクライアントが不要なら導入しない。

---

# 4. Database権限

`quiz_results` にRLSを有効化する。

さらに、

```text
anon
authenticated
```

に対する不要な、

```text
SELECT
INSERT
UPDATE
DELETE
```

権限をrevokeする。

RLSだけに依存しない。

一般ユーザーがSupabase Data API経由でquiz_resultsを読み書きできないことを確認する。

---

# 5. Databaseテスト

Supabase DBテストを作成し、

```text
anon SELECT → DENY
anon INSERT → DENY
anon UPDATE → DENY
anon DELETE → DENY

authenticated SELECT → DENY
authenticated INSERT → DENY
authenticated UPDATE → DENY
authenticated DELETE → DENY
```

を確認する。

サーバー側のSecret Keyを使用する処理のみ保存可能とする。

---

# 6. API入力Validation

`POST /api/results` はすべての入力を信用しない。

Zod等によるSchema Validationを使用する。

許可するフィールドは、

```text
quizVersion
answers
actualType
```

だけ。

未知のフィールドは拒否または除去する。

---

# 7. answers Validation

必ず、

```text
q01〜q16
```

の16件が存在すること。

回答は、

```text
a
b
c
d
```

のみ許可。

文字列長やObjectサイズにも上限を設定する。

---

# 8. actualType Validation

許可：

```text
A
B
O
AB
unknown
```

その他は400で拒否。

---

# 9. quizVersion

サーバー側で存在するVersionのみ許可。

例：

```text
1.0
```

任意のversion文字列を受け入れない。

---

# 10. サーバー側再計算

クライアントから、

```text
axisScores
typeScores
primaryType
secondaryType
subtype
isMatch
```

を保存値として受け取らない。

必ず、

```text
answers
↓
Server
↓
診断ロジック再計算
```

を行う。

actualTypeは診断計算へ使用しない。

---

# 11. Request Size

`POST /api/results` のbodyは非常に小さいため、巨大Payloadを受け入れない。

想定サイズを大幅に超えるRequestは拒否する。

---

# 12. Content-Type

APIは原則、

```text
application/json
```

のみ受け付ける。

それ以外は415または400で拒否可能。

---

# 13. Rate Limit

`POST /api/results` にはRate Limitを設ける。

目的：

- Botによる大量登録
- DBコスト増加
- 分析データ汚染

を防ぐ。

可能であればVercel Firewall / Rate Limitingを優先する。

アプリ側でIPを永続保存する必要はない。

正常ユーザーが16問診断を利用する上で支障のない制限値とする。

---

# 14. Bot対策

Vercel Bot Protection等、利用可能なプラットフォーム機能を有効化する。

公開後に異常なPOSTが確認された場合は、

```text
Challenge
Rate Limit
WAF Rule
```

等を追加する。

CAPTCHAはMVP開始時には必須としない。

正常ユーザーへの摩擦を増やさない。

---

# 15. Origin確認

`POST /api/results` は可能な範囲で、

```text
Origin
Host
```

を検証し、本番サイト以外からの不自然なBrowser POSTを拒否する。

ただしこれ単独をセキュリティ境界とは考えない。

---

# 16. Security Headers

全ページで適切なSecurity Headerを設定する。

最低限：

```text
Content-Security-Policy
X-Content-Type-Options: nosniff
Referrer-Policy
Permissions-Policy
```

必要に応じて：

```text
Strict-Transport-Security
X-Frame-Options
```

CSPでは可能な限り、

```text
default-src 'self'
object-src 'none'
base-uri 'self'
frame-ancestors 'none'
```

を基本とし、実際に必要なVercel / Analytics / Font等だけを明示的に許可する。

`unsafe-eval` はproductionで原則許可しない。

CSP導入後は全主要画面をテストする。

---

# 17. Browser Permissions

本サービスでは、

```text
camera
microphone
geolocation
```

を使用しない。

Permissions-Policyで不要な機能を無効化する。

---

# 18. XSS対策

ユーザー入力をHTMLとして直接描画しない。

`dangerouslySetInnerHTML` は原則禁止。

診断文・回答文はアプリ内の固定データから表示する。

将来的に自由入力を追加する場合も必ずescape / sanitizeする。

---

# 19. SQL Injection

SQL文字列をユーザー入力から手作業で組み立てない。

Supabase Clientまたはパラメータ化Queryを使用する。

---

# 20. Error Message

productionでは、

- SQLエラー詳細
- Stack trace
- Secret
- Supabase内部情報

をブラウザへ返さない。

ユーザーには、

```text
保存に失敗しました。
診断結果はそのままご覧いただけます。
```

程度の一般メッセージを返す。

---

# 21. Logging

ログへ以下を出力しない。

```text
Secret Key
Authorization Header
Cookie
完全なRequest Body
actualTypeを含むユーザーデータ全文
```

必要な場合も、

```text
request failed
status
timestamp
error category
```

程度にする。

---

# 22. 個人情報

アプリ独自には以下を収集・保存しない。

```text
氏名
メール
電話番号
住所
位置情報
SNS ID
広告ID
端末Fingerprint
```

IPアドレスも分析用DBには保存しない。

インフラ標準ログについては利用サービスの仕様に従う。

---

# 23. localStorage

localStorageには、

```text
診断途中の回答
現在の質問番号
```

のみ保存。

Secretや認証情報は絶対に保存しない。

診断完了時に不要データを削除する。

---

# 24. Dependencies

不要なnpm packageを追加しない。

新規dependency導入時は、

- メンテナンス状況
- 必要性
- 既知脆弱性

を確認する。

定期的に、

```text
npm audit
```

等で確認する。

GitHub Dependabot等の利用も推奨する。

---

# 25. Secret Scanning

GitHubのSecret Scanning等、利用可能なSecret検出機能を有効化する。

Secretが一度でもGit履歴へ入った場合、

```text
削除するだけ
```

ではなく、

```text
キーを即時ローテーション
```

する。

---

# 26. Git

`.gitignore` に最低限、

```text
.env
.env.local
.env.*.local
```

を含める。

Secretをコードへハードコードしない。

---

# 27. HTTPS

productionはHTTPSのみ。

Vercel標準HTTPSを利用する。

HTTPからHTTPSへリダイレクトされることを確認する。

---

# 28. Admin機能

MVPでは管理画面を作らない。

DB分析はSupabase Dashboard等、認証された管理環境から実施する。

公開Admin APIを作らない。

---

# 29. DELETE / UPDATE API

MVPでは、

```text
POST /api/results
```

以外のDB変更APIを原則作らない。

一般ユーザー向けに、

```text
DELETE
UPDATE
GET all results
```

等を公開しない。

---

# 30. Security Test

公開前に最低限確認する。

```text
□ Secret KeyがClient Bundleにない

□ GitにSecretが存在しない

□ anonでquiz_resultsをSELECTできない

□ anonでINSERTできない

□ authenticatedでもアクセスできない

□ 不正answersが400になる

□ 16問不足が400になる

□ 巨大Payloadが拒否される

□ 不正actualTypeが拒否される

□ actualType改変で診断結果が変わらない

□ API大量POSTへの対策がある

□ CSPが有効

□ iframe埋め込みを防止

□ camera/microphone/geolocationを無効化

□ productionエラーにstack traceが出ない

□ npm audit結果を確認

□ production build成功
```

---

# 31. SECURITY.md

リポジトリに`SECURITY.md`を設置可能。

最低限、

```text
脆弱性を公開Issueへ書かない
報告先
対応方針
```

を記載する。

個人開発MVPでは任意。

---

# 32. セキュリティ最終原則

「何型っぽ？」では、

```text
必要ないデータは集めない
必要ない権限は与えない
クライアント入力は信用しない
Secretはサーバーから出さない
```

を最優先する。

機能追加によってこの原則を崩さない。