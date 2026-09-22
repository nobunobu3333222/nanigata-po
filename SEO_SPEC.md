# 何型っぽ？｜SEO仕様

## 1. SEOの目的

本サイトのSEO目的は、

「血液型について調べている人」

を検索から集め、

「何型っぽ？診断」

へ誘導することである。

基本導線：

```text
Google検索
↓
血液型診断 / 血液型性格ページ
↓
何型っぽ？を知る
↓
診断開始
↓
結果表示
↓
SNS共有
↓
新規流入
```

SEOだけで完結させず、

**SEO流入 → 診断 → SNS拡散**

の循環を作ることを目標とする。

---

# 2. サイトブランド

サイト名：

```text
何型っぽ？
```

説明名：

```text
血液型印象診断
```

ブランド表記はサイト全体で、

```text
何型っぽ？
```

に統一する。

SEOキーワードをサイト名そのものに詰め込まない。

---

# 3. コアSEOコンセプト

一般的な血液型サイト：

```text
A型だから
あなたはこういう性格
```

本サービス：

```text
あなたの行動を見ると
何型っぽく見える？
```

という逆向きの診断で差別化する。

SEOでは既存需要である、

```text
血液型診断
血液型 性格
A型 性格
B型 性格
O型 性格
AB型 性格
```

を入り口にしながら、

```text
何型っぽい
血液型 当てる
何型に見える
```

という独自領域へ誘導する。

---

# 4. 初期キーワード群

検索ボリューム値は固定仕様に含めない。

公開後にGoogle Search Console等の実績データから優先順位を調整する。

## Core

```text
血液型診断
血液型 診断
血液型 性格診断
血液型 性格
血液型 特徴
```

## 診断意図

```text
血液型 当てる
血液型 当てる 診断
血液型を当てる
何型っぽい
何型に見える
血液型 何型っぽい
血液型 テスト
血液型 チェック
```

## A型

```text
A型 性格
A型 特徴
A型っぽい
A型っぽい人
A型 性格 特徴
A型 あるある
```

## B型

```text
B型 性格
B型 特徴
B型っぽい
B型っぽい人
B型 性格 特徴
B型 あるある
```

## O型

```text
O型 性格
O型 特徴
O型っぽい
O型っぽい人
O型 性格 特徴
O型 あるある
```

## AB型

```text
AB型 性格
AB型 特徴
AB型っぽい
AB型っぽい人
AB型 性格 特徴
AB型 あるある
```

---

# 5. MVPのSEOページ構成

初期公開時は最低限以下を作る。

```text
/
├─ /quiz
├─ /result
├─ /blood-type
│
├─ /blood-type/a
├─ /blood-type/b
├─ /blood-type/o
├─ /blood-type/ab
│
├─ /about
└─ /privacy
```

インデックス対象：

```text
/
 /blood-type
 /blood-type/a
 /blood-type/b
 /blood-type/o
 /blood-type/ab
 /about
```

原則noindex：

```text
/quiz
/result
```

プライバシーポリシーはインデックスされても問題ないが、SEO流入ページとして扱わない。

---

# 6. トップページの検索テーマ

URL：

```text
/
```

Primary keyword：

```text
血液型診断
```

Secondary：

```text
血液型 性格診断
何型っぽい
血液型 当てる
```

---

# 7. トップページ title

推奨：

```text
血液型診断｜16問でわかる「あなたは何型っぽい？」｜何型っぽ？
```

必要に応じて短縮：

```text
血液型診断｜あなたは何型っぽい？｜何型っぽ？
```

キーワードを機械的に羅列しない。

---

# 8. トップページ meta description

案：

```text
16問の日常行動から、あなたがA型・B型・O型・AB型のどれに見られやすいか診断。計画性、慎重さ、社交性など7つの傾向から「何型っぽい？」を無料でチェックできます。
```

目安として自然な文章を優先する。

文字数を機械的に合わせることを目的にしない。

---

# 9. トップページ H1

```text
16問でわかる
あなたは何型っぽい？
```

その近くに、

```text
血液型印象診断
```

を表示する。

H1を複数設置する必要はない。

---

# 10. トップページ本文

