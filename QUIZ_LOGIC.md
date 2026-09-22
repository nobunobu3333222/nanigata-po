# 何型っぽ？｜診断ロジック仕様

## 1. 診断の位置づけ

本診断は、血液型と性格の科学的因果関係を判定するものではない。

16問の日常行動への回答から性格傾向を算出し、一般的に語られる血液型イメージのうち、どのタイプに最も近いかを「○型っぽさ」として表示するエンタメ診断とする。

実際の血液型は診断終了後に入力させ、判定には一切使用しない。

---

# 2. 性格7軸

| ID | 日本語 | 意味 |
|---|---|---|
| planning | 計画性 | 事前に準備・整理して行動する |
| caution | 慎重さ | 確認や比較をしてから判断する |
| social | 社交性 | 自分から他人と関わる |
| cooperation | 協調性 | 周囲や相手を意識して行動する |
| sensitivity | 感受性 | 人の反応や出来事を強く受け取る |
| freedom | 自由度 | 直感・気分・自分の感覚で動く |
| objectivity | 客観性 | 感情から距離を取り状況を判断する |

内部では各回答に -2〜+2 の加点を行い、最終的に各軸を0〜100へ正規化する。

---

# 3. 質問別スコア

未記載の軸は `0` とする。

## Q01 旅行の予定

A「行く場所や時間まで、ある程度決めておきたい」

```text
planning +2
caution +1
```

B「行きたい場所だけ決めて、あとは現地で考える」

```text
planning +1
freedom +1
```

C「あまり決めず、その日の気分で動きたい」

```text
planning -1
freedom +2
```

D「一緒に行く人の希望に合わせることが多い」

```text
cooperation +2
```

## Q02 初めてのお店

A「口コミやメニューまでしっかり調べる」

```text
planning +1
caution +2
```

B「評価や写真を軽く見て決める」

```text
caution +1
```

C「雰囲気が良さそうなら入ってみる」

```text
caution -1
freedom +2
```

D「一緒にいる人が行きたい店にする」

```text
cooperation +2
```

## Q03 待ち合わせ

A「10分以上前に着くことが多い」

```text
planning +2
caution +1
```

B「だいたい時間通りに着く」

```text
planning +1
```

C「ギリギリになることが多い」

```text
planning -1
freedom +1
```

D「相手や予定によってかなり変わる」

```text
cooperation +1
freedom +1
```

## Q04 LINEの返信

A「気づいたらなるべく早く返す」

```text
cooperation +1
sensitivity +1
```

B「落ち着いて返信できるときに返す」

```text
objectivity +1
```

C「何件かまとめて返すことが多い」

```text
freedom +1
objectivity +1
```

D「後で返そうと思って忘れることもある」

```text
caution -1
freedom +2
```

## Q05 予定がなくなった休日

A「代わりに何をするか考える」

```text
planning +2
```

B「せっかくなので家でゆっくりする」

```text
objectivity +1
```

C「とりあえず外に出てから考える」

```text
freedom +2
```

D「空いていそうな友達を誘う」

```text
social +2
```

## Q06 メニュー選び

A「気に入った定番メニューを選びがち」

```text
caution +1
```

B「お店の人気メニューを選びがち」

```text
caution +1
cooperation +1
```

C「食べたことのないものを試したくなる」

```text
freedom +2
```

D「どれにするか結構迷う」

```text
caution +2
sensitivity +1
```

## Q07 部屋の片付け

A「普段からなるべく片付けている」

```text
planning +2
caution +1
```

B「少し散らかってきたら片付ける」

```text
planning +1
```

C「かなり散らかってから一気に片付ける」

```text
planning -1
freedom +2
```

D「人が来るときに一気に片付けることが多い」

```text
cooperation +1
sensitivity +1
```

## Q08 友達が落ち込んでいる

A「何かあった？と自分から聞く」

```text
social +1
sensitivity +1
```

B「あえて深く聞かず、そばにいる」

```text
cooperation +2
sensitivity +1
```

C「ご飯や遊びに誘って気分転換してもらう」

```text
social +2
freedom +1
```

D「相手から話してくれるまで待つ」

```text
caution +1
cooperation +2
```

