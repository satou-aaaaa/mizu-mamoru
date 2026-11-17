// SNS で貼られたときの絵（og.png 1200×630）を作る。今日の場面（答え）は入れず、遊び方の例（川原の場面）だけ。
// 使い方: node tools/make-og.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
const ART = require(path.join(__dirname, "..", "art.js"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
    const box = (id, x, y, w, h, hit) => `<div style="position:absolute;left:${x}%;top:${y}%;width:${w}%;height:${h}%;border-radius:12px;${hit ? "border:5px solid #b8402a;background:#ffffff88" : ""}"><svg viewBox="0 0 100 100" style="width:100%;height:100%">${ART.item(id)}</svg>${hit ? `<span style="position:absolute;left:4px;top:4px;background:#b8402a;color:#fff;font-size:18px;font-weight:900;padding:2px 8px;border-radius:6px">✓ 危ない</span>` : ""}</div>`;
  await p.setContent(`<body style="margin:0;font-family:'Noto Sans CJK JP','IPAPGothic',sans-serif">
  <div style="width:1200px;height:630px;box-sizing:border-box;padding:56px 64px;background:#f4efe6;color:#1f2a44;display:flex;gap:48px;align-items:center">
    <div style="flex:1">
      <div style="font-size:32px;color:#86291a;letter-spacing:.06em">水辺で遊ぶ前に、見なおそう</div>
      <div style="font-size:88px;font-weight:900;margin-top:8px;color:#142a52;line-height:1.15">水の事故<br>から<span style="color:#b8402a">守る</span></div>
      <div style="font-size:36px;margin-top:20px;line-height:1.5">川・海・プール・お風呂の<br>危ないところを見つける</div>
    </div>
    <div style="width:470px;background:#fff;border:3px solid #1f2a4426;border-radius:24px;overflow:hidden;box-shadow:0 10px 30px #1f2a4422">
      <div style="padding:14px 18px;font-size:24px;font-weight:900">川原（〇〇川）　<span style="font-size:18px;background:#eef3fb;padding:4px 10px;border-radius:8px">🌤 上流の空に黒い雲</span></div>
      <div style="position:relative;aspect-ratio:3/2"><svg viewBox="0 0 300 200" preserveAspectRatio="none" style="position:absolute;inset:0;width:100%;height:100%">${ART.scene("kawa").replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>
        ${box("tree", 3, 4, 30, 42)}${box("nakasu", 35, 4, 30, 42, 1)}${box("jacket", 67, 4, 30, 42)}${box("sandal", 3, 54, 30, 42, 1)}${box("towel", 35, 54, 30, 42)}${box("bottle", 67, 54, 30, 42)}</div>
      <div style="padding:14px 18px 20px;font-size:24px">「楽しかったね」<b style="color:#b8402a">「スマホ見てるね」</b></div>
    </div>
  </div></body>`);
  await p.screenshot({ path: path.join(__dirname, "..", "og.png") });
  await b.close();
})();