診断UIだけではなく、検索エンジンとユーザー双方が内容を理解できる説明文をHTMLとして配置する。

最低限以下を含む。

## H2

```text
何型っぽ？とは？
```

本文：

```text
「何型っぽ？」は、16問の日常行動から
あなたがA型・B型・O型・AB型の
どれに見られやすいかをチェックする
血液型印象診断です。
```

## H2

```text
どんなことがわかる？
```

## H2

```text
診断の流れ
```

## H2

```text
A型・B型・O型・AB型の特徴
```

4タイプへの内部リンクを置く。

---

# 11. 血液型ハブページ

URL：

```text
/blood-type
```

title：

```text
血液型別の性格・特徴まとめ｜A型・B型・O型・AB型｜何型っぽ？
```

H1：

```text
A型・B型・O型・AB型
血液型別の性格・特徴
```

役割：

```text
血液型 性格
血液型 特徴
```

の検索需要を受けるピラーページ。

---

# 12. ハブページ構成

## H2

```text
血液型ごとのイメージを比較
```

表：

```text
A型
慎重・計画的・気配り

B型
自由・好奇心・自分軸

O型
おおらか・現実的・芯が強い

AB型
冷静・繊細・独自性
```

## H2

```text
A型っぽい人
```

→ `/blood-type/a`

## H2

```text
B型っぽい人
```

→ `/blood-type/b`

以下同様。

ページ上部・中部・下部に、

```text
自分は何型っぽい？
16問で診断する
```

CTAを配置する。

---

# 13. A型ページ

URL：

```text
/blood-type/a
```

Primary：

```text
A型 性格
```

Secondary：

```text
A型 特徴
A型っぽい
A型っぽい人
A型 あるある
```

title：

```text
A型っぽい人の性格・特徴とは？慎重・気配り・計画性｜何型っぽ？
```

H1：

```text
A型っぽい人の性格・特徴とは？
```

---

# 14. A型ページ構成

```text
H1 A型っぽい人の性格・特徴とは？

導入

H2 A型っぽい人に見られやすい特徴

H3 慎重に行動する
H3 事前に準備する
H3 周囲への気配りを大切にする

H2 A型っぽい人の長所

H2 A型っぽい人が誤解されやすいところ

H2 日常ではこんな行動に出やすい

H2 あなたはA型っぽい？

CTA
「16問で何型っぽいか診断する」

H2 血液型と性格について

免責・科学的説明
```

---

# 15. B型ページ

URL：

```text
/blood-type/b
```

title：

```text
B型っぽい人の性格・特徴とは？自由・好奇心・自分軸｜何型っぽ？
```

H1：

```text
B型っぽい人の性格・特徴とは？
```

重点テーマ：

```text
自由度
好奇心
没頭
行動力
自分軸
マイペース
```

---

# 16. O型ページ

URL：

```text
/blood-type/o
```

title：

```text
O型っぽい人の性格・特徴とは？おおらか・現実的・芯の強さ｜何型っぽ？
```

H1：

```text
O型っぽい人の性格・特徴とは？
```

重点テーマ：

```text
おおらか
社交性
現実的
聞き上手
芯が強い
意外と頑固
```

---

# 17. AB型ページ

URL：

```text
/blood-type/ab
```

title：

```text
AB型っぽい人の性格・特徴とは？冷静・繊細・独自性｜何型っぽ？
```

H1：

```text
AB型っぽい人の性格・特徴とは？
```

重点テーマ：

```text
客観性
冷静
繊細
柔軟
独自性
距離感
```

---

# 18. 各血液型ページ共通CTA

上部：

```text
あなたは本当に○型っぽい？

16問の日常行動からチェック
[無料で診断する]
```

中部：

```text
ここまで読んで
「自分は違うかも」と思ったら？

何型っぽいか診断してみる
```

下部：

```text
あなたは何型っぽく見える？

[16問で診断する]
```

同じ文言を過剰に繰り返さず、自然に変更する。

---

# 19. 診断ページSEO

URL：

```text
/quiz
```

診断ページ自体は検索ランディングページとして使わない。

設定：

```text
robots:
noindex, follow
```

理由：

トップページのSEO評価と役割を分散させず、診断UIに集中させるため。