## Q09 SNSへの投稿

A「内容や見え方をある程度考えてから投稿する」

```text
caution +2
sensitivity +1
```

B「良い写真や出来事があったら投稿する」

```text
social +1
```

C「思ったことをそのまま投稿することが多い」

```text
social +1
freedom +2
```

D「自分から投稿するより見る方が多い」

```text
social -1
caution +1
```

## Q10 ミスしたとき

A「何が原因だったのか振り返る」

```text
caution +2
objectivity +1
```

B「次に同じことをしないよう気をつける」

```text
planning +1
objectivity +1
```

C「しばらく『あれ失敗したな…』と引きずる」

```text
sensitivity +2
```

D「済んだことなので比較的すぐ切り替える」

```text
sensitivity -1
freedom +1
```

## Q11 街で知り合いを発見

A「自分から声をかける」

```text
social +2
```

B「目が合ったら挨拶する」

```text
social +1
cooperation +1
```

C「相手から声をかけられたら話す」

```text
cooperation +1
```

D「状況によっては、そのまま通り過ぎる」

```text
social -1
freedom +1
```

## Q12 鍵を閉めたか心配

A「気になるので戻って確認する」

```text
caution +2
sensitivity +1
```

B「家を出たときのことを思い出して判断する」

```text
caution +1
objectivity +1
```

C「たぶん閉めたと思って、そのまま行く」

```text
caution -1
freedom +2
```

D「確認できる仕組みがあれば、それでチェックする」

```text
planning +1
caution +2
```

## Q13 自分だけ違う意見

A「みんなの意見に合わせることが多い」

```text
cooperation +2
```

B「みんなの理由を聞いてから、もう一度考える」

```text
cooperation +1
objectivity +2
```

C「自分が納得しているなら、意見は変えない」

```text
cooperation -1
freedom +1
objectivity +1
```

D「どちらの考え方もありそう、と考える」

```text
sensitivity +1
objectivity +2
```

## Q14 新しい趣味

A「まずいろいろ調べて詳しくなる」

```text
planning +1
caution +1
```

B「欲しい道具やアイテムを一気に揃えたくなる」

```text
caution -1
freedom +2
```

C「暇があればずっとそのことをやっている」

```text
sensitivity +1
freedom +1
```

D「かなりハマるけれど、突然別のものに興味が移ることもある」

```text
planning -1
freedom +2
```

## Q15 「やめた方がいい」と言われたら

A「一度立ち止まって考え直す」

```text
caution +2
objectivity +1
```

B「どうしてそう思うのか理由を聞く」

```text
objectivity +2
```

C「自分が納得できなければ、そのまま進める」

```text
cooperation -1
freedom +1
objectivity +1
```

D「とりあえずやってみてから判断する」

```text
caution -1
freedom +2
```

## Q16 大人数で過ごしたあと

A「まだまだ誰かと話していたい」

```text
social +2
```

B「楽しかったけれど、少し一人になりたい」

```text
social +1
sensitivity +1
```

C「結構疲れるので、一人でゆっくりしたい」

```text
social -1
sensitivity +2
```

D「大人数より、最初から気の合う少人数の方が好き」

```text
social -1
freedom +1
```

---

# 4. 7軸の正規化

各軸の生スコアは質問ごとの加点合計。

0〜100への変換時に、最大値・最小値を手入力しない。

質問データから各軸について理論上の最低値・最高値を自動計算する。

```text
axisMin =
各質問について、その軸の4選択肢中の最低値を合計

axisMax =
各質問について、その軸の4選択肢中の最高値を合計
```

ユーザーの値は以下で正規化する。

```text
normalized =
(rawScore - axisMin)
/
(axisMax - axisMin)
* 100
```

最終値は `0〜100` に clamp し、整数へ四捨五入する。

この方式にすることで、将来質問を追加・変更しても正規化ロジックを書き換える必要がない。

---

# 5. 血液型プロトタイプ

診断では「どの血液型の典型プロフィールに近いか」を比較する。

初期MVPでは以下をプロトタイプ値とする。

