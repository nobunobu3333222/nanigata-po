# 何型っぽ？｜Product Specification

## 1. プロダクト概要

### サービス名

**何型っぽ？**

### 説明名

**血液型印象診断**

### サービス概要

16問の日常行動に回答すると、

**「周囲からA型・B型・O型・AB型のどれっぽく見られそうか」**

を診断するスマートフォン向けWebアプリ。

一般的な血液型診断の、

```text
血液型
↓
性格
```

という流れではなく、

```text
日常行動
↓
性格傾向
↓
何型っぽく見えるか
```

という逆方向の体験を提供する。

診断終了後に実際の血液型を入力し、

```text
予想
vs
実際
```

のギャップも楽しめる。

---

# 2. プロダクトの価値

このサービスの本質は、

**血液型を当てることではない。**

ユーザーが、

```text
「自分ってこんなふうに見えるんだ」
```

という気づきを得ることを主な価値とする。

当たった場合：

```text
やっぱり自分って
A型っぽく見えるんだ
```

外れた場合：

```text
実際はO型だけど
A型っぽく見えるんだ
```

という、どちらの場合でも楽しめる体験を設計する。

---

# 3. ターゲット

### メインターゲット

10代後半〜30代程度。

以下のニーズを持つユーザー。

- 自分が人からどう見られているか気になる
- 性格診断が好き
- MBTI等の診断コンテンツを楽しむ
- 友達との話題が欲しい
- SNSで診断結果を共有したい

性別は限定しない。

---

# 4. MVPの目的

最初のMVPでは、

```text
診断する
↓
結果を見る
↓
本当の血液型と比較する
↓
共有する
```

というコア体験だけを完成させる。

機能を増やしすぎない。

---

# 5. MVPの成功条件

ユーザーが以下を問題なく完了できること。

```text
1. トップページを理解する

2. 診断を開始する

3. 16問すべて回答する

4. 結果を見る

5. なぜその結果になったか理解する

6. 本当の血液型を入力する

7. 予想と実際を比較する

8. 結果を共有する
```

---

# 6. MVPでは実装しない機能

以下はPhase 2以降。

```text
ユーザー登録

ログイン

マイページ

ランキング

コメント

AIチャット

友達から見た自分診断

友達との診断比較

ネイティブアプリ

通知

PWAインストール誘導

血液型キャラクター

広告最適化

有料プラン
```

---

# 7. 将来ビジョン

血液型は第1弾コンテンツとする。

将来的には、

```text
MBTIっぽさ

文系・理系っぽさ

長男・次男・末っ子っぽさ

第一印象タイプ

恋愛でどう見られるか

職場でどう見られるか
```

など、

**「他人から見た自分」**

をテーマとした診断プラットフォームへ展開可能な設計にする。

---

# 8. 技術スタック

推奨：

```text
Framework
Next.js

Language
TypeScript

Styling
Tailwind CSS

Database
Supabase / PostgreSQL

Hosting
Vercel

Version Control
Git / GitHub
```

Next.jsは安定版を使用する。

App Routerを使用。

---

# 9. 実装基本方針

以下を重視する。

```text
Mobile-first

Type-safe

Simple architecture

Reusable components

SEO-friendly

Fast loading

Accessible

Easy to modify
```

過剰な抽象化は避ける。

MVP段階では保守しやすさを優先する。

---

# 10. 想定ディレクトリ構成