---

# 20. 結果ページSEO

URL：

```text
/result
```

設定：

```text
noindex, follow
```

個人ごとの診断結果を検索インデックスさせない。

URLパラメータ等で、

```text
/result?type=A
/result?id=xxxxx
```

などが生成されても原則noindex。

---

# 21. シェア用URL

SNS共有では可能であれば、

```text
https://domain.example/
```

または専用LPを共有する。

診断結果そのものをURLに大量のパラメータとして埋め込まない。

将来的に共有結果ページを作る場合でも、

```text
noindex
```

を基本とする。

---

# 22. 内部リンク

すべての主要SEOページから診断へリンクする。

また、

```text
/blood-type
↓
A / B / O / AB

A / B / O / AB
↓
/blood-type
```

と相互にリンクする。

例：

A型ページ下部：

```text
他の血液型を見る

B型っぽい人の特徴
O型っぽい人の特徴
AB型っぽい人の特徴
```

クロール可能な通常の `<a href>` を使用する。

---

# 23. パンくず

血液型ページでは表示する。

例：

```text
何型っぽ？
>
血液型の性格・特徴
>
A型
```

構造化データでも、

```text
BreadcrumbList
```

を設定可能。

---

# 24. canonical

すべてのindex対象ページに自己参照canonicalを設定する。

例：

```html
<link
  rel="canonical"
  href="https://DOMAIN/blood-type/a"
/>
```

不要なURLパラメータが存在しても、正規URLを明確にする。

---

# 25. sitemap.xml

Next.jsで自動生成する。

含める：

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

含めない：

```text
/quiz
/result
/api/*
```

---

# 26. robots.txt

最低限：

```text
User-agent: *
Allow: /

Sitemap: https://DOMAIN/sitemap.xml
```

`/result` や `/quiz` をrobots.txtでDisallowしない。

noindexページはGoogleがページをクロールしてnoindexを確認できる状態にする。

API等、検索対象外の技術URLのみ必要に応じて制御する。

---

# 27. WebSite構造化データ

ホームページにJSON-LDで設定する。

例：

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "何型っぽ？",
  "alternateName": "血液型印象診断 何型っぽ？",
  "url": "https://DOMAIN/"
}
```

`DOMAIN` は本番ドメインへ置換する。

---

# 28. BreadcrumbList

各血液型ページに設定。

A型例：

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "何型っぽ？",
      "item": "https://DOMAIN/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "血液型の性格・特徴",
      "item": "https://DOMAIN/blood-type"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "A型っぽい人の特徴"
    }
  ]
}
```

---

# 29. Article構造化データ

血液型解説ページが十分に記事コンテンツとして成立する場合は、

```text
Article
```

または

```text
BlogPosting
```

の利用を検討できる。

ただし構造化データを入れること自体をランキング施策として扱わない。

ページ内容とマークアップを一致させる。

---

# 30. FAQ

ページ内にユーザーに役立つFAQを置くこと自体は可能。

例：

```text
血液型で性格は決まる？
この診断はどうやって判定している？
実際の血液型が違ってもいい？
```

ただし、

```text
FAQPage構造化データ
=
検索結果でFAQ表示される
```

ことを期待しない。

FAQはユーザー理解のために設置する。

---

# 31. OGP

全ページに以下を設定。

```text
og:title
og:description
og:url
og:site_name
og:type
og:image
```

サイト名：

```text
何型っぽ？
```

---

# 32. トップOGP

タイトル：

```text
あなたは何型っぽい？｜血液型印象診断
```

description：

```text
16問の日常行動から、あなたがA型・B型・O型・AB型のどれに見られやすいか診断。
```

画像：

```text
1200 × 630
```

推奨。

---

# 33. 血液型ページOGP

例：

A型

```text
A型っぽい人の特徴とは？
慎重・計画的・気配り上手？
```

A型テーマカラーの画像を生成。

B/O/ABも同様。

---

# 34. favicon

ポップで視認性の高いものを使用する。

候補：

```text
「？」
```

または

```text
「型？」
```

など。

小サイズでも識別できるデザインにする。

---

# 35. semantic HTML

SEO用本文は、