| 軸 | A | B | O | AB |
|---|---:|---:|---:|---:|
| 計画性 | 85 | 35 | 55 | 55 |
| 慎重さ | 90 | 30 | 50 | 65 |
| 社交性 | 45 | 55 | 75 | 35 |
| 協調性 | 85 | 35 | 60 | 55 |
| 感受性 | 70 | 50 | 40 | 75 |
| 自由度 | 25 | 90 | 60 | 65 |
| 客観性 | 55 | 40 | 80 | 90 |

これは科学的な血液型性格分類ではなく、本サービス内のエンタメ上の初期仮説である。

将来、実データから更新可能な設定値として実装する。

---

# 6. 「○型っぽさ」の計算

各血液型について、ユーザーの7軸とプロトタイプとの差を計算する。

```text
distance =
(
|user.planning - type.planning|
+ |user.caution - type.caution|
+ |user.social - type.social|
+ |user.cooperation - type.cooperation|
+ |user.sensitivity - type.sensitivity|
+ |user.freedom - type.freedom|
+ |user.objectivity - type.objectivity|
)
/
7
```

その後、

```text
typeScore = 100 - distance
```

とする。

`typeScore` は0〜100へ clamp し、整数に丸める。

例：

```text
A型っぽさ 78%
AB型っぽさ 67%
O型っぽさ 59%
B型っぽさ 43%
```

重要：

この数値は「その血液型である確率」ではない。

画面上では、

**「A型っぽさ 78%」**

と表現し、小さく

**「※血液型を予測する確率ではなく、本診断内での印象類似度です」**

と表示する。

4タイプの数値は合計100になる必要はない。

---

# 7. メインタイプ・隠れタイプ

最も `typeScore` が高いものを、

```text
primaryType
```

とする。

2位を、

```text
secondaryType
```

とする。

画面では、

```text
あなたはA型っぽ！
A型っぽさ 78%

隠れAB型 67%
```

のように表示可能。

ただし1位と2位との差が2ポイント未満の場合は、

```text
A型 × AB型のミックスタイプ
```

のような表現を将来的に追加できる設計にしておく。

MVPでは1位を必ずメインタイプとして扱う。

---

# 8. サブタイプ判定

各血液型につき3種類、合計12種類。

primaryType決定後、その血液型内でサブタイプスコアを計算する。

各式は0〜100の軸を使用する。

## A型

### A1 きっちり安心タイプ

```text
score =
(planning + caution) / 2
```

### A2 気配りサポータータイプ

```text
score =
(cooperation + sensitivity) / 2
```

### A3 静かな慎重派タイプ

```text
score =
(caution + sensitivity + (100 - social)) / 3
```

最高値を採用。

---

## B型

### B1 好奇心爆発タイプ

```text
score =
(freedom + (100 - caution)) / 2
```

### B2 没頭クリエイタータイプ

```text
score =
(freedom + sensitivity) / 2
```

### B3 我が道タイプ

```text
score =
(freedom + (100 - cooperation)) / 2
```

最高値を採用。

---

## O型

### O1 親しみリアリストタイプ

```text
score =
(social + objectivity) / 2
```

### O2 おおらかマイペースタイプ

```text
score =
(social + freedom + (100 - caution)) / 3
```

### O3 柔らかい頑固者タイプ

```text
score =
(objectivity + cooperation + freedom) / 3
```

最高値を採用。

---

## AB型

### AB1 冷静アナリストタイプ

```text
score =
(objectivity + caution) / 2
```

### AB2 繊細マイワールドタイプ

```text
score =
(sensitivity + freedom + (100 - social)) / 3
```

### AB3 バランサータイプ

```text
score =
(objectivity + cooperation + freedom) / 3
```

最高値を採用。

---

# 9. 同点処理

サブタイプで完全同点の場合は以下の順番を使用する。

```text
A: A1 → A2 → A3
B: B1 → B2 → B3
O: O1 → O2 → O3
AB: AB1 → AB2 → AB3
```

血液型スコアが完全同点の場合は、内部処理を安定させるため、

```text
A → B → O → AB
```

の順で決定する。

ただし同点や僅差は分析用データとして保存する。

---

# 10. 結果理由の生成

AIによる自由生成はMVPでは使用しない。

判定の再現性と品質を保つため、

