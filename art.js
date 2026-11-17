// 水の事故から守るの絵（場面の背景と、ようすの絵）。すべて SVG の線と形で描く（写真・外の画像は使わない）。
// ようすの絵は viewBox 0 0 100 100。下に短い名前の帯を付ける（絵だけでは行動が分かりにくいため）。人は顔を描かず、形だけ。
(function (root) {
  "use strict";
  const F = `font-family="'Zen Maru Gothic','Hiragino Sans','Yu Gothic',sans-serif" font-weight="700"`;
  const txt = (x, y, s, size = 12, fill = "#1f2a44") => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" fill="${fill}" ${F}>${s}</text>`;
  const fit = (s, max, base = 12) => { const n = [...s].length; return n <= max ? base : Math.max(7, Math.floor((base * max) / n)); };
  // 下の名前の帯（短い言葉。長い名前は aria-label にある）
  const tag = (s, bg = "#fffaf0", fg = "#1f2a44") => `<rect x="2" y="80" width="96" height="18" rx="5" fill="${bg}" stroke="#1f2a4455" stroke-width="1"/>${txt(50, 93, s, fit(s, 8), fg)}`;
  // 人の形（顔は描かない）。vest はライフジャケット、c は服の色、s は大きさ
  const person = (x, y, { c = "#4f6a8f", vest = false, s = 1, arms = "down" } = {}) => {
    const h = `<circle cx="${x}" cy="${y}" r="${7 * s}" fill="#e8c4a0"/>`;
    const body = `<rect x="${x - 7 * s}" y="${y + 8 * s}" width="${14 * s}" height="${20 * s}" rx="${5 * s}" fill="${vest ? "#ef7d22" : c}"/>`;
    const v = vest ? `<rect x="${x - 2 * s}" y="${y + 10 * s}" width="${4 * s}" height="${16 * s}" fill="#fff6c8"/>` : "";
    const a = arms === "up" ? `<path d="M${x - 7 * s} ${y + 12 * s} L${x - 14 * s} ${y - 2 * s} M${x + 7 * s} ${y + 12 * s} L${x + 14 * s} ${y - 2 * s}" stroke="#e8c4a0" stroke-width="${3 * s}" stroke-linecap="round"/>` : `<path d="M${x - 7 * s} ${y + 12 * s} L${x - 11 * s} ${y + 24 * s} M${x + 7 * s} ${y + 12 * s} L${x + 11 * s} ${y + 24 * s}" stroke="#e8c4a0" stroke-width="${3 * s}" stroke-linecap="round"/>`;
    return a + body + v + h;
  };
  const water = (y, c = "#5aa9d6") => `<rect x="0" y="${y}" width="100" height="${80 - y}" fill="${c}"/><path d="M0 ${y + 6} Q12 ${y + 2} 25 ${y + 6} T50 ${y + 6} T75 ${y + 6} T100 ${y + 6}" stroke="#d6eef9" stroke-width="2" fill="none"/>`;

  // 場面の背景（viewBox 0 0 300 200）
  const SCENE = {
    kawa: `<rect width="300" height="200" fill="#cfe8f7"/><path d="M0 70 Q80 60 150 72 T300 70 V200 H0 Z" fill="#8fc27a"/>
      <path d="M0 96 Q90 84 160 100 T300 98 V150 Q200 140 120 152 T0 148 Z" fill="#5aa9d6"/><path d="M0 150 Q120 140 300 152 V200 H0 Z" fill="#d8c29a"/>`,
    umi: `<rect width="300" height="200" fill="#cfe8f7"/><rect y="60" width="300" height="70" fill="#4f9fd0"/><path d="M0 64 H300" stroke="#d6eef9" stroke-width="2"/>
      <path d="M0 130 Q150 116 300 130 V200 H0 Z" fill="#ead7a6"/>`,
    teibo: `<rect width="300" height="200" fill="#cfe8f7"/><rect y="56" width="300" height="144" fill="#3f8cc0"/><rect y="118" width="300" height="82" fill="#b9b4ad"/>
      <rect y="114" width="300" height="8" fill="#8f8a83"/>`,
    pool: `<rect width="300" height="200" fill="#e9f3f7"/><rect x="0" y="30" width="300" height="104" fill="#62bde0"/><path d="M0 64 H300 M0 100 H300" stroke="#fff" stroke-width="2" stroke-dasharray="8 6"/>
      <rect y="134" width="300" height="66" fill="#d9d4cb"/>`,
    furo: `<rect width="300" height="200" fill="#eef4f6"/><path d="M0 40 H300 M0 80 H300 M0 120 H300 M60 0 V200 M120 0 V200 M180 0 V200 M240 0 V200" stroke="#d3dee3" stroke-width="2"/>
      <rect y="150" width="300" height="50" fill="#c9d6dc"/>`,
    tameike: `<rect width="300" height="200" fill="#cfe8f7"/><rect y="60" width="300" height="140" fill="#9fcb7f"/><ellipse cx="150" cy="96" rx="140" ry="30" fill="#4f8fa8"/>
      <rect y="150" width="300" height="16" fill="#6f9fb8"/><rect y="146" width="300" height="4" fill="#8a847c"/><rect y="166" width="300" height="4" fill="#8a847c"/>`,
  };
  function scene(id) { return `<svg viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true" class="bg">${SCENE[id] || ""}</svg>`; }

  // ようすの絵
  function item(id) {
    switch (id) {
      // 危ないところ
      case "nakasu": return `${water(30)}<ellipse cx="50" cy="52" rx="30" ry="10" fill="#d8c29a"/>${person(50, 26, { c: "#c0392b", s: 0.8, arms: "up" })}${tag("中州で遊ぶ")}`;
      case "nojacket": return `${water(46)}${person(50, 30, { c: "#3d7a3a" })}${tag("ジャケットなし")}`;
      case "sandal": return `<path d="M14 54 Q14 40 36 40 L78 44 Q90 46 88 58 L84 64 L16 64 Z" fill="#e6b422" stroke="#a8730f" stroke-width="2"/><path d="M40 44 Q50 30 62 46" stroke="#c0392b" stroke-width="5" fill="none"/>${tag("脱げやすいサンダル")}`;
      case "kids": return `${water(56)}${person(34, 30, { c: "#c0392b", s: 0.8 })}${person(64, 30, { c: "#24427a", s: 0.8 })}${tag("子どもだけ")}`;
      case "bare": return `<rect x="0" y="50" width="100" height="30" fill="#d8c29a"/><path d="M22 66 L50 26 L78 66 Z" fill="#d36b6b" stroke="#8a3a3a" stroke-width="2"/><path d="M50 26 V66" stroke="#8a3a3a" stroke-width="2"/>${tag("草のない河原")}`;
      case "kinshi": return `<rect x="46" y="40" width="6" height="40" fill="#6b5338"/><rect x="12" y="8" width="76" height="36" rx="4" fill="#fff" stroke="#c0392b" stroke-width="4"/>${txt(50, 32, "遊泳禁止", 14, "#c0392b")}${person(80, 62, { c: "#24427a", s: 0.6, arms: "up" })}${tag("禁止の先で泳ぐ")}`;
      case "outzone": return `${water(10)}<circle cx="20" cy="50" r="6" fill="#ef7d22"/><circle cx="44" cy="50" r="6" fill="#ef7d22"/><path d="M20 50 H44" stroke="#ef7d22" stroke-width="2" stroke-dasharray="3 3"/>${person(76, 24, { c: "#24427a", s: 0.7, arms: "up" })}${tag("ブイの外へ")}`;
      case "beer": return `<rect x="58" y="34" width="22" height="34" rx="4" fill="#e6b422"/><rect x="58" y="34" width="22" height="8" fill="#fff"/><path d="M80 42 Q90 42 90 52 Q90 60 80 60" stroke="#a8730f" stroke-width="4" fill="none"/>${person(30, 24, { c: "#4f6a8f" })}${tag("お酒のあと海へ")}`;
      case "rip": return `${water(10)}<rect x="0" y="10" width="26" height="70" fill="#a8a29a"/><path d="M60 70 V24 M52 32 L60 20 L68 32" stroke="#fff" stroke-width="4" fill="none"/>${person(42, 40, { c: "#c0392b", s: 0.6, arms: "up" })}${tag("堤防のそば")}`;
      case "fishjacket": return `<path d="M50 34 L90 4" stroke="#6b5338" stroke-width="3"/><path d="M90 4 V60" stroke="#8a8f99" stroke-width="1"/>${person(40, 30, { c: "#3d7a3a" })}${tag("ジャケットなしで釣り")}`;
      case "peek": return `<rect x="0" y="50" width="56" height="30" fill="#a8a29a"/>${water(56).replace('x="0"', 'x="56"')}<g transform="rotate(35 46 36)">${person(46, 24, { c: "#c0392b", s: 0.8 })}</g>${tag("縁からのぞく")}`;
      case "dive": return `<rect x="0" y="40" width="40" height="40" fill="#d9d4cb"/>${water(50, "#62bde0").replace('x="0"', 'x="40"')}<g transform="rotate(-50 58 30)">${person(58, 30, { c: "#c0392b", s: 0.8, arms: "up" })}</g>${tag("飛びこむ")}`;
      case "drain": return `${water(10, "#62bde0")}<rect x="56" y="54" width="30" height="20" rx="3" fill="#5c6670"/><path d="M60 58 H82 M60 64 H82 M60 70 H82" stroke="#a8b4c0" stroke-width="2"/>${person(34, 26, { c: "#24427a", s: 0.8 })}${tag("排水口のそば")}`;
      case "under": return `${water(14, "#62bde0")}<rect x="18" y="20" width="64" height="14" rx="3" fill="#ef7d22"/>${person(50, 48, { c: "#c0392b", s: 0.6 })}${tag("台の下にもぐる")}`;
      case "bathkid": return `<rect x="8" y="34" width="84" height="44" rx="10" fill="#fff" stroke="#8fb4c6" stroke-width="4"/><rect x="14" y="42" width="72" height="30" rx="6" fill="#9fd4ea"/>${person(50, 30, { c: "#9fd4ea", s: 0.7 })}${tag("子どもだけで湯船")}`;
      case "ukiwa": return `<rect x="8" y="34" width="84" height="44" rx="10" fill="#fff" stroke="#8fb4c6" stroke-width="4"/><rect x="14" y="42" width="72" height="30" rx="6" fill="#9fd4ea"/><ellipse cx="50" cy="48" rx="20" ry="8" fill="none" stroke="#d36b6b" stroke-width="7"/>${person(50, 28, { c: "#9fd4ea", s: 0.6 })}${tag("浮き輪でひとり")}`;
      case "nokori": return `<rect x="8" y="30" width="84" height="48" rx="10" fill="#fff" stroke="#8fb4c6" stroke-width="4"/><rect x="14" y="38" width="72" height="34" rx="6" fill="#9fd4ea"/><path d="M20 46 Q35 42 50 46 T80 46" stroke="#d6eef9" stroke-width="2" fill="none"/>${tag("水がたまった湯船")}`;
      case "bucket": return `<path d="M24 30 L76 30 L68 76 L32 76 Z" fill="#6bb0d3" stroke="#3e7fa3" stroke-width="3"/><ellipse cx="50" cy="30" rx="26" ry="6" fill="#9fd4ea" stroke="#3e7fa3" stroke-width="3"/><path d="M24 30 Q50 0 76 30" stroke="#3e7fa3" stroke-width="2" fill="none"/>${tag("水をためたバケツ")}`;
      case "washer": return `<rect x="16" y="14" width="68" height="64" rx="6" fill="#f4f6f8" stroke="#8a8f99" stroke-width="3"/><ellipse cx="50" cy="20" rx="26" ry="8" fill="#9fd4ea"/><path d="M24 18 L30 2 L76 2 L76 14" fill="#dfe8f5" stroke="#8a8f99" stroke-width="2"/>${tag("ふたが開く洗濯機")}`;
      case "door": return `<rect x="20" y="6" width="60" height="72" fill="#cfe1ea" stroke="#8a8f99" stroke-width="3"/><path d="M20 6 L44 14 L44 74 L20 78 Z" fill="#a8c4d2" stroke="#8a8f99" stroke-width="2"/>${tag("開いたままの戸")}`;
      case "fence": return `${water(40, "#4f8fa8")}<path d="M4 30 H96 M10 20 V44 M30 20 V44 M50 20 V44 M70 20 V44 M90 20 V44" stroke="#8a847c" stroke-width="4"/><path d="M60 40 L84 10" stroke="#6b5338" stroke-width="3"/>${person(58, 40, { c: "#3d7a3a", s: 0.7 })}${tag("柵の中で釣り")}`;
      case "canal": return `<rect x="0" y="50" width="100" height="30" fill="#6f9fb8"/><rect x="0" y="46" width="100" height="5" fill="#8a847c"/>${person(50, 14, { c: "#c0392b", s: 0.8 })}${tag("用水路のふち")}`;
      // 大丈夫なもの
      case "jacket": return `${person(50, 22, { vest: true })}${tag("ライフジャケット")}`;
      case "shoes": return `<path d="M12 50 Q12 36 30 36 L60 40 Q66 30 76 34 L88 50 L88 64 L12 64 Z" fill="#3d7a3a" stroke="#264d24" stroke-width="2"/><rect x="12" y="62" width="76" height="6" fill="#264d24"/>${tag("かかとのあるくつ")}`;
      case "guard": return `<path d="M30 76 L40 30 M70 76 L60 30" stroke="#6b5338" stroke-width="4"/><rect x="30" y="24" width="40" height="8" fill="#6b5338"/>${person(50, 4, { c: "#c0392b", s: 0.7 })}${tag("監視員")}`;
      case "buoy": return `${water(30)}<circle cx="22" cy="46" r="7" fill="#ef7d22"/><circle cx="50" cy="46" r="7" fill="#ef7d22"/><circle cx="78" cy="46" r="7" fill="#ef7d22"/><path d="M22 46 H78" stroke="#ef7d22" stroke-width="2" stroke-dasharray="3 3"/>${tag("遊泳エリアのブイ")}`;
      case "parasol": return `<path d="M10 40 Q50 4 90 40 Z" fill="#d36b6b"/><path d="M50 40 V76" stroke="#6b5338" stroke-width="4"/><rect x="18" y="68" width="64" height="8" fill="#6bb0d3"/>${tag("パラソル")}`;
      case "towel": return `<rect x="20" y="20" width="60" height="54" rx="4" fill="#f2a5b0"/><path d="M20 34 H80 M20 60 H80" stroke="#fff" stroke-width="4"/>${tag("タオル")}`;
      case "bottle": return `<rect x="36" y="22" width="28" height="54" rx="8" fill="#6bb0d3" stroke="#3e7fa3" stroke-width="2"/><rect x="40" y="12" width="20" height="12" rx="3" fill="#3e7fa3"/>${tag("水とう")}`;
      case "ring": return `<rect x="46" y="4" width="8" height="76" fill="#8a8f99"/><circle cx="50" cy="40" r="22" fill="none" stroke="#ef7d22" stroke-width="10"/><path d="M28 40 H34 M66 40 H72 M50 18 V24 M50 56 V62" stroke="#fff" stroke-width="10"/>${tag("救命浮き輪")}`;
      case "bird": return `<path d="M20 50 Q36 32 52 48 Q66 32 82 44 Q66 42 52 54 Q38 42 20 50 Z" fill="#4f6a8f"/>${tag("鳥")}`;
      case "tree": return `<rect x="0" y="60" width="100" height="20" fill="#5aa04f"/><rect x="44" y="40" width="12" height="24" fill="#7a5530"/><circle cx="50" cy="28" r="22" fill="#4f9a49"/>${tag("草の生えた土手")}`;
      case "sun": return `<circle cx="50" cy="40" r="18" fill="#ffd65a"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M${50 + 24 * Math.cos((a * Math.PI) / 180)} ${40 + 24 * Math.sin((a * Math.PI) / 180)} L${50 + 32 * Math.cos((a * Math.PI) / 180)} ${40 + 32 * Math.sin((a * Math.PI) / 180)}" stroke="#ffb020" stroke-width="4" stroke-linecap="round"/>`).join("")}${tag("晴れた空")}`;
      case "kick": return `<rect x="22" y="20" width="56" height="54" rx="14" fill="#ffd65a" stroke="#e6a422" stroke-width="3"/>${tag("ビート板")}`;
      case "rest": return `<rect x="10" y="56" width="80" height="10" fill="#6bb0d3"/><path d="M20 66 V76 M80 66 V76" stroke="#3e7fa3" stroke-width="4"/>${person(50, 22, { c: "#3d7a3a", s: 0.9 })}${tag("休む人")}`;
      case "lid": return `<rect x="8" y="34" width="84" height="44" rx="10" fill="#fff" stroke="#8fb4c6" stroke-width="4"/><rect x="14" y="42" width="72" height="30" rx="6" fill="#e9f3f7"/><circle cx="50" cy="66" r="4" fill="#8a8f99"/>${tag("水を抜いた湯船")}`;
      case "gate": return `<rect x="10" y="20" width="80" height="56" fill="none" stroke="#8a8f99" stroke-width="4"/>${[22, 34, 46, 58, 70, 82].map((x) => `<path d="M${x} 20 V76" stroke="#8a8f99" stroke-width="3"/>`).join("")}${tag("閉めたベビーゲート")}`;
      case "duck": return `<ellipse cx="54" cy="56" rx="28" ry="16" fill="#ffd65a"/><circle cx="34" cy="34" r="14" fill="#ffd65a"/><path d="M20 34 L10 38 L20 40 Z" fill="#ef7d22"/>${tag("おもちゃ")}`;
      case "soap": return `<rect x="16" y="20" width="24" height="54" rx="6" fill="#f2a5b0"/><rect x="22" y="10" width="12" height="12" fill="#c0392b"/><rect x="50" y="52" width="36" height="22" rx="10" fill="#fff6c8" stroke="#d9b48a" stroke-width="2"/>${tag("せっけん")}`;
      case "lock": return `<rect x="16" y="14" width="68" height="64" rx="6" fill="#f4f6f8" stroke="#8a8f99" stroke-width="3"/><rect x="16" y="14" width="68" height="12" fill="#dfe8f5" stroke="#8a8f99" stroke-width="2"/><rect x="42" y="34" width="16" height="14" rx="2" fill="#3d7a3a"/><path d="M45 34 V28 Q50 22 55 28 V34" stroke="#3d7a3a" stroke-width="3" fill="none"/>${tag("ロックした洗濯機")}`;
      case "sign": return `<rect x="46" y="40" width="6" height="40" fill="#6b5338"/><rect x="10" y="8" width="80" height="36" rx="4" fill="#fff" stroke="#c0392b" stroke-width="4"/>${txt(50, 32, "立入禁止", 14, "#c0392b")}${tag("看板")}`;
      case "flower": return `<path d="M50 50 V78" stroke="#4f9a49" stroke-width="5"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${50 + 12 * Math.cos((a * Math.PI) / 180)}" cy="${36 + 12 * Math.sin((a * Math.PI) / 180)}" r="10" fill="#f2a5b0"/>`).join("")}<circle cx="50" cy="36" r="8" fill="#e6b422"/>${tag("花")}`;
      case "frog": return `<ellipse cx="50" cy="54" rx="28" ry="18" fill="#5aa04f"/><circle cx="36" cy="36" r="9" fill="#5aa04f"/><circle cx="64" cy="36" r="9" fill="#5aa04f"/><circle cx="36" cy="35" r="4" fill="#fff"/><circle cx="64" cy="35" r="4" fill="#fff"/>${tag("カエル")}`;
      case "mat": return `<rect x="10" y="30" width="80" height="44" rx="6" fill="#6bb0d3"/>${[20, 34, 48, 62, 76].map((x) => `<circle cx="${x + 2}" cy="52" r="4" fill="#9fd4ea"/>`).join("")}${tag("すべり止めマット")}`;
      case "basin": return `<path d="M18 70 Q18 40 50 40 Q82 40 82 70 Z" fill="#f2c94c" stroke="#c9a227" stroke-width="3"/>${tag("伏せた洗面器")}`;
    }
    return "";
  }
  const ART = { scene, item };
  if (typeof module !== "undefined" && module.exports) module.exports = ART; else root.ART = ART;
})(typeof self !== "undefined" ? self : this);