```text
main
article
section
h1
h2
h3
p
ul
a
```

等の通常HTMLとして出力する。

検索対象の重要本文を、

```text
canvas
画像
CSS pseudo-elementのみ
```

で表現しない。

---

# 36. Next.js Rendering

SEO対象ページ：

```text
/
 /blood-type
 /blood-type/*
 /about
```

はSSRまたはSSGでHTML本文を生成する。

JS実行後でなければ本文が存在しない状態を避ける。

診断機能部分はClient Componentで問題ない。

---

# 37. metadata実装

Next.js Metadata APIを利用する。

ページごとに、

```text
title
description
alternates.canonical
openGraph
twitter
robots
```

を設定する。

全ページ同じmetadataを使い回さない。

---

# 38. robots metadata

トップ・SEO記事：

```text
index: true
follow: true
```

診断・結果：

```text
index: false
follow: true
```

---

# 39. URLルール

URLは短く固定する。

推奨：

```text
/blood-type
/blood-type/a
/blood-type/b
/blood-type/o
/blood-type/ab
```

避ける：

```text
/page?id=18293
/blood-type/a-type-personality-character-seikaku
```

公開後に頻繁にURLを変更しない。

---

# 40. コンテンツ品質

血液型ページを、

```text
A型は几帳面です。
B型は自由です。
```

だけの薄いページにしない。

各ページで、

```text
特徴
長所
誤解されやすいところ
日常行動
他タイプとの違い
診断への導線
科学的な位置づけ
```

まで扱う。

---

# 41. 血液型と性格の表現

SEO目的でも、

```text
A型だから絶対几帳面
```

などと断定しない。

基本：

```text
一般的には〜というイメージがあります

〜っぽく見られやすい特徴

本サイトではエンタメ上のイメージとして扱います
```

とする。

---

# 42. 科学的説明

全血液型ページおよびAboutページに、

```text
血液型と性格の科学的な関連性が
確立されているわけではありません。

本サービスは一般的に語られる
血液型イメージを使った
エンタメコンテンツです。
```

という趣旨を掲載する。

これはフッターだけに隠さず、本文内にも自然に入れる。

---

# 43. Aboutページ

URL：

```text
/about
```

title：

```text
「何型っぽ？」について｜血液型印象診断
```

内容：

```text
サービスのコンセプト

なぜ作ったのか

診断ロジックの考え方

7つの性格軸

血液型と性格の科学的な位置づけ

匿名データの活用
```

透明性を高めるページとする。

---

# 44. 公開時点では記事を増やしすぎない

まず、

```text
トップ
ハブ
A
B
O
AB
```

の6ページを高品質に作る。

20〜50記事をAIで一括生成して公開するような設計にはしない。

---

# 45. Phase 2候補コンテンツ

Search Consoleの検索クエリを確認した上で追加する。

候補：

```text
/a-type-like
「A型っぽいと言われる人の特徴」

/b-type-like
「B型っぽいと言われる人の特徴」

/o-type-like
「O型っぽいと言われる人の特徴」

/ab-type-like
「AB型っぽいと言われる人の特徴」
```

ただし既存の各血液型ページと検索意図がほぼ同じなら、別URLを作らず既存ページへ統合する。

---

# 46. Phase 2候補：比較コンテンツ

```text
A型とO型の違い
A型とB型の違い
B型とAB型の違い
```

など。

ただし機械的に全組み合わせを量産しない。

検索需要とユーザー価値が確認できるものだけ作る。

---

# 47. 将来的な独自コンテンツ

匿名回答が十分集まった場合、

```text
実際のA型回答者は
旅行をどのくらい計画する？

何型が一番
口コミをチェックする？

「実際の血液型」と
「何型っぽさ」はどのくらい一致する？
```

など、本サービス独自データを記事化できる。

これは将来的なSEOの大きな差別化要素とする。

ただしサンプルサイズや調査方法を明記する。

---

# 48. 初期コンテンツ戦略

優先順位：

```text
1. 血液型診断
2. A/B/O/AB 性格
3. ○型っぽい人
4. 血液型を当てる
5. 独自データコンテンツ
```

---

# 49. 回遊設計

例：