```text
サブタイプ固定文章
+
特徴軸文章
+
回答由来文章
```

の組み合わせで生成する。

例：

```text
あなたは「きっちり安心タイプ」。

予定や確認を大切にする傾向が強く、
周りからは「ちゃんとしている人」と
見られやすそうです。

特に、
・旅行では予定を決めておきたい
・店選びでは事前に調べる
・ミスしたら原因を振り返る

といった回答が、
A型っぽい印象につながりました。
```

回答理由には、ユーザーが実際に選択した回答のみ使用する。

---

# 11. 実際の血液型入力

診断結果を表示した後にのみ、

```text
A
B
O
AB
わからない
```

から選択可能にする。

`actualType` は判定計算には絶対に使用しない。

入力後、

### 一致した場合

```text
予想：A型
実際：A型

やっぱりA型！

あなた自身の血液型と、
日常行動から受ける印象が一致しました。
```

### 外れた場合

```text
予想：A型
実際：O型

予想はA型、実際はO型！

血液型は違いましたが、
あなたは行動だけを見ると
「A型っぽい印象」を持たれやすいようです。
```

「正解」「不正解」を強く押し出さない。

サービスの価値は、血液型を当てることだけではなく、

**「自分がどう見られそうかを知ること」**

に置く。

---

# 12. 保存データ

MVPでは匿名で以下を保存する。

```json
{
  "quizVersion": "1.0",
  "answers": {
    "q01": "a",
    "q02": "c"
  },
  "axisScores": {
    "planning": 78,
    "caution": 84,
    "social": 52,
    "cooperation": 71,
    "sensitivity": 63,
    "freedom": 38,
    "objectivity": 66
  },
  "typeScores": {
    "A": 78,
    "B": 44,
    "O": 61,
    "AB": 67
  },
  "primaryType": "A",
  "secondaryType": "AB",
  "subtype": "A1",
  "actualType": "O",
  "createdAt": "timestamp"
}
```

氏名、メールアドレス等の個人情報はMVPでは取得しない。

---

# 13. 将来的なロジック改善

実際の血液型入力データが十分に蓄積した場合、

```text
実際にA型の人はどの回答を選んだか
実際にB型の人はどの回答を選んだか
...
```

を匿名集計する。

初期プロトタイプ値を永久固定せず、

```text
人間が設定した初期モデル
↓
回答データを分析
↓
プロトタイプ・質問重みを調整
↓
quizVersionを更新
```

という運用を想定する。

ロジック変更時は必ず `quizVersion` を更新し、旧バージョンの回答と混同しない。

---

# 14. 実装上の重要ルール

質問データ・配点・血液型プロトタイプ・サブタイプ判定条件・結果文章は、UIコンポーネントへ直接ハードコードしない。

以下を分離する。

```text
questions.ts
scoring.ts
bloodTypeProfiles.ts
subtypes.ts
resultCopy.ts
```

これにより質問や係数を後から変更しても、UIコードへの影響を最小化する。

実際の血液型は診断終了前には取得しない。

回答途中でページをリロードした場合は、可能であればlocalStorageで進捗を復元する。

診断完了後は全16問の回答が揃っていることを確認してからスコア計算を行う。

---

# 15. テスト要件

最低限、以下を自動テストする。

- 16問すべて回答すると7軸が0〜100になる
- 7軸が100を超えない
- 7軸が0未満にならない
- 4タイプすべて0〜100になる
- primaryTypeが必ず1つ決まる
- secondaryTypeがprimaryTypeと異なる
- subtypeがprimaryTypeに属する
- actualTypeを変更しても診断結果が変わらない
- 同じ回答なら常に同じ結果になる
- 質問データ変更時も正規化が壊れない

---

## MVPでの最終処理フロー

```text
16問回答
↓
生スコア集計
↓
7軸を0〜100へ正規化
↓
A/B/O/ABプロトタイプとの距離を計算
↓
4つの「っぽさ指数」を算出
↓
primaryType / secondaryType決定
↓
primaryType内のサブタイプ判定
↓
結果表示
↓
実際の血液型入力
↓
予想と実際のギャップ表示
↓
匿名データ保存
↓
SNSシェア
```