```text
src/
├─ app/
│  ├─ page.tsx
│  │
│  ├─ quiz/
│  │  └─ page.tsx
│  │
│  ├─ result/
│  │  └─ page.tsx
│  │
│  ├─ blood-type/
│  │  ├─ page.tsx
│  │  ├─ a/
│  │  ├─ b/
│  │  ├─ o/
│  │  └─ ab/
│  │
│  ├─ about/
│  │  └─ page.tsx
│  │
│  ├─ privacy/
│  │  └─ page.tsx
│  │
│  └─ api/
│     └─ results/
│        └─ route.ts
│
├─ components/
│  ├─ Header.tsx
│  ├─ Footer.tsx
│  ├─ Logo.tsx
│  ├─ PrimaryButton.tsx
│  ├─ QuizProgress.tsx
│  ├─ QuestionCard.tsx
│  ├─ AnswerOption.tsx
│  ├─ ResultHero.tsx
│  ├─ TraitCard.tsx
│  ├─ AxisBar.tsx
│  ├─ ReasonCard.tsx
│  ├─ SecondaryTypeCard.tsx
│  ├─ BloodTypeSelector.tsx
│  └─ ShareButtons.tsx
│
├─ lib/
│  ├─ quiz/
│  │  ├─ questions.ts
│  │  ├─ scoring.ts
│  │  ├─ bloodTypeProfiles.ts
│  │  ├─ subtypes.ts
│  │  ├─ resultCopy.ts
│  │  └─ versions.ts
│  │
│  ├─ supabase/
│  │  ├─ server.ts
│  │  └─ types.ts
│  │
│  └─ seo/
│     └─ metadata.ts
│
└─ types/
   └─ quiz.ts
```

必要に応じて変更可能だが、

```text
UI
診断ロジック
文章
DB
```

を分離すること。

---

# 11. 仕様ファイル

リポジトリルートに以下を配置する。

```text
PRODUCT_SPEC.md
QUIZ_LOGIC.md
RESULT_CONTENT.md
UI_SPEC.md
DATA_SPEC.md
SEO_SPEC.md
README.md
```

実装時は各仕様を参照する。

---

# 12. 診断構造

診断は16問4択。

質問内容は、

```text
QUIZ_LOGIC.md
```

および質問仕様を正とする。

回答ID：

```text
a
b
c
d
```

質問ID：

```text
q01
〜
q16
```

---

# 13. 診断の7軸

各回答から以下を算出する。

```text
planning
計画性

caution
慎重さ

social
社交性

cooperation
協調性

sensitivity
感受性

freedom
自由度

objectivity
客観性
```

各軸は最終的に、

```text
0〜100
```

へ正規化する。

計算方法は `QUIZ_LOGIC.md` を正とする。

---

# 14. 血液型判定

4タイプ：

```text
A
B
O
AB
```

ユーザーの7軸プロフィールと、

各血液型のプロトタイププロフィールとの距離を算出する。

結果：

```text
A型っぽさ 78
B型っぽさ 44
O型っぽさ 61
AB型っぽさ 67
```

のように表示する。

この数値は、

```text
実際にその血液型である確率
```

ではなく、

```text
本診断内における印象類似度
```

とする。

---

# 15. メイン・サブ血液型

最高スコア：

```text
primaryType
```

2位：

```text
secondaryType
```

例：

```text
primaryType = A
secondaryType = AB
```

画面：

```text
A型っぽ！

A型っぽさ 78%

隠れAB型っぽさも
67%
```

---

# 16. サブタイプ

12種類。

```text
A1 きっちり安心タイプ
A2 気配りサポータータイプ
A3 静かな慎重派タイプ

B1 好奇心爆発タイプ
B2 没頭クリエイタータイプ
B3 我が道タイプ

O1 親しみリアリストタイプ
O2 おおらかマイペースタイプ
O3 柔らかい頑固者タイプ

AB1 冷静アナリストタイプ
AB2 繊細マイワールドタイプ
AB3 バランサータイプ
```

ロジックは `QUIZ_LOGIC.md`。

文章は `RESULT_CONTENT.md`。

---

# 17. ユーザーフロー

```text
TOP
↓
診断説明
↓
Q1
↓
Q2
↓
...
↓
Q16
↓
分析演出
↓
結果
↓
実際の血液型
↓
答え合わせ
↓
共有
```

ログインは不要。

---

# 18. トップページ

URL：

```text
/
```

Hero：

```text
何型っぽ？

16問でわかる
血液型印象診断

あなたは周りから
何型っぽく見られそう？

[無料で診断する]

約2分
登録不要
```

SEO文章も配置する。

詳細は `UI_SPEC.md` と `SEO_SPEC.md`。

---

# 19. 診断ページ

URL：

```text
/quiz
```

表示：

```text
Q 03 / 16

友達との待ち合わせ。
普段はどのくらいに着く？

[回答]
[回答]
[回答]
[回答]
```

回答を押すと次へ自動遷移。

「次へ」ボタンは使用しない。