```text
「A型 性格」で流入
↓
A型ページを読む
↓
「本当にA型っぽい？」
↓
診断
↓
「実際はA型だけどO型判定」
↓
O型ページを見る
↓
SNS共有
```

検索ユーザーを一記事だけで終わらせない。

---

# 50. Core Web Vitalsを意識する

特にスマートフォンで、

```text
大きな画像を不必要に読み込まない
フォントを大量に読み込まない
アニメーションを増やしすぎない
レイアウトシフトを防ぐ
```

ことを重視する。

診断サイトなので軽さを優先する。

---

# 51. 画像

SEO記事では必要に応じて、

```text
A
B
O
AB
```

のオリジナル図解を使用する。

画像内だけに重要情報を書かず、同じ情報をHTML本文でも説明する。

altは内容を自然に説明する。

例：

```text
alt="A型っぽい人に見られやすい特徴"
```

キーワード詰め込みはしない。

---

# 52. Google Search Console

公開後すぐ設定する。

最低限確認：

```text
サイトマップ送信
インデックス状況
検索クエリ
表示回数
クリック数
CTR
平均掲載順位
```

月1回程度、

```text
どんな検索語から流入しているか
```

を確認する。

---

# 53. 最重要クエリの初期計測

Search Consoleで以下を追う。

```text
血液型診断
血液型 性格診断
何型っぽい
血液型 当てる

A型 性格
B型 性格
O型 性格
AB型 性格
```

想定外の検索クエリも必ず確認する。

そこからコンテンツ案を作る。

---

# 54. Analyticsイベントとの連携

SEOページについて、

```text
diagnosis_cta_clicked
```

を計測。

最低限、

```text
landing_page
CTA position
```

を判別できるようにする。

例：

```text
hero
middle
bottom
```

これにより、

```text
検索流入
↓
診断開始
```

のCVRを分析できる。

---

# 55. SEO KPI

検索順位だけをKPIにしない。

優先：

```text
Organic users

Search impressions

Organic CTR

SEO landing → quiz start rate

Quiz completion rate

Share rate
```

最終的には、

```text
検索で何人来たか
```

より、

```text
検索から来た人が
どれだけ診断・共有したか
```

を見る。

---

# 56. 初期目標ページ

公開時のSEO MVP：

```text
① /
血液型診断

② /blood-type
血液型 性格

③ /blood-type/a
A型 性格

④ /blood-type/b
B型 性格

⑤ /blood-type/o
O型 性格

⑥ /blood-type/ab
AB型 性格
```

まずこの6ページを完成させる。

---

# 57. SEO実装チェックリスト

Codexは公開前に以下を確認する。

```text
□ 全indexページに固有title
□ 全indexページに固有description
□ 各ページにH1がある
□ canonical設定
□ sitemap.xml生成
□ robots.txt生成
□ /quiz noindex
□ /result noindex
□ WebSite JSON-LD
□ BreadcrumbList
□ OGP設定
□ favicon設定
□ SEO本文がHTMLとして存在
□ 内部リンクが<a href>で存在
□ モバイル表示確認
□ 404ページ
□ HTTPS前提
```

---

# 58. サービス公開後の改善ループ

```text
公開
↓
Search Consoleで検索語収集
↓
流入があるキーワードを確認
↓
既存ページを改善
↓
必要なら新規ページ
↓
診断CTAのCVR確認
↓
改善
```

「想像したSEOキーワード」より、

**実際にGoogleから表示されている検索語**

を優先して改善する。

---

# 59. SEOでやらないこと

```text
キーワードの不自然な大量挿入

ほぼ同じ血液型ページの大量生成

検索ボリュームだけを狙った無関係記事

AI生成文章の大量公開

科学的根拠があるような誤解を招く表現

隠しテキスト

不自然な被リンク購入

結果ページの大量インデックス
```

---

# 60. SEOの最終方針

何型っぽ？は、

```text
「血液型診断」
という既存検索需要
```

から入り、

```text
「自分は何型っぽく見える？」
という独自体験
```

へ誘導する。

最終的には、

```text
検索
+
診断
+
独自回答データ
+
SNS共有
```

の4つを組み合わせることで、一般的な血液型解説サイトとの差別化を目指す。