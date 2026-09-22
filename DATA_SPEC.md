# 何型っぽ？｜データ保存・Supabase仕様

## 1. データ保存の目的

MVPでデータを保存する目的は以下の3つ。

1. 診断がどの程度利用されているか把握する
2. 実際の血液型と回答傾向を分析する
3. 将来的に診断ロジックを改善する

ユーザーアカウントは作成しない。

氏名、メールアドレス、電話番号など、ユーザーを直接識別する情報は取得しない。

---

# 2. 技術構成

推奨構成：

```text
Frontend
Next.js
TypeScript

Database
Supabase PostgreSQL

Hosting
Vercel
```

診断計算そのものはクライアント側で実施可能。

データ保存のみ、

```text
Client
↓
Next.js API / Route Handler
↓
Supabase
```

の構成を推奨する。

ブラウザから直接データベースへINSERTしない。

---

# 3. 保存タイミング

診断結果表示直後には、まだ保存しない。

本当の血液型を選択した時点で保存する。

ただし、

```text
わからない
```

を選択した場合も保存対象とする。

ユーザーが答え合わせをせず離脱した場合は、MVPでは保存しなくてもよい。

将来的には診断完了率分析のため、匿名イベント計測を追加可能。

---

# 4. メインテーブル

テーブル名：

```text
quiz_results
```

推奨カラム：

```sql
id uuid primary key default gen_random_uuid(),

quiz_version text not null,

answers jsonb not null,

axis_scores jsonb not null,

type_scores jsonb not null,

primary_type text not null,

secondary_type text not null,

subtype text not null,

actual_type text,

is_match boolean,

created_at timestamptz not null default now()
```

---

# 5. 各カラムの意味

## id

診断結果固有ID。

```text
UUID
```

ユーザーIDではない。

同じユーザーが複数回診断した場合、それぞれ別IDとして保存する。

---

## quiz_version

使用した診断ロジックのバージョン。

初期値：

```text
1.0
```

例：

```text
1.0
1.1
2.0
```

質問内容またはスコアロジックを変更した場合は必ず更新する。

---

## answers

全16問の回答。

形式：

```json
{
  "q01": "a",
  "q02": "c",
  "q03": "b",
  "q04": "a",
  "q05": "d",
  "q06": "c",
  "q07": "b",
  "q08": "b",
  "q09": "d",
  "q10": "a",
  "q11": "b",
  "q12": "a",
  "q13": "b",
  "q14": "c",
  "q15": "b",
  "q16": "d"
}
```

値は必ず、

```text
a
b
c
d
```

のいずれか。

---

# 6. axis_scores

正規化後の7軸。

```json
{
  "planning": 78,
  "caution": 84,
  "social": 52,
  "cooperation": 71,
  "sensitivity": 63,
  "freedom": 38,
  "objectivity": 66
}
```

すべて整数。

範囲：

```text
0〜100
```

---

# 7. type_scores

4血液型の「っぽさ指数」。

```json
{
  "A": 78,
  "B": 44,
  "O": 61,
  "AB": 67
}
```

すべて整数。

範囲：

```text
0〜100
```

4つの合計が100になる必要はない。

---

# 8. primary_type

診断結果1位。

許可値：

```text
A
B
O
AB
```

---

# 9. secondary_type

診断結果2位。

許可値：

```text
A
B
O
AB
```

primary_typeと同じ値は禁止。

---

# 10. subtype

12サブタイプのいずれか。

許可値：

```text
A1
A2
A3

B1
B2
B3

O1
O2
O3

AB1
AB2
AB3
```

---

# 11. actual_type

ユーザー本人が回答した実際の血液型。

許可値：

```text
A
B
O
AB
unknown
```

ユーザーが回答していない状態では、

```text
null
```

でもよい。

---

# 12. is_match

診断結果と実際の血液型が一致したか。

例：

```text
primary_type = A
actual_type = A

→ true
```

```text
primary_type = A
actual_type = O

→ false
```

actual_typeが、

```text
unknown
null
```

の場合は、

```text
null
```

とする。

---

# 13. 保存例

```json
{
  "quizVersion": "1.0",

  "answers": {
    "q01": "a",
    "q02": "a",
    "q03": "b",
    "q04": "a",
    "q05": "a",
    "q06": "d",
    "q07": "a",
    "q08": "b",
    "q09": "a",
    "q10": "a",
    "q11": "b",
    "q12": "a",
    "q13": "b",
    "q14": "a",
    "q15": "a",
    "q16": "b"
  },

  "axisScores": {
    "planning": 82,
    "caution": 88,
    "social": 51,
    "cooperation": 79,
    "sensitivity": 68,
    "freedom": 35,
    "objectivity": 64
  },

  "typeScores": {
    "A": 78,
    "B": 41,
    "O": 59,
    "AB": 67
  },

  "primaryType": "A",
  "secondaryType": "AB",
  "subtype": "A1",
  "actualType": "O",
  "isMatch": false
}
```