前の質問へ戻れる。

---

# 20. 診断進捗

回答状況をlocalStorageへ保存する。

キー：

```text
nanigata_quiz_progress_v1
```

ページリロード時に回答を復元可能にする。

診断完了後は削除してよい。

---

# 21. 結果ページ

URL：

```text
/result
```

例：

```text
あなたは……

A型っぽ！

78%

きっちり安心タイプ

「ちゃんとしていて、
任せると安心な人」
```

以降：

```text
長所2つ
↓
弱点1つ
↓
7軸
↓
なぜこの結果？
↓
隠れ血液型
↓
本当の血液型
↓
答え合わせ
↓
共有
```

---

# 22. 結果理由

最大3回答を表示する。

例：

```text
こんな回答が結果につながりました

・旅行では予定を決めておきたい

・初めてのお店は口コミを調べる

・ミスしたら原因を振り返る
```

MVPではAI文章生成を使用しない。

固定テンプレートから生成する。

---

# 23. 実際の血液型

選択肢：

```text
A型
B型
O型
AB型
わからない
```

診断結果表示後にのみ聞く。

診断計算には絶対に利用しない。

---

# 24. 答え合わせ

一致：

```text
やっぱりA型！

予想：A型
実際：A型
```

不一致：

```text
予想はA型、実際はO型！

血液型は違いましたが、
あなたの日常行動からは
A型っぽい印象が強く出ました。
```

「正解」「不正解」「ハズレ」を過度に使わない。

---

# 25. シェア

対応：

```text
Web Share API

LINE

X

URLコピー
```

Web Share API対応端末ではネイティブ共有を優先してもよい。

---

# 26. シェアテキスト

基本：

```text
私、A型っぽさ78%でした！

「きっちり安心タイプ」
ちゃんとしていて、任せると安心な人らしい。

あなたは何型っぽい？

#何型っぽ
```

変数は `RESULT_CONTENT.md` に従う。

---

# 27. シェア画像

将来的またはMVPで可能なら、

```text
1200 × 1200
```

程度の正方形画像を生成する。

内容：

```text
何型っぽ？

A型っぽ！
78%

きっちり安心タイプ

ちゃんとしていて、
任せると安心な人
```

個人情報は表示しない。

実際の血液型も原則表示しない。

---

# 28. デザイン

デザイン方針：

```text
Pop
Friendly
Playful
Simple
Not childish
```

基本：

```text
白 / オフホワイト背景

大きな文字

丸いカード

丸いボタン

広めの余白

軽いアニメーション
```

---

# 29. 血液型カラー

```text
A
Coral / Pink
#FF7187

B
Yellow / Orange
#FFB72B

O
Sky Blue
#55B7F3

AB
Purple
#9A79E8
```

診断中はニュートラル。

結果画面でprimaryTypeカラーを強く使用する。

---

# 30. モバイル優先

診断最大幅：

```text
560px
```

結果：

```text
720px
```

記事：

```text
800px
```

PCでは中央配置。

---

# 31. アニメーション

回答時：

```text
tap
↓
少し縮む
↓
選択状態
↓
次質問
```

150〜250ms程度。

結果直前：

```text
見られ方を分析しています…
```

500ms〜2秒以内。

長い待機は作らない。

---

# 32. アクセシビリティ

最低限：

```text
本文16px以上

44px以上のタップ領域

十分なコントラスト

キーボード操作

focus表示

aria-label

prefers-reduced-motion
```

を対応する。

---

# 33. SEO

SEOコア：

```text
血液型診断
血液型 性格
A型 性格
B型 性格
O型 性格
AB型 性格
```

トップ：

```text
/
```

血液型ハブ：

```text
/blood-type
```

タイプ別：

```text
/blood-type/a
/blood-type/b
/blood-type/o
/blood-type/ab
```

---

# 34. noindex

以下：

```text
/quiz
/result
```

は、

```text
noindex
follow
```

とする。

---

# 35. SEO title

トップ：

```text
血液型診断｜16問でわかる「あなたは何型っぽい？」｜何型っぽ？
```

各タイプは `SEO_SPEC.md` に従う。

---

# 36. Sitemap

index対象ページを自動生成。

