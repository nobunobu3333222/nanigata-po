import type { Question } from "../../types/quiz";

// QUIZ_LOGIC.md §3: 文言・配点を転記。未記載軸は0。
export const QUESTIONS: readonly Question[] = [
  {
    "id": "q01",
    "title": "旅行の予定",
    "options": [
      {
        "id": "a",
        "text": "行く場所や時間まで、ある程度決めておきたい",
        "reasonText": "旅行の予定：行く場所や時間まで、ある程度決めておきたい",
        "scores": {
          "planning": 2,
          "caution": 1
        }
      },
      {
        "id": "b",
        "text": "行きたい場所だけ決めて、あとは現地で考える",
        "reasonText": "旅行の予定：行きたい場所だけ決めて、あとは現地で考える",
        "scores": {
          "planning": 1,
          "freedom": 1
        }
      },
      {
        "id": "c",
        "text": "あまり決めず、その日の気分で動きたい",
        "reasonText": "旅行の予定：あまり決めず、その日の気分で動きたい",
        "scores": {
          "planning": -1,
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "一緒に行く人の希望に合わせることが多い",
        "reasonText": "旅行の予定：一緒に行く人の希望に合わせることが多い",
        "scores": {
          "cooperation": 2
        }
      }
    ]
  },
  {
    "id": "q02",
    "title": "初めてのお店",
    "options": [
      {
        "id": "a",
        "text": "口コミやメニューまでしっかり調べる",
        "reasonText": "初めてのお店：口コミやメニューまでしっかり調べる",
        "scores": {
          "planning": 1,
          "caution": 2
        }
      },
      {
        "id": "b",
        "text": "評価や写真を軽く見て決める",
        "reasonText": "初めてのお店：評価や写真を軽く見て決める",
        "scores": {
          "caution": 1
        }
      },
      {
        "id": "c",
        "text": "雰囲気が良さそうなら入ってみる",
        "reasonText": "初めてのお店：雰囲気が良さそうなら入ってみる",
        "scores": {
          "caution": -1,
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "一緒にいる人が行きたい店にする",
        "reasonText": "初めてのお店：一緒にいる人が行きたい店にする",
        "scores": {
          "cooperation": 2
        }
      }
    ]
  },
  {
    "id": "q03",
    "title": "待ち合わせ",
    "options": [
      {
        "id": "a",
        "text": "10分以上前に着くことが多い",
        "reasonText": "待ち合わせ：10分以上前に着くことが多い",
        "scores": {
          "planning": 2,
          "caution": 1
        }
      },
      {
        "id": "b",
        "text": "だいたい時間通りに着く",
        "reasonText": "待ち合わせ：だいたい時間通りに着く",
        "scores": {
          "planning": 1
        }
      },
      {
        "id": "c",
        "text": "ギリギリになることが多い",
        "reasonText": "待ち合わせ：ギリギリになることが多い",
        "scores": {
          "planning": -1,
          "freedom": 1
        }
      },
      {
        "id": "d",
        "text": "相手や予定によってかなり変わる",
        "reasonText": "待ち合わせ：相手や予定によってかなり変わる",
        "scores": {
          "cooperation": 1,
          "freedom": 1
        }
      }
    ]
  },
  {
    "id": "q04",
    "title": "LINEの返信",
    "options": [
      {
        "id": "a",
        "text": "気づいたらなるべく早く返す",
        "reasonText": "LINEの返信：気づいたらなるべく早く返す",
        "scores": {
          "cooperation": 1,
          "sensitivity": 1
        }
      },
      {
        "id": "b",
        "text": "落ち着いて返信できるときに返す",
        "reasonText": "LINEの返信：落ち着いて返信できるときに返す",
        "scores": {
          "objectivity": 1
        }
      },
      {
        "id": "c",
        "text": "何件かまとめて返すことが多い",
        "reasonText": "LINEの返信：何件かまとめて返すことが多い",
        "scores": {
          "freedom": 1,
          "objectivity": 1
        }
      },
      {
        "id": "d",
        "text": "後で返そうと思って忘れることもある",
        "reasonText": "LINEの返信：後で返そうと思って忘れることもある",
        "scores": {
          "caution": -1,
          "freedom": 2
        }
      }
    ]
  },
  {
    "id": "q05",
    "title": "予定がなくなった休日",
    "options": [
      {
        "id": "a",
        "text": "代わりに何をするか考える",
        "reasonText": "予定がなくなった休日：代わりに何をするか考える",
        "scores": {
          "planning": 2
        }
      },
      {
        "id": "b",
        "text": "せっかくなので家でゆっくりする",
        "reasonText": "予定がなくなった休日：せっかくなので家でゆっくりする",
        "scores": {
          "objectivity": 1
        }
      },
      {
        "id": "c",
        "text": "とりあえず外に出てから考える",
        "reasonText": "予定がなくなった休日：とりあえず外に出てから考える",
        "scores": {
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "空いていそうな友達を誘う",
        "reasonText": "予定がなくなった休日：空いていそうな友達を誘う",
        "scores": {
          "social": 2
        }
      }
    ]
  },
  {
    "id": "q06",
    "title": "メニュー選び",
    "options": [
      {
        "id": "a",
        "text": "気に入った定番メニューを選びがち",
        "reasonText": "メニュー選び：気に入った定番メニューを選びがち",
        "scores": {
          "caution": 1
        }
      },
      {
        "id": "b",
        "text": "お店の人気メニューを選びがち",
        "reasonText": "メニュー選び：お店の人気メニューを選びがち",
        "scores": {
          "caution": 1,
          "cooperation": 1
        }
      },
      {
        "id": "c",
        "text": "食べたことのないものを試したくなる",
        "reasonText": "メニュー選び：食べたことのないものを試したくなる",
        "scores": {
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "どれにするか結構迷う",
        "reasonText": "メニュー選び：どれにするか結構迷う",
        "scores": {
          "caution": 2,
          "sensitivity": 1
        }
      }
    ]
  },
  {
    "id": "q07",
    "title": "部屋の片付け",
    "options": [
      {
        "id": "a",
        "text": "普段からなるべく片付けている",
        "reasonText": "部屋の片付け：普段からなるべく片付けている",
        "scores": {
          "planning": 2,
          "caution": 1
        }
      },
      {
        "id": "b",
        "text": "少し散らかってきたら片付ける",
        "reasonText": "部屋の片付け：少し散らかってきたら片付ける",
        "scores": {
          "planning": 1
        }
      },
      {
        "id": "c",
        "text": "かなり散らかってから一気に片付ける",
        "reasonText": "部屋の片付け：かなり散らかってから一気に片付ける",
        "scores": {
          "planning": -1,
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "人が来るときに一気に片付けることが多い",
        "reasonText": "部屋の片付け：人が来るときに一気に片付けることが多い",
        "scores": {
          "cooperation": 1,
          "sensitivity": 1
        }
      }
    ]
  },
  {
    "id": "q08",
    "title": "友達が落ち込んでいる",
    "options": [
      {
        "id": "a",
        "text": "何かあった？と自分から聞く",
        "reasonText": "友達が落ち込んでいる：何かあった？と自分から聞く",
        "scores": {
          "social": 1,
          "sensitivity": 1
        }
      },
      {
        "id": "b",
        "text": "あえて深く聞かず、そばにいる",
        "reasonText": "友達が落ち込んでいる：あえて深く聞かず、そばにいる",
        "scores": {
          "cooperation": 2,
          "sensitivity": 1
        }
      },
      {
        "id": "c",
        "text": "ご飯や遊びに誘って気分転換してもらう",
        "reasonText": "友達が落ち込んでいる：ご飯や遊びに誘って気分転換してもらう",
        "scores": {
          "social": 2,
          "freedom": 1
        }
      },
      {
        "id": "d",
        "text": "相手から話してくれるまで待つ",
        "reasonText": "友達が落ち込んでいる：相手から話してくれるまで待つ",
        "scores": {
          "caution": 1,
          "cooperation": 2
        }
      }
    ]
  },
  {
    "id": "q09",
    "title": "SNSへの投稿",
    "options": [
      {
        "id": "a",
        "text": "内容や見え方をある程度考えてから投稿する",
        "reasonText": "SNSへの投稿：内容や見え方をある程度考えてから投稿する",
        "scores": {
          "caution": 2,
          "sensitivity": 1
        }
      },
      {
        "id": "b",
        "text": "良い写真や出来事があったら投稿する",
        "reasonText": "SNSへの投稿：良い写真や出来事があったら投稿する",
        "scores": {
          "social": 1
        }
      },
      {
        "id": "c",
        "text": "思ったことをそのまま投稿することが多い",
        "reasonText": "SNSへの投稿：思ったことをそのまま投稿することが多い",
        "scores": {
          "social": 1,
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "自分から投稿するより見る方が多い",
        "reasonText": "SNSへの投稿：自分から投稿するより見る方が多い",
        "scores": {
          "social": -1,
          "caution": 1
        }
      }
    ]
  },
  {
    "id": "q10",
    "title": "ミスしたとき",
    "options": [
      {
        "id": "a",
        "text": "何が原因だったのか振り返る",
        "reasonText": "ミスしたとき：何が原因だったのか振り返る",
        "scores": {
          "caution": 2,
          "objectivity": 1
        }
      },
      {
        "id": "b",
        "text": "次に同じことをしないよう気をつける",
        "reasonText": "ミスしたとき：次に同じことをしないよう気をつける",
        "scores": {
          "planning": 1,
          "objectivity": 1
        }
      },
      {
        "id": "c",
        "text": "しばらく『あれ失敗したな…』と引きずる",
        "reasonText": "ミスしたとき：しばらく『あれ失敗したな…』と引きずる",
        "scores": {
          "sensitivity": 2
        }
      },
      {
        "id": "d",
        "text": "済んだことなので比較的すぐ切り替える",
        "reasonText": "ミスしたとき：済んだことなので比較的すぐ切り替える",
        "scores": {
          "sensitivity": -1,
          "freedom": 1
        }
      }
    ]
  },
  {
    "id": "q11",
    "title": "街で知り合いを発見",
    "options": [
      {
        "id": "a",
        "text": "自分から声をかける",
        "reasonText": "街で知り合いを発見：自分から声をかける",
        "scores": {
          "social": 2
        }
      },
      {
        "id": "b",
        "text": "目が合ったら挨拶する",
        "reasonText": "街で知り合いを発見：目が合ったら挨拶する",
        "scores": {
          "social": 1,
          "cooperation": 1
        }
      },
      {
        "id": "c",
        "text": "相手から声をかけられたら話す",
        "reasonText": "街で知り合いを発見：相手から声をかけられたら話す",
        "scores": {
          "cooperation": 1
        }
      },
      {
        "id": "d",
        "text": "状況によっては、そのまま通り過ぎる",
        "reasonText": "街で知り合いを発見：状況によっては、そのまま通り過ぎる",
        "scores": {
          "social": -1,
          "freedom": 1
        }
      }
    ]
  },
  {
    "id": "q12",
    "title": "鍵を閉めたか心配",
    "options": [
      {
        "id": "a",
        "text": "気になるので戻って確認する",
        "reasonText": "鍵を閉めたか心配：気になるので戻って確認する",
        "scores": {
          "caution": 2,
          "sensitivity": 1
        }
      },
      {
        "id": "b",
        "text": "家を出たときのことを思い出して判断する",
        "reasonText": "鍵を閉めたか心配：家を出たときのことを思い出して判断する",
        "scores": {
          "caution": 1,
          "objectivity": 1
        }
      },
      {
        "id": "c",
        "text": "たぶん閉めたと思って、そのまま行く",
        "reasonText": "鍵を閉めたか心配：たぶん閉めたと思って、そのまま行く",
        "scores": {
          "caution": -1,
          "freedom": 2
        }
      },
      {
        "id": "d",
        "text": "確認できる仕組みがあれば、それでチェックする",
        "reasonText": "鍵を閉めたか心配：確認できる仕組みがあれば、それでチェックする",
        "scores": {
          "planning": 1,
          "caution": 2
        }
      }
    ]
  },
  {
    "id": "q13",
    "title": "自分だけ違う意見",
    "options": [
      {
        "id": "a",
        "text": "みんなの意見に合わせることが多い",
        "reasonText": "自分だけ違う意見：みんなの意見に合わせることが多い",
        "scores": {
          "cooperation": 2
        }
      },
      {
        "id": "b",
        "text": "みんなの理由を聞いてから、もう一度考える",
        "reasonText": "自分だけ違う意見：みんなの理由を聞いてから、もう一度考える",
        "scores": {
          "cooperation": 1,
          "objectivity": 2
        }
      },
      {
        "id": "c",
        "text": "自分が納得しているなら、意見は変えない",
        "reasonText": "自分だけ違う意見：自分が納得しているなら、意見は変えない",
        "scores": {
          "cooperation": -1,
          "freedom": 1,
          "objectivity": 1
        }
      },
      {
        "id": "d",
        "text": "どちらの考え方もありそう、と考える",
        "reasonText": "自分だけ違う意見：どちらの考え方もありそう、と考える",
        "scores": {
          "sensitivity": 1,
          "objectivity": 2
        }
      }
    ]
  },
  {
    "id": "q14",
    "title": "新しい趣味",
    "options": [
      {
        "id": "a",
        "text": "まずいろいろ調べて詳しくなる",
        "reasonText": "新しい趣味：まずいろいろ調べて詳しくなる",
        "scores": {
          "planning": 1,
          "caution": 1
        }
      },
      {
        "id": "b",
        "text": "欲しい道具やアイテムを一気に揃えたくなる",
        "reasonText": "新しい趣味：欲しい道具やアイテムを一気に揃えたくなる",
        "scores": {
          "caution": -1,
          "freedom": 2
        }
      },
      {
        "id": "c",
        "text": "暇があればずっとそのことをやっている",
        "reasonText": "新しい趣味：暇があればずっとそのことをやっている",
        "scores": {
          "sensitivity": 1,
          "freedom": 1
        }
      },
      {
        "id": "d",
        "text": "かなりハマるけれど、突然別のものに興味が移ることもある",
        "reasonText": "新しい趣味：かなりハマるけれど、突然別のものに興味が移ることもある",
        "scores": {
          "planning": -1,
          "freedom": 2
        }
      }
    ]
  },
  {
    "id": "q15",
    "title": "「やめた方がいい」と言われたら",
    "options": [
      {
        "id": "a",
        "text": "一度立ち止まって考え直す",
        "reasonText": "「やめた方がいい」と言われたら：一度立ち止まって考え直す",
        "scores": {
          "caution": 2,
          "objectivity": 1
        }
      },
      {
        "id": "b",
        "text": "どうしてそう思うのか理由を聞く",
        "reasonText": "「やめた方がいい」と言われたら：どうしてそう思うのか理由を聞く",
        "scores": {
          "objectivity": 2
        }
      },
      {
        "id": "c",
        "text": "自分が納得できなければ、そのまま進める",
        "reasonText": "「やめた方がいい」と言われたら：自分が納得できなければ、そのまま進める",
        "scores": {
          "cooperation": -1,
          "freedom": 1,
          "objectivity": 1
        }
      },
      {
        "id": "d",
        "text": "とりあえずやってみてから判断する",
        "reasonText": "「やめた方がいい」と言われたら：とりあえずやってみてから判断する",
        "scores": {
          "caution": -1,
          "freedom": 2
        }
      }
    ]
  },
  {
    "id": "q16",
    "title": "大人数で過ごしたあと",
    "options": [
      {
        "id": "a",
        "text": "まだまだ誰かと話していたい",
        "reasonText": "大人数で過ごしたあと：まだまだ誰かと話していたい",
        "scores": {
          "social": 2
        }
      },
      {
        "id": "b",
        "text": "楽しかったけれど、少し一人になりたい",
        "reasonText": "大人数で過ごしたあと：楽しかったけれど、少し一人になりたい",
        "scores": {
          "social": 1,
          "sensitivity": 1
        }
      },
      {
        "id": "c",
        "text": "結構疲れるので、一人でゆっくりしたい",
        "reasonText": "大人数で過ごしたあと：結構疲れるので、一人でゆっくりしたい",
        "scores": {
          "social": -1,
          "sensitivity": 2
        }
      },
      {
        "id": "d",
        "text": "大人数より、最初から気の合う少人数の方が好き",
        "reasonText": "大人数で過ごしたあと：大人数より、最初から気の合う少人数の方が好き",
        "scores": {
          "social": -1,
          "freedom": 1
        }
      }
    ]
  }
];
