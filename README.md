# 水の事故から守る

川原・海水浴場・堤防の釣り場・プール・お風呂場・ため池と用水路の場面（作り話）から、水の事故につながる危ないところ（中州で遊ぶ・ライフジャケットなしで釣り・「ちょっとスマホを見てるね」の一言・上流の空に黒い雲 など）を見つけて押す、1日5場面の学習ゲームです。見つけると、なぜ危ないかと守り方が出ます。

- 遊ぶ: <https://satou-aaaaa.github.io/mizu-mamoru/>
- 時間制限なし。今日の5つ（だれでも同じ）・上級・練習・とことん（何度でも）・まもり帳・実績・カレンダー。
- 出てくる人・川・浜の名前はすべて作り話です。記録は遊ぶ人のブラウザ（localStorage）だけに置き、外へ送りません。

## 出典（危ないところと守り方のもと）

- 政府広報オンライン「水の事故を防ごう！海や川でレジャーを楽しむために知っておきたい安全対策」 <https://www.gov-online.go.jp/article/201608/entry-9827.html>
- 消費者庁「子どもの水の事故を防ごう！」 <https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_062/>

## 開発

```bash
bash scripts/setup.sh   # 最初に一度
node qa/run.mjs         # 検査（CI の QA と同じ）
```

決まりは [AGENTS.md](AGENTS.md)。
