// 水の事故から守るの問題（架空の場面）を作る（ブラウザと node の両方で使う）。
// 1つの場面は「絵（場所と6つのようす）」「ことば（3つの一言）」「まわりのようす（空や水のようす1つ）」でできている。
// その中に、事故につながる危ないところ（risk）を決まった数だけまぜる。ほかは大丈夫なもの。
// 人・場所の名前はすべて作り話。乱数 R は呼ぶ回数が毎回同じになるように使う（sort の比較の中では引かない）。
// 同じ tag（"難しさ:場面|種"）なら、どの端末でも同じ場面になる。
(function (root) {
  "use strict";
  const LV = ["やさしい", "ふつう", "むずかしい", "上級"];

  // ---- 出典（遊び方・このゲームについて・危険帳に出す）。なぜ・どうするは、この2つに書いてあることだけで書く ----
  const SRC = {
    S1: { t: "政府広報オンライン「水の事故を防ごう！海や川でレジャーを楽しむために知っておきたい安全対策」", u: "https://www.gov-online.go.jp/article/201608/entry-9827.html" },
    S2: { t: "消費者庁「子どもの水の事故を防ごう！」", u: "https://www.caa.go.jp/policies/policy/consumer_safety/caution/caution_062/" },
  };

  // ---- 作り話の名前（実在の川・海岸をまねない）----
  const RIVERS = ["みどり川", "せせらぎ川", "しらさぎ川", "あゆみ川", "こはく川", "ささなみ川"];
  const BEACHES = ["しおかぜ浜", "なぎさ浜", "さざなみ浜", "あおば浜", "ひだまり浜"];
  const GIVEN = ["ゆう", "あおい", "ひかる", "まこと", "かなた", "みずき", "はる", "るい"];

  // ---- 危ないところ：名前・何の危なさか（cat）・なぜ・どうする・出典・見落としやすい（sub）・どこに出るか（kind）----
  // why は40字以内、fix は30字以内（やさしい日本語。QA が見る）
  const RISKS = {
    // 絵
    nakasu: { kind: "photo", sub: 0, cat: "増水", src: "S1", name: () => "中州で遊ぶ子ども", why: "中州は、増水すると逃げ道がなくなり、取り残される。", fix: "中州には渡らない。" },
    nojacket: { kind: "photo", sub: 0, cat: "ライフジャケット", src: "S1", name: () => "ライフジャケットなしで川遊び", why: "川や海では、ライフジャケットをいつも着るのが基本。", fix: "体に合うライフジャケットを着る。" },
    sandal: { kind: "photo", sub: 0, cat: "はきもの", src: "S2", name: () => "脱げやすいサンダル", why: "すべったり脱げたりして、転びやすい。", fix: "かかとのある、脱げにくいくつにする。" },
    kids: { kind: "photo", sub: 0, cat: "子どもだけ", src: "S2", name: () => "子どもだけで水辺に来ている", why: "子どもは、小さな波や流れにも足をすくわれる。", fix: "大人といっしょに来て、そばで見守る。" },
    bare: { kind: "photo", sub: 1, cat: "増水", src: "S1", name: () => "草の生えていない河原のテント", why: "草が無いのは、増水のときに水が流れている証。", fix: "水が来る河原にテントを張らない。" },
    kinshi: { kind: "photo", sub: 0, cat: "立入禁止", src: "S2", name: () => "遊泳禁止の看板の先で泳ぐ", why: "遊泳禁止の場所は、泳ぐと危ないと決められた所。", fix: "遊泳禁止の場所では泳がない。" },
    outzone: { kind: "photo", sub: 0, cat: "遊泳エリア", src: "S2", name: () => "ブイの外へ泳いでいく人", why: "監視員が見守る遊泳エリアの外に出てしまう。", fix: "ブイの内側の遊泳エリアで泳ぐ。" },
    beer: { kind: "photo", sub: 0, cat: "お酒", src: "S1", name: () => "お酒を飲んで海に入る大人", why: "飲酒して海水浴中の事故は、死亡率が約2倍。", fix: "お酒を飲んだら水に入らない。" },
    rip: { kind: "photo", sub: 1, cat: "離岸流", src: "S2", name: () => "堤防のすぐそばで泳ぐ人", why: "堤防ぞいや河口は、沖へ流れる離岸流が起きやすい。", fix: "堤防・河口・岩場の近くで泳がない。" },
    fishjacket: { kind: "photo", sub: 0, cat: "ライフジャケット", src: "S1", name: () => "ライフジャケットなしで釣り", why: "水の事故で亡くなる人は、魚とり・釣りの時が多い。", fix: "釣りでもライフジャケットを着る。" },
    peek: { kind: "photo", sub: 0, cat: "落ちる", src: "S2", name: () => "堤防の縁からのぞきこむ子ども", why: "身を乗り出すと、そのまま海に落ちるおそれ。", fix: "堤防の縁からのぞきこまない。" },
    dive: { kind: "photo", sub: 0, cat: "飛びこみ", src: "S2", name: () => "プールサイドから飛びこむ子ども", why: "飛びこみやジャンプは、重大な事故につながる。", fix: "足から静かに水に入る。" },
    drain: { kind: "photo", sub: 0, cat: "排水口", src: "S2", name: () => "排水口のそばで遊ぶ子ども", why: "排水口は、吸いこまれると危ない。", fix: "排水口には近づかない。" },
    under: { kind: "photo", sub: 1, cat: "もぐる", src: "S2", name: () => "浮き台の下にもぐる子ども", why: "台や遊具の下にもぐると、事故につながる。", fix: "台や遊具の下にもぐらない。" },
    bathkid: { kind: "photo", sub: 0, cat: "子どもだけ", src: "S2", name: () => "子どもだけで湯船に入っている", why: "0〜1歳の溺れる事故は、浴槽がいちばん多い。", fix: "子どもだけでお風呂に入らせない。" },
    ukiwa: { kind: "photo", sub: 1, cat: "子どもだけ", src: "S2", name: () => "浮き輪をつけて湯船にひとり", why: "浮き輪を使っていても、事故が起きている。", fix: "浮き輪があっても目を離さない。" },
    nokori: { kind: "photo", sub: 0, cat: "ためた水", src: "S2", name: () => "入浴後も水がたまった湯船", why: "小さい子は、少しの水でも溺れることがある。", fix: "入浴後は湯船の水を抜く。" },
    bucket: { kind: "photo", sub: 0, cat: "ためた水", src: "S2", name: () => "水をためたままのバケツ", why: "使ったあとの水も、子どもには危ない。", fix: "使ったら水を捨てておく。" },
    washer: { kind: "photo", sub: 1, cat: "ためた水", src: "S2", name: () => "ふたが開く洗濯機", why: "子どもが開けて、中の水に落ちるおそれ。", fix: "チャイルドロックでふたを閉める。" },
    door: { kind: "photo", sub: 1, cat: "子どもだけ", src: "S2", name: () => "開いたままの浴室の戸", why: "子どもだけで浴室に入れてしまう。", fix: "ベビーゲートなどで入れなくする。" },
    fence: { kind: "photo", sub: 0, cat: "立入禁止", src: "S2", name: () => "立入禁止の柵の中で釣り", why: "ため池の敷地に入り、落ちて亡くなる事故がある。", fix: "立入禁止の場所には入らない。" },
    canal: { kind: "photo", sub: 0, cat: "用水路", src: "S1", name: () => "用水路のふちで遊ぶ子ども", why: "水の事故で亡くなる人の1割ほどは用水路。", fix: "用水路のふちで遊ばない。" },
    // ことば
    alone: { kind: "text", sub: 0, cat: "ひとりで", src: "S1", name: () => "「ひとりで行ってくる。行き先はないしょ」", why: "何かあっても、だれも気づけず助けが遅れる。", fix: "何人かで行き、行き先と帰る時間を伝える。" },
    look: { kind: "text", sub: 0, cat: "目を離す", src: "S2", name: () => "「ちょっとスマホを見てるね」", why: "子どもは声を出さず、静かに溺れることがある。", fix: "目を離さず、手の届く所で見守る。" },
    cold: { kind: "text", sub: 0, cat: "体調", src: "S1", name: () => "「かぜ気味だけど、泳いじゃおう」", why: "体調が悪いときに無理をすると、事故につながる。", fix: "体調が悪い日は水に入らない。" },
    shallow: { kind: "text", sub: 1, cat: "目を離す", src: "S2", name: () => "「浅いから、見てなくて大丈夫」", why: "少しの水、少しの時間でも、子どもは溺れる。", fix: "浅くても、目を離さない。" },
    swimback: { kind: "text", sub: 1, cat: "離岸流", src: "S1", name: () => "「流されたら、岸へまっすぐ泳げばいい」", why: "離岸流では、陸に向かって泳いでも進めない。", fix: "岸と平行に泳ぐか、浮いて待つ。" },
    nophone: { kind: "text", sub: 1, cat: "連絡", src: "S1", name: () => "「スマホは車に置いていこう」", why: "何かあったとき、すぐに助けを呼べない。", fix: "防水パックに入れて持っていく。" },
    shampoo: { kind: "text", sub: 0, cat: "目を離す", src: "S2", name: () => "「髪を洗う間、湯船で待っててね」", why: "大人の洗髪中に、子どもが溺れる事故がある。", fix: "髪を洗う間は子どもを湯船から出す。" },
    firstin: { kind: "text", sub: 1, cat: "子どもだけ", src: "S2", name: () => "「先にお風呂に入ってて」", why: "子どもだけで浴室にいる時間ができてしまう。", fix: "子どもは大人のあとに入り、先に出す。" },
    // まわりのようす（川の水が急に増えるサイン・海の風と波）
    darkcloud: { kind: "meta", sub: 0, cat: "増水のサイン", src: "S1", name: () => "上流の空に黒い雲", why: "川の水が急に増えるサイン。", fix: "すぐに川から離れる。" },
    thunder: { kind: "meta", sub: 0, cat: "増水のサイン", src: "S1", name: () => "雷の音が聞こえる", why: "川の水が急に増えるサイン。", fix: "すぐに川から離れる。" },
    rainstart: { kind: "meta", sub: 0, cat: "増水のサイン", src: "S1", name: () => "雨が降り始めた", why: "上流の雨で、一気に水が増えることがある。", fix: "すぐに川から離れる。" },
    debris: { kind: "meta", sub: 1, cat: "増水のサイン", src: "S1", name: () => "落ち葉や流木が流れてくる", why: "川の水が急に増えるサイン。", fix: "すぐに川から離れる。" },
    coldwater: { kind: "meta", sub: 1, cat: "増水のサイン", src: "S1", name: () => "水が急に冷たくなった", why: "見落としやすい、増水のサイン。", fix: "すぐに川から離れる。" },
    lowwater: { kind: "meta", sub: 1, cat: "増水のサイン", src: "S1", name: () => "水位が急に下がった", why: "下がっても安心できない。増水のサイン。", fix: "すぐに川から離れる。" },
    siren: { kind: "meta", sub: 0, cat: "ダムの放流", src: "S2", name: () => "ダムのサイレンが鳴っている", why: "ダムの放流で、川の水が増えるおそれ。", fix: "サイレンが鳴ったら、すぐ離れる。" },
    wind: { kind: "meta", sub: 0, cat: "風と波", src: "S2", name: () => "風が強く、波が高い", why: "風や波が強い日は、流されやすく危ない。", fix: "風と波を確かめ、強い日は入らない。" },
  };
  const RISK_IDS = Object.keys(RISKS);
  // 大丈夫なもの（押すとまちがいに数える。なぜ大丈夫かを一言出す）
  const SAFE = {
    jacket: { n: "ライフジャケットを着た子ども", ok: "体に合うライフジャケットを着ていて、よい。" },
    shoes: { n: "かかとのあるくつ", ok: "脱げにくいくつは、川や堤防で安全。" },
    guard: { n: "監視員のいる見張り台", ok: "監視員が見守る場所で遊ぶのはよい。" },
    buoy: { n: "遊泳エリアのブイ", ok: "ブイの内側が、泳いでよい遊泳エリア。" },
    parasol: { n: "パラソルとシート", ok: "日かげで休むのは、事故とは関係ない。" },
    towel: { n: "タオル", ok: "タオルは、事故とは関係ない。" },
    bottle: { n: "水とう", ok: "水分をとるのは、事故とは関係ない。" },
    ring: { n: "救命浮き輪の設備", ok: "いざというときに投げる道具。そのままでよい。" },
    bird: { n: "鳥", ok: "鳥は、事故とは関係ない。" },
    tree: { n: "草の生えた土手の木", ok: "草の生えた所は、ふだん水が来ない所。" },
    sun: { n: "晴れた空", ok: "晴れた空は、事故とは関係ない。" },
    kick: { n: "ビート板", ok: "ビート板で泳ぐ練習は、事故とは関係ない。" },
    rest: { n: "プールサイドで休む人", ok: "疲れたら休むのは、よいこと。" },
    lid: { n: "水を抜いた湯船", ok: "入浴後に水を抜いておくのは、よいこと。" },
    gate: { n: "閉めたベビーゲート", ok: "子どもだけで浴室に入れないので、よい。" },
    duck: { n: "おもちゃのアヒル", ok: "おもちゃは、事故とは関係ない。" },
    mat: { n: "すべり止めマット", ok: "床のマットは、溺れる事故とは関係ない。" },
    basin: { n: "伏せて置いた洗面器", ok: "水をためずに伏せてあるので、よい。" },
    soap: { n: "せっけんとシャンプー", ok: "せっけんは、水の事故とは関係ない。" },
    lock: { n: "チャイルドロックをした洗濯機", ok: "ふたが開かないので、よい。" },
    sign: { n: "立入禁止の看板", ok: "看板があるだけなら、事故とは関係ない。入らなければよい。" },
    flower: { n: "花", ok: "花は、事故とは関係ない。" },
    frog: { n: "カエル", ok: "カエルは、事故とは関係ない。" },
  };
  const SAFE_TEXT = {
    tell: { n: "「行き先と帰る時間、伝えてきたよ」", ok: "行き先と帰る時間を伝えるのは、よいこと。" },
    pack: { n: "「スマホは防水パックに入れた」", ok: "連絡できるようにしておくのは、よいこと。" },
    fit: { n: "「ライフジャケット、体に合ってる？」", ok: "体に合っているか確かめるのは、よいこと。" },
    drink: { n: "「水をこまめに飲もう」", ok: "水分をとるのは、よいこと。" },
    fun: { n: "「楽しかったね」", ok: "気持ちだけなら、事故とは関係ない。" },
    restt: { n: "「そろそろ休けいしよう」", ok: "休けいをとるのは、よいこと。" },
    hand: { n: "「大人と手をつないで行こう」", ok: "大人がそばにいるのは、よいこと。" },
    zone: { n: "「監視員さんのいる所で泳ごう」", ok: "監視員のいる遊泳エリアで泳ぐのは、よいこと。" },
    after: { n: "「先に出ようね。大人もすぐ出るよ」", ok: "子どもを先に出すのは、よいこと。" },
    drain2: { n: "「お湯、抜いておいたよ」", ok: "入浴後に水を抜くのは、よいこと。" },
  };
  const SAFE_META = {
    clear: { n: "空は晴れ、風もおだやか", ok: "おだやかな日。ほかのようすも見て遊ぶ。" },
    usual: { n: "水の量はいつもどおり", ok: "変わったようすは無い。" },
    calm: { n: "波はおだやか", ok: "波がおだやかな日。" },
    warm: { n: "お湯の温度はちょうどいい", ok: "温度は、溺れる事故とは関係ない。" },
    staff: { n: "監視員が見回っている", ok: "見守る人がいるのは、よいこと。" },
  };
  const safeName = (id) => (SAFE[id] || SAFE_TEXT[id] || SAFE_META[id] || {}).n;

  // ---- 場面：背景と、物を置く6つの場所（x・y・幅・高さは％）。置ける物は場所ごとに決める ----
  // text・meta は、その場面で出してよい一言・ようす（危ない物と大丈夫な物）
  const TOP = (x, can) => ({ x, y: 4, w: 30, h: 42, can });
  const BOT = (x, can) => ({ x, y: 54, w: 30, h: 42, can });
  const SCENES = {
    kawa: { name: "川原", slots: [
      TOP(3, ["bare", "tree", "bird", "sun"]), TOP(35, ["nakasu", "bird", "tree"]), TOP(67, ["kids", "nojacket", "jacket", "bird"]),
      BOT(3, ["nojacket", "sandal", "jacket", "shoes", "bottle"]), BOT(35, ["kids", "sandal", "nojacket", "jacket", "towel", "shoes"]), BOT(67, ["bare", "nakasu", "parasol", "bottle", "flower"]) ],
      text: ["alone", "look", "cold", "shallow", "nophone", "tell", "pack", "fit", "drink", "fun", "hand"],
      meta: ["darkcloud", "thunder", "rainstart", "debris", "coldwater", "lowwater", "siren", "clear", "usual"] },
    umi: { name: "海水浴場", slots: [
      TOP(3, ["kinshi", "outzone", "buoy", "bird", "sun"]), TOP(35, ["outzone", "rip", "buoy", "guard"]), TOP(67, ["rip", "kinshi", "guard", "sun", "bird"]),
      BOT(3, ["beer", "parasol", "towel", "bottle"]), BOT(35, ["kids", "beer", "jacket", "parasol", "towel"]), BOT(67, ["kids", "sandal", "jacket", "shoes", "bottle"]) ],
      text: ["alone", "look", "cold", "shallow", "swimback", "nophone", "tell", "pack", "drink", "fun", "restt", "zone"],
      meta: ["wind", "calm", "clear", "staff"] },
    teibo: { name: "堤防の釣り場", slots: [
      TOP(3, ["rip", "bird", "sun", "buoy"]), TOP(35, ["peek", "ring", "bird"]), TOP(67, ["fishjacket", "peek", "jacket", "ring"]),
      BOT(3, ["fishjacket", "jacket", "bottle", "towel"]), BOT(35, ["sandal", "shoes", "bottle", "towel"]), BOT(67, ["kids", "sandal", "jacket", "shoes", "ring"]) ],
      text: ["alone", "look", "swimback", "nophone", "tell", "pack", "fit", "drink", "fun", "hand"],
      meta: ["wind", "calm", "clear"] },
    pool: { name: "プール", slots: [
      TOP(3, ["dive", "guard", "sun"]), TOP(35, ["under", "kick", "buoy"]), TOP(67, ["drain", "dive", "guard", "kick"]),
      BOT(3, ["drain", "kick", "rest", "towel"]), BOT(35, ["under", "kids", "jacket", "rest", "bottle"]), BOT(67, ["dive", "kids", "rest", "towel", "bottle"]) ],
      text: ["alone", "look", "cold", "shallow", "drink", "fun", "restt", "zone", "hand"],
      meta: ["staff", "clear"] },
    furo: { name: "お風呂場", slots: [
      TOP(3, ["door", "gate", "soap", "mat"]), TOP(35, ["bathkid", "ukiwa", "nokori", "lid", "duck"]), TOP(67, ["washer", "lock", "soap"]),
      BOT(3, ["bucket", "duck", "soap", "mat", "basin"]), BOT(35, ["nokori", "bathkid", "lid", "duck"]), BOT(67, ["ukiwa", "bucket", "duck", "towel", "basin"]) ],
      text: ["look", "shallow", "shampoo", "firstin", "fun", "after", "drain2"],
      meta: ["warm"] },
    tameike: { name: "ため池と用水路", slots: [
      TOP(3, ["fence", "sign", "bird", "sun"]), TOP(35, ["fence", "sign", "tree", "frog"]), TOP(67, ["kids", "jacket", "bird", "tree"]),
      BOT(3, ["canal", "flower", "frog", "bottle"]), BOT(35, ["canal", "kids", "sandal", "shoes", "flower"]), BOT(67, ["fishjacket", "sandal", "jacket", "shoes", "frog"]) ],
      text: ["alone", "look", "shallow", "nophone", "tell", "pack", "drink", "fun", "hand"],
      meta: ["rainstart", "thunder", "clear", "usual"] },
  };
  const SCENE_IDS = Object.keys(SCENES);
  // 同じ場面に出すと、話が合わなくなる組み合わせ（大人がいないのに大人の一言、水を抜いたのに水がたまっている など）
  const CONFLICTS = [["kids", "hand"], ["kids", "look"], ["kids", "shallow"], ["kids", "after"],
    ["bathkid", "shampoo"], ["bathkid", "after"], ["bathkid", "firstin"], ["ukiwa", "after"],
    ["lid", "bathkid"], ["lid", "ukiwa"], ["lid", "nokori"], ["lid", "shampoo"], ["drain2", "bathkid"], ["drain2", "ukiwa"], ["drain2", "nokori"], ["drain2", "shampoo"],
    ["sun", "darkcloud"], ["sun", "thunder"], ["sun", "rainstart"]];
  const clash = (ids) => CONFLICTS.some(([a, b]) => ids.includes(a) && ids.includes(b));
  // 難しさごとの危ないところの数・見落としやすいものの数（最低・最高）
  const SHAPE = [{ n: 2, sub: 0, maxSub: 0 }, { n: 3, sub: 0, maxSub: 1 }, { n: 3, sub: 1, maxSub: 2 }, { n: 4, sub: 2, maxSub: 3 }];

  const ri = (R, a, b) => a + Math.floor(R() * (b - a + 1));
  const pick = (R, arr) => arr[Math.floor(R() * arr.length)];
  const pickN = (R, arr, n) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
  function seedOf(str) { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const okRisk = (lv) => (id) => RISKS[id] && (lv > 0 || !RISKS[id].sub);

  // 1つの場面を作る。tag は "難しさ:場面|種"（例 "1:kawa|2026-11-17:d2"）
  function make(tag) {
    const m = /^([0-3]):([a-z]+)\|(.+)$/.exec(String(tag));
    if (!m || !Object.prototype.hasOwnProperty.call(SCENES, m[2])) return null;
    const lv = +m[1], sc = SCENES[m[2]], shp = SHAPE[lv], R = rng(seedOf(tag));
    const t = { river: pick(R, RIVERS), beach: pick(R, BEACHES), given: pick(R, GIVEN) };
    const textRisks = sc.text.filter(okRisk(lv)), textSafe = sc.text.filter((id) => SAFE_TEXT[id]);
    const metaRisks = sc.meta.filter(okRisk(lv)), metaSafe = sc.meta.filter((id) => SAFE_META[id]);
    for (let tries = 0; tries < 600; tries++) {
      // 危ないところの置き場所の数：ことばに0〜1（むずかしい・上級は0〜2）、まわりのようすに0〜1、残りは絵
      const nText = Math.min(ri(R, 0, lv >= 2 ? 2 : 1), textRisks.length), nMeta = metaRisks.length && R() < (lv === 0 ? 0.3 : 0.45) ? 1 : 0, nPhoto = shp.n - nText - nMeta;
      if (nPhoto < 1) continue;
      const slotOrder = pickN(R, sc.slots.map((_, i) => i), sc.slots.length);
      const used = new Set(), slots = sc.slots.map((s) => ({ x: s.x, y: s.y, w: s.w, h: s.h, id: null, risk: false }));
      let ok = true, riskLeft = nPhoto;
      for (const i of slotOrder) {
        const can = sc.slots[i].can, risks = can.filter((id) => okRisk(lv)(id) && !used.has(id)), safes = can.filter((id) => SAFE[id] && !used.has(id));
        let id;
        if (riskLeft > 0 && risks.length) { id = pick(R, risks); riskLeft--; } else if (safes.length) id = pick(R, safes); else { ok = false; break; }
        used.add(id); slots[i].id = id; slots[i].risk = !!RISKS[id];
      }
      if (!ok || riskLeft > 0) continue;
      const tl = pickN(R, textRisks, nText);
      const ts = pickN(R, textSafe, 3 - nText);
      const caps = pickN(R, [...tl, ...ts], 3).map((id) => ({ id, risk: !!RISKS[id] }));
      const meta = [{ id: nMeta ? pick(R, metaRisks) : pick(R, metaSafe), risk: !!nMeta }];
      const riskIds = [...slots.filter((s) => s.risk).map((s) => s.id), ...tl, ...(nMeta ? [meta[0].id] : [])];
      const nSub = riskIds.filter((id) => RISKS[id].sub).length;
      if (riskIds.length !== shp.n || nSub < shp.sub || nSub > shp.maxSub) continue;
      if (clash([...slots.map((x) => x.id), ...caps.map((c) => c.id), meta[0].id])) continue;
      const parts = [
        ...slots.map((s, i) => ({ uid: "s" + i, id: s.id, risk: s.risk, where: "photo", x: s.x, y: s.y, w: s.w, h: s.h })),
        ...caps.map((c, i) => ({ uid: "c" + i, id: c.id, risk: c.risk, where: "text" })),
        ...meta.map((c, i) => ({ uid: "m" + i, id: c.id, risk: c.risk, where: "meta" })),
      ];
      for (const p of parts) p.name = nameOf(p.id, t);
      const key = [m[2], ...slots.map((s) => s.id), ...caps.map((c) => c.id), meta[0].id].join(".");
      const place = m[2] === "kawa" ? t.river : m[2] === "umi" ? t.beach : "";
      return { tag, lv, scene: m[2], sceneName: place ? `${sc.name}（${place}）` : sc.name, t, parts, risks: parts.filter((p) => p.risk).map((p) => p.uid), key };
    }
    return null;
  }
  function nameOf(id, t) { return RISKS[id] ? RISKS[id].name(t) : safeName(id) || id; }
  function okOf(id) { const s = SAFE[id] || SAFE_TEXT[id] || SAFE_META[id]; return s ? s.ok : ""; }

  // 今日の5つ（やさしい2・ふつう2・むずかしい1）。場面は重ねない
  function dailyTags(date) {
    const R = rng(seedOf("day:" + date)), sc = pickN(R, SCENE_IDS, 5);
    return [0, 0, 1, 1, 2].map((lv, i) => `${lv}:${sc[i]}|${date}:d${i}`);
  }
  // 上級の3つ（危ないところ4つ・見落としやすいもの2つ以上・ヒントなし）
  function hardTags(date) { const R = rng(seedOf("hard:" + date)), sc = pickN(R, SCENE_IDS, 3); return sc.map((s, i) => `3:${s}|${date}:h${i}`); }

  const MIZU = { LV, SRC, RISKS, RISK_IDS, SAFE, SAFE_TEXT, SAFE_META, SCENES, SCENE_IDS, SHAPE, CONFLICTS, clash, RIVERS, BEACHES, GIVEN, seedOf, rng, make, nameOf, okOf, dailyTags, hardTags, pickN };
  if (typeof module !== "undefined" && module.exports) module.exports = MIZU; else root.MIZU = MIZU;
})(typeof self !== "undefined" ? self : this);