---

# 14. API

推奨エンドポイント：

```text
POST /api/results
```

リクエスト：

```json
{
  "quizVersion": "1.0",
  "answers": {},
  "axisScores": {},
  "typeScores": {},
  "primaryType": "A",
  "secondaryType": "AB",
  "subtype": "A1",
  "actualType": "O"
}
```

---

# 15. 重要：サーバー側で再計算する

クライアントから送られてきた、

```text
axisScores
typeScores
primaryType
secondaryType
subtype
```

をそのまま信用しない。

API側で、

```text
answers
+
quizVersion
```

から診断結果を再計算する。

つまり保存フローは、

```text
Client

answers
actualType

↓

API

回答形式を検証
↓
7軸再計算
↓
血液型スコア再計算
↓
subtype再計算
↓
DB保存
```

とする。

これにより、ブラウザから不正な診断結果を送信されてもデータ分析が汚れにくくなる。

---

# 16. APIリクエストは簡略化可能

最終的にはクライアントから送るデータを、

```json
{
  "quizVersion": "1.0",

  "answers": {
    "q01": "a",
    "q02": "b"
  },

  "actualType": "O"
}
```

だけにしてもよい。

診断結果はすべてサーバー側で再計算する。

この方式を推奨する。

---

# 17. バリデーション

サーバー側で必ず確認する。

## quizVersion

存在する診断バージョンのみ許可。

---

## answers

16問すべて存在すること。

```text
q01
〜
q16
```

各値は、

```text
a / b / c / d
```

のみ。

余計な質問IDは無視または拒否する。

---

## actualType

許可：

```text
A
B
O
AB
unknown
```

それ以外は拒否。

---

# 18. レスポンス

成功：

```json
{
  "success": true
}
```

必要なら、

```json
{
  "success": true,
  "resultId": "uuid"
}
```

でもよい。

MVPではresultIdをユーザーに見せる必要はない。

---

# 19. 保存失敗時

データ保存が失敗しても、診断結果画面はそのまま利用できるようにする。

ユーザー体験として、

```text
DB保存
=
診断成立条件
```

にはしない。

保存失敗はサーバーログへ記録する。

---

# 20. セキュリティ

SupabaseのService Role Keyをブラウザへ公開しない。

以下は必ずサーバー側環境変数として管理する。

```text
SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY
```

Service Role Keyは、

```text
NEXT_PUBLIC_
```

を付けない。

---

# 21. RLS

`quiz_results` は一般ユーザーから直接アクセスさせない。

推奨：

```text
RLS ON
```

ブラウザから、

```text
SELECT
INSERT
UPDATE
DELETE
```

を許可しない。

データ追加はサーバーAPIからService Roleを利用する。

---

# 22. ユーザーへのデータ公開

一般ユーザーが、

```text
他人の回答
他人の実際の血液型
集計前の生データ
```

を取得できるAPIは作成しない。

将来統計を公開する場合も、

```text
A型回答者の62%が〜
```

など十分に集計した状態のみ公開する。

---

# 23. 保存しない情報

MVPでは以下をDBへ保存しない。

```text
氏名
メールアドレス
電話番号
SNSアカウント
住所
正確な位置情報
生年月日
Cookie ID
端末固有ID
広告ID
ブラウザfingerprint
IPアドレス
```

サーバーやホスティングサービスの標準ログに一時的にIP等が含まれる可能性については、利用サービスの仕様に従う。

アプリ独自の目的では保存しない。

---

# 24. localStorage

ブラウザには診断途中の状態のみ保存する。

キー例：

```text
nanigata_quiz_progress_v1
```

内容：

```json
{
  "currentQuestion": 7,

  "answers": {
    "q01": "a",
    "q02": "c"
  }
}
```

診断完了後は削除してよい。

---

# 25. localStorageに保存しないもの

原則、

```text
actualType
```

は長期保存しない。

診断セッション中のみ保持する。

必要であればsessionStorageを使用する。

---

# 26. 分析用VIEW

将来分析しやすいよう、以下のVIEWを作成してもよい。

## blood_type_summary

例：

```text
actual_type
total_answers
a_prediction_count
b_prediction_count
o_prediction_count
ab_prediction_count
match_rate
```

---

# 27. 血液型ごとの回答分析

将来的に重要な分析。

例えばQ01について、

```text
実際のA型

A選択 42%
B選択 31%
C選択 12%
D選択 15%
```

のように算出する。

これにより、

```text
本当に質問が血液型判別に寄与しているか
```

を確認できる。

---

# 28. 将来用 question_response テーブル

MVPではJSONB保存でよい。

ユーザー数が増え、詳細分析が必要になったら、

```text
quiz_responses
```

を別テーブルとして追加する。

例：

```sql
id uuid
result_id uuid
question_id text
answer text
created_at timestamptz
```

1診断につき16行。