```text
/
 /blood-type
 /blood-type/a
 /blood-type/b
 /blood-type/o
 /blood-type/ab
 /about
 /privacy
```

---

# 37. 構造化データ

実装：

```text
WebSite
BreadcrumbList
```

必要に応じてArticle。

内容と構造化データは必ず一致させる。

---

# 38. データ保存

Supabase：

```text
quiz_results
```

保存対象：

```text
quizVersion

answers

axisScores

typeScores

primaryType

secondaryType

subtype

actualType

isMatch

createdAt
```

詳細は `DATA_SPEC.md`。

---

# 39. API

```text
POST /api/results
```

クライアントから送る：

```json
{
  "quizVersion": "1.0",
  "answers": {},
  "actualType": "O"
}
```

サーバー側で診断を再計算する。

クライアント計算結果は信用しない。

---

# 40. プライバシー

MVPでは取得しない：

```text
氏名

メールアドレス

電話番号

住所

正確な位置

SNS ID

広告ID

端末識別子
```

匿名回答のみ保存。

---

# 41. DB保存失敗

DB保存が失敗しても、

```text
結果表示
答え合わせ
共有
```

は利用できる。

診断成立とDB保存を依存させない。

---

# 42. プライバシー表示

実際の血液型入力付近：

```text
回答は匿名で集計し、
診断改善のために利用する場合があります。
```

Privacyページも用意する。

---

# 43. 科学的表現

本サービスは、

```text
血液型で性格が決まる
```

とは表現しない。

表示：

```text
この診断は、一般的に語られる
血液型イメージをもとにした
エンタメコンテンツです。

血液型と性格の科学的な関連性を
示すものではありません。
```

---

# 44. Analytics

MVPまたは公開直後に以下を計測可能にする。

```text
quiz_started

quiz_completed

actual_type_selected

share_clicked

share_x

share_line

link_copied

retry_clicked
```

特定個人を追跡する目的には使用しない。

---

# 45. KPI

初期KPI：

```text
トップ → 診断開始率

診断完了率

答え合わせ率

共有率

Organic流入

SEO流入 → 診断開始率
```

一致率は参考指標とする。

---

# 46. 将来的な診断改善

実際の血液型との回答傾向を分析。

例：

```text
実際のA型ユーザーの
Q1回答分布
```

十分な回答が集まった場合、

```text
血液型プロトタイプ
質問スコア
```

を調整できる。

変更時：

```text
quizVersion
```

を必ず更新。

---

# 47. テスト

最低限ユニットテストを実装する。

### 診断ロジック

```text
全回答から7軸を計算できる

各軸0〜100

typeScore 0〜100

primaryTypeが必ず存在

secondaryTypeが異なる

subtypeが正しい型に属する

actualTypeで診断結果が変わらない

同回答 → 同結果
```

### API

```text
16問不足 → エラー

不正回答 → エラー

不正actualType → エラー

正常データ → DB保存
```

---

# 48. E2E確認

最低限手動またはPlaywright等で確認。

```text
TOP
↓
診断
↓
16問
↓
結果
↓
actualType入力
↓
答え合わせ
↓
共有
```

375pxスマートフォン幅で必ず確認。

---

# 49. パフォーマンス

優先：

```text
初回表示を軽く

不要なライブラリを追加しない

画像を最適化

フォント数を抑える

不要なClient Componentを減らす

大きなJS bundleを避ける
```

診断ロジックは軽量に保つ。

---

# 50. エラー処理

`/result` へ直接アクセスし、回答が存在しない場合：

```text
診断結果が見つかりません。

もう一度診断してみよう！

[診断をはじめる]
```

---

# 51. 404

専用404ページを用意。

コピー例：

```text
このページ、何型だったっけ？

ページが見つかりませんでした。

[トップへ戻る]
```

サービスのトーンに合わせる。

---

# 52. 実装フェーズ

## Phase 1

プロジェクトセットアップ。

```text
Next.js
TypeScript
Tailwind
Lint
Testing
```

---

## Phase 2

診断ロジック。

```text
questions.ts

scoring.ts

profiles

subtypes

unit tests
```

まずUIから切り離して完成させる。

---

## Phase 3

診断UI。

```text
TOP

/quiz

progress

answers

localStorage
```

