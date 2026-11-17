// アプリのアイコン（icon-192.png・icon-512.png・icon-maskable-512.png）を作る。maskable は絵を中央の半径40％の内側に縮める（Android で丸く切られても欠けない）。生成りの地に水の輪と救命浮き輪。
// 使い方: node tools/make-icons.cjs（qa/ の playwright を使う）
const path = require("path");
const { chromium } = require(path.join(__dirname, "..", "qa", "node_modules", "playwright"));
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  for (const [s, name, k] of [[192, "icon-192.png", 1], [512, "icon-512.png", 1], [512, "icon-maskable-512.png", 0.8]]) {
    const p = await b.newPage({ viewport: { width: s, height: s } });
    await p.setContent(`<body style="margin:0"><svg width="${s}" height="${s}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#f4efe6"/>
      <g transform="translate(50 50) scale(${k}) translate(-50 -50)"><circle cx="50" cy="50" r="38" fill="#5aa9d6"/><path d="M12 56 Q31 48 50 56 T88 56 V60 Q69 52 50 60 T12 60 Z" fill="#d6eef9"/>
      <circle cx="50" cy="50" r="26" fill="none" stroke="#ef7d22" stroke-width="10"/><path d="M24 50 H32 M68 50 H76 M50 24 V32 M50 68 V76" stroke="#fff" stroke-width="10"/></g></svg></body>`);
    await p.screenshot({ path: path.join(__dirname, "..", name), clip: { x: 0, y: 0, width: s, height: s } });
  }
  await b.close();
})();