ただしMVP段階では不要。

まずは、

```text
quiz_results.answers jsonb
```

で運用する。

---

# 29. 重要分析指標

最低限以下を見られるようにする。

## 診断数

```text
COUNT(*)
```

---

## 実血液型分布

```text
A
B
O
AB
unknown
```

---

## 判定分布

```text
primaryType A
primaryType B
primaryType O
primaryType AB
```

---

## 一致率

```text
primary_type = actual_type
```

---

## 血液型別一致率

例：

```text
実際A型 → A型判定率
実際B型 → B型判定率
```

---

## 質問別回答率

```text
Q1-A
Q1-B
Q1-C
Q1-D
```

---

# 30. 注意：一致率だけで評価しない

このサービスの目的は、

```text
実際の血液型を高精度で当てる
```

ことだけではない。

重要なのは、

```text
結果に納得感がある
結果が面白い
自分の見られ方に気づける
共有したくなる
```

ことである。

そのため将来的には、

```text
診断完了率
シェア率
再診断率
```

も重要指標とする。

---

# 31. 将来追加するイベント計測

MVP公開後、必要に応じてイベント計測を追加する。

イベント候補：

```text
quiz_started

quiz_completed

actual_type_selected

share_clicked

share_x

share_line

share_native

link_copied

retry_clicked
```

個人追跡目的ではなく、サービス改善目的で利用する。

---

# 32. プライバシー表示

トップまたはフッターから、

```text
プライバシーポリシー
```

へアクセスできるようにする。

最低限、

```text
・診断回答を匿名で保存すること
・診断ロジック改善に利用すること
・氏名等を取得しないこと
```

を説明する。

実際の血液型入力付近にも、小さく、

```text
回答は匿名で集計し、
診断改善のために利用する場合があります。
```

と表示する。

---

# 33. データ保持

MVPでは診断改善のため継続保存を想定する。

ただし運営方針変更時にデータ削除できるよう、

```text
created_at
quiz_version
```

を必ず保持する。

特定期間以前のデータを削除可能な構造にする。

---

# 34. 診断バージョン管理

ロジック変更時に過去データを書き換えない。

例：

```text
quizVersion 1.0
質問初期版

quizVersion 1.1
係数調整

quizVersion 2.0
質問構成変更
```

分析時は原則として、

```text
quiz_version
```

ごとに分ける。

---

# 35. 設定ファイル

診断ロジックは、

```text
src/lib/quiz/
```

以下にまとめる。

推奨：

```text
questions.ts
scoring.ts
bloodTypeProfiles.ts
subtypes.ts
resultCopy.ts
versions.ts
```

例：

```text
versions.ts

CURRENT_QUIZ_VERSION = "1.0"
```

とする。

---

# 36. データベースマイグレーション

DB変更はSupabase管理画面だけで手動変更せず、

```text
supabase/migrations/
```

へSQLを保存する。

これによりCodexや将来の開発者がDB構造を再現できるようにする。

---

# 37. 推奨初期SQL

```sql
create table public.quiz_results (
  id uuid primary key default gen_random_uuid(),

  quiz_version text not null,

  answers jsonb not null,

  axis_scores jsonb not null,

  type_scores jsonb not null,

  primary_type text not null
    check (primary_type in ('A', 'B', 'O', 'AB')),

  secondary_type text not null
    check (secondary_type in ('A', 'B', 'O', 'AB')),

  subtype text not null
    check (
      subtype in (
        'A1','A2','A3',
        'B1','B2','B3',
        'O1','O2','O3',
        'AB1','AB2','AB3'
      )
    ),

  actual_type text
    check (
      actual_type is null
      or actual_type in ('A','B','O','AB','unknown')
    ),

  is_match boolean,

  created_at timestamptz not null default now(),

  constraint primary_secondary_different
    check (primary_type <> secondary_type)
);
```

---

# 38. インデックス

初期段階では以下で十分。

```sql
create index quiz_results_created_at_idx
on public.quiz_results(created_at);

create index quiz_results_quiz_version_idx
on public.quiz_results(quiz_version);

create index quiz_results_actual_type_idx
on public.quiz_results(actual_type);

create index quiz_results_primary_type_idx
on public.quiz_results(primary_type);
```

---

# 39. 最終保存フロー

```text
ユーザーが16問回答
↓
ブラウザ上で結果計算
↓
結果表示
↓
実際の血液型を選択
↓
POST /api/results

送信：
quizVersion
answers
actualType

↓
サーバー側Validation
↓
サーバー側で診断を再計算
↓
quiz_resultsへ保存
↓
success
```

---

# 40. MVPで重視すること

データ設計では、

```text
「たくさん集める」
```

より、

```text
「あとから分析できる状態で
正しいデータを集める」
```

ことを優先する。

最初から個人情報を持たず、

**匿名の回答データ × 実際の血液型**

というシンプルなデータセットを育てる。