---

## Phase 4

結果UI。

```text
/result

ResultHero

7軸

理由

secondaryType
```

---

## Phase 5

答え合わせ・共有。

```text
actualType

match

share
```

---

## Phase 6

Supabase。

```text
migration

API

server validation

DB save
```

---

## Phase 7

SEOページ。

```text
/blood-type
A
B
O
AB
about
privacy
```

---

## Phase 8

SEO技術設定。

```text
metadata
canonical
sitemap
robots
JSON-LD
OGP
```

---

## Phase 9

QA。

```text
mobile
desktop
accessibility
SEO
logic
API
```

---

# 53. Codexへの実装指示

Codexは以下の順で仕様を読む。

```text
1. PRODUCT_SPEC.md

2. QUIZ_LOGIC.md

3. RESULT_CONTENT.md

4. UI_SPEC.md

5. DATA_SPEC.md

6. SEO_SPEC.md
```

仕様間で矛盾がある場合、

```text
PRODUCT_SPEC.md
```

を全体方針として扱う。

ただし詳細仕様については各専用SPECを優先する。

例：

```text
診断計算
→ QUIZ_LOGIC.md

文章
→ RESULT_CONTENT.md

画面
→ UI_SPEC.md

DB
→ DATA_SPEC.md

SEO
→ SEO_SPEC.md
```

---

# 54. Codexが勝手に変更してはいけないもの

以下は仕様として固定する。

```text
16問構成

7軸

A/B/O/ABの4タイプ

12サブタイプ

actualTypeを判定に使わない

エンタメ診断という位置づけ

ログインなし

モバイルファースト

匿名データ方針
```

改善提案がある場合でも、まず仕様どおり実装する。

---

# 55. Codexが裁量で決めてよいもの

以下は適切に判断可能。

```text
細かな余白

Tailwind class

コンポーネント粒度

ファイル名の微調整

レスポンシブの細部

アニメーション実装方法

内部utility

テスト構造
```

ただし既存仕様のUXを変えない。

---

# 56. コード品質

要求：

```text
TypeScript strict

anyを極力避ける

診断ロジックはpure function

UIとロジックを分離

意味のある命名

重複コードを避ける

不要な依存を追加しない
```

---

# 57. README

READMEには最低限以下を書く。

```text
プロジェクト概要

ローカル起動

環境変数

Supabase setup

Migration方法

Test実行

Build

Deploy

仕様ファイル一覧
```

---

# 58. 環境変数

例：

```text
NEXT_PUBLIC_SITE_URL

SUPABASE_URL

SUPABASE_SERVICE_ROLE_KEY
```

Service Role Keyはブラウザ側へ公開しない。

`.env.example` を用意する。

実際のsecretはコミットしない。

---

# 59. Definition of Done

MVP完成条件：

```text
□ TOPが表示される

□ 16問を回答できる

□ 戻って回答を変更できる

□ リロードで途中復元できる

□ 7軸が計算される

□ A/B/O/ABが判定される

□ サブタイプが判定される

□ 結果理由が表示される

□ secondaryTypeが表示される

□ 実際の血液型を選べる

□ 答え合わせが表示される

□ 匿名回答をDB保存できる

□ 保存失敗でも結果を見られる

□ X / LINE / URL共有ができる

□ モバイル表示が崩れない

□ /quiz noindex

□ /result noindex

□ SEOページが存在する

□ sitemap.xml

□ robots.txt

□ canonical

□ OGP

□ JSON-LD

□ Privacyページ

□ 診断免責表示

□ unit testが通る

□ production buildが通る
```

---

# 60. 最終的に作りたい体験

ユーザーが、

```text
「何これ、ちょっとやってみよう」
```

と思って診断を開始。

16問をテンポよく回答。

```text
「自分A型っぽいんだ」
```

という結果が出る。

説明を見ると、

```text
「あー、たしかに
こういうところあるかも」
```

と思える。

本当の血液型を入力すると、

```text
「実際O型なのにA型っぽいの面白い」
```

となる。

そして、

```text
「友達にも送ってみよう」
```

となる。

この一連の体験を、

**2〜3分程度で完了できること**

をMVPの最優先ゴールとする。