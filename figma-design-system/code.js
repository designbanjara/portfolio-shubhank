// Portfolio Design System Builder  -  Shubhank Pawar
// Each section is independently try/catch'd — partial output is better than nothing.

var RESULTS = [];

async function main() {

  // ── Font loading ────────────────────────────────────────────
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });
    console.log("[DS] Fonts loaded");
  } catch (e) {
    figma.notify("Font load failed: " + e.message, { error: true });
    figma.closePlugin();
    return;
  }

  // ── Helpers ─────────────────────────────────────────────────
  function hx(h) {
    h = h.replace("#", "");
    return {
      r: parseInt(h.slice(0, 2), 16) / 255,
      g: parseInt(h.slice(2, 4), 16) / 255,
      b: parseInt(h.slice(4, 6), 16) / 255,
    };
  }

  function applyFill(node, h, alpha) {
    node.fills = [{ type: "SOLID", color: hx(h), opacity: (alpha === undefined ? 1 : alpha) }];
  }

  function applyStroke(node, h) {
    node.strokes = [{ type: "SOLID", color: hx(h) }];
    node.strokeWeight = 1;
    node.strokeAlign = "INSIDE";
  }

  function makeRect(w, h, fillHex, radius, strokeHex) {
    var r = figma.createRectangle();
    r.resize(w, h);
    if (fillHex) applyFill(r, fillHex);
    if (radius !== undefined) r.cornerRadius = radius;
    if (strokeHex) applyStroke(r, strokeHex);
    return r;
  }

  function makeFrame(name, w, h, fillHex, radius) {
    var f = figma.createFrame();
    f.name = name;
    f.resize(w, h);
    applyFill(f, fillHex || "0d0d0d");
    if (radius !== undefined) f.cornerRadius = radius;
    return f;
  }

  function makeTxt(str, size, bold, colorHex) {
    var t = figma.createText();
    t.fontName = { family: "Inter", style: bold ? "Bold" : "Regular" };
    t.fontSize = size || 12;
    t.characters = str;
    t.fills = [{ type: "SOLID", color: hx(colorHex || "6b7280") }];
    return t;
  }

  function add(parent, child, x, y) {
    parent.appendChild(child);
    child.x = x || 0;
    child.y = y || 0;
  }

  var page = figma.currentPage;
  page.name = "Design System";

  var CANVAS_X = 80;
  var curY = 80;
  var GAP = 80;

  var allFrames = [];

  // ═══════════════════════════════════════
  // VARIABLES  (silent skip if unavailable)
  // ═══════════════════════════════════════
  var variablesOk = false;
  try {
    if (figma.variables && figma.variables.createVariableCollection) {
      var colColl = figma.variables.createVariableCollection("Colors");
      var colMode = colColl.modes[0].modeId;
      var colorTokens = [
        ["Background/Page",         "0d0d0d", 1],
        ["Background/Card",         "141414", 1],
        ["Background/Sidebar",      "1a1a1a", 1],
        ["Background/Nav-Inactive", "2a2a2a", 1],
        ["Background/Nav-Hover",    "333333", 1],
        ["Text/Primary",            "ffffff", 1],
        ["Text/Secondary",          "d1d5db", 1],
        ["Text/Muted",              "9ca3af", 1],
        ["Text/Subtle",             "6b7280", 1],
        ["Brand/Primary",           "4a9eff", 1],
        ["Brand/Primary-Light",     "60a5fa", 1],
        ["Brand/Primary-Dark",      "2563eb", 1],
        ["Brand/Accent",            "f97316", 1],
        ["Border/Default",          "333333", 1],
        ["Border/Subtle",           "262626", 1],
        ["State/Destructive",       "ef4444", 1],
        ["Overlay/Hover",           "ffffff", 0.05],
      ];
      for (var i = 0; i < colorTokens.length; i++) {
        var tok = colorTokens[i];
        var cv = figma.variables.createVariable(tok[0], colColl, "COLOR");
        var c = hx(tok[1]);
        cv.setValueForMode(colMode, { r: c.r, g: c.g, b: c.b, a: tok[2] });
      }

      var spColl = figma.variables.createVariableCollection("Spacing");
      var spMode = spColl.modes[0].modeId;
      var spVals2 = [4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64];
      for (var si = 0; si < spVals2.length; si++) {
        var sv = figma.variables.createVariable(String(spVals2[si]), spColl, "FLOAT");
        sv.setValueForMode(spMode, spVals2[si]);
      }

      var rdColl = figma.variables.createVariableCollection("Radii");
      var rdMode = rdColl.modes[0].modeId;
      var rdItems = [["SM",4],["MD",6],["LG",8],["XL",12],["Full",9999]];
      for (var ri = 0; ri < rdItems.length; ri++) {
        var rv = figma.variables.createVariable(rdItems[ri][0], rdColl, "FLOAT");
        rv.setValueForMode(rdMode, rdItems[ri][1]);
      }

      var typColl = figma.variables.createVariableCollection("Typography");
      var typMode = typColl.modes[0].modeId;
      var typItems = [
        ["Font Size/XS",12],["Font Size/SM",14],["Font Size/Base",18],
        ["Font Size/LG",20],["Font Size/XL",27],["Font Size/2XL",36],
        ["Font Weight/Regular",400],["Font Weight/Bold",700],
        ["Line Height/Tight",1.1],["Line Height/Normal",1.4],
      ];
      for (var ti = 0; ti < typItems.length; ti++) {
        var tv = figma.variables.createVariable(typItems[ti][0], typColl, "FLOAT");
        tv.setValueForMode(typMode, typItems[ti][1]);
      }

      variablesOk = true;
      console.log("[DS] Variables created");
      RESULTS.push("4 variable collections");
    }
  } catch (e) {
    console.warn("[DS] Variables skipped:", e.message);
  }

  // ═══════════════════════════════════════
  // FRAME 1 · Color Palette
  // ═══════════════════════════════════════
  try {
    console.log("[DS] Building Color Palette...");
    var colorGroups = [
      { title: "BACKGROUND", items: [
        {name:"Page",       hex:"0d0d0d"},
        {name:"Card",       hex:"141414"},
        {name:"Sidebar",    hex:"1a1a1a"},
        {name:"Nav-Off",    hex:"2a2a2a"},
        {name:"Nav-Hover",  hex:"333333"},
      ]},
      { title: "TEXT", items: [
        {name:"Primary",    hex:"ffffff"},
        {name:"Secondary",  hex:"d1d5db"},
        {name:"Muted",      hex:"9ca3af"},
        {name:"Subtle",     hex:"6b7280"},
      ]},
      { title: "BRAND", items: [
        {name:"Primary",    hex:"4a9eff"},
        {name:"Pr-Light",   hex:"60a5fa"},
        {name:"Pr-Dark",    hex:"2563eb"},
        {name:"Accent",     hex:"f97316"},
      ]},
      { title: "BORDER & STATE", items: [
        {name:"Border",     hex:"333333"},
        {name:"Bdr-Subtle", hex:"262626"},
        {name:"Destructive",hex:"ef4444"},
      ]},
    ];

    var SW = 80, SH = 64, SG = 12;
    var maxItems = 5;
    var cfw = 40 + maxItems * (SW + SG) + 40;
    var cfh = 88 + colorGroups.length * (SH + 56);
    var cf = makeFrame("Color Palette", cfw, cfh, "0d0d0d");
    cf.x = CANVAS_X; cf.y = curY;
    page.appendChild(cf);
    allFrames.push(cf);

    add(cf, makeTxt("Color Palette", 24, true, "ffffff"), 40, 24);
    add(cf, makeTxt("Design tokens - 4 semantic groups - Dark theme", 13, false, "6b7280"), 40, 54);

    var gy = 88;
    for (var gi = 0; gi < colorGroups.length; gi++) {
      var grp = colorGroups[gi];
      add(cf, makeTxt(grp.title, 10, false, "4b5563"), 40, gy);
      gy += 18;
      var gx = 40;
      for (var swi = 0; swi < grp.items.length; swi++) {
        var sw = grp.items[swi];
        var box = makeRect(SW, SH, sw.hex, 8, ["0d0d0d","141414","1a1a1a","262626"].indexOf(sw.hex) >= 0 ? "333333" : null);
        add(cf, box, gx, gy);
        add(cf, makeTxt(sw.name, 10, false, "9ca3af"), gx, gy + SH + 5);
        add(cf, makeTxt("#" + sw.hex.toUpperCase(), 10, false, "4b5563"), gx, gy + SH + 18);
        gx += SW + SG;
      }
      gy += SH + 50;
    }
    curY += cfh + GAP;
    RESULTS.push("Color Palette frame");
    console.log("[DS] Color Palette done");
  } catch (e) {
    console.error("[DS] Color Palette failed:", e.message);
    RESULTS.push("Color Palette FAILED: " + e.message);
    curY += 400 + GAP;
  }

  // ═══════════════════════════════════════
  // FRAME 2 · Typography Scale
  // ═══════════════════════════════════════
  try {
    console.log("[DS] Building Typography...");
    var typeRows = [
      {label:"H1 - Display",   size:36, bold:true,  lh:1.1,  color:"ffffff", sample:"Shubhank Pawar"},
      {label:"H2 - Section",   size:27, bold:true,  lh:1.25, color:"ffffff", sample:"Writing"},
      {label:"H3 - Subhead",   size:20, bold:true,  lh:1.4,  color:"ffffff", sample:"Design at scale"},
      {label:"Body 18px",      size:18, bold:false, lh:1.4,  color:"d1d5db", sample:"Digital designer, Bangalore, India."},
      {label:"Small 14px",     size:14, bold:false, lh:1.4,  color:"9ca3af", sample:"Published January 15, 2025"},
      {label:"Caption 12px",   size:12, bold:false, lh:1.4,  color:"6b7280", sample:"Tags - Design - AI - India"},
      {label:"Link 18px",      size:18, bold:false, lh:1.4,  color:"60a5fa", sample:"PhonePe"},
    ];

    var typoH = 100;
    for (var tri = 0; tri < typeRows.length; tri++) {
      typoH += typeRows[tri].size + 28 + 10;
    }
    typoH += 40;

    var tf = makeFrame("Typography Scale", 880, typoH, "0d0d0d");
    tf.x = CANVAS_X; tf.y = curY;
    page.appendChild(tf);
    allFrames.push(tf);

    add(tf, makeTxt("Typography Scale", 24, true, "ffffff"), 40, 24);
    add(tf, makeTxt("MintGrotesk for H1 display  -  Inter for all other text  -  Base 18px", 13, false, "6b7280"), 40, 54);
    add(tf, makeRect(800, 1, "262626", 0), 40, 80);

    var tty = 96;
    for (var tii = 0; tii < typeRows.length; tii++) {
      var row = typeRows[tii];
      add(tf, makeTxt(row.label, 10, false, "4b5563"), 40, tty + Math.max(0, (row.size - 12) / 2));
      add(tf, makeTxt(row.size + "px", 10, false, "2563eb"), 40, tty + Math.max(0, (row.size - 12) / 2) + 14);

      var samp = figma.createText();
      samp.fontName = { family: "Inter", style: row.bold ? "Bold" : "Regular" };
      samp.fontSize = row.size;
      samp.lineHeight = { unit: "PERCENT", value: row.lh * 100 };
      samp.characters = row.sample;
      samp.fills = [{ type: "SOLID", color: hx(row.color) }];
      add(tf, samp, 200, tty);

      tty += row.size + 28 + 10;
      add(tf, makeRect(640, 1, "1a1a1a", 0), 200, tty - 10);
    }
    curY += typoH + GAP;
    RESULTS.push("Typography Scale frame");
    console.log("[DS] Typography done");
  } catch (e) {
    console.error("[DS] Typography failed:", e.message);
    RESULTS.push("Typography FAILED: " + e.message);
    curY += 600 + GAP;
  }

  // ═══════════════════════════════════════
  // FRAME 3 · Spacing & Radii
  // ═══════════════════════════════════════
  try {
    console.log("[DS] Building Spacing...");
    var sf = makeFrame("Spacing and Radii", 880, 360, "0d0d0d");
    sf.x = CANVAS_X; sf.y = curY;
    page.appendChild(sf);
    allFrames.push(sf);

    add(sf, makeTxt("Spacing Scale", 24, true, "ffffff"), 40, 24);
    add(sf, makeTxt("Base unit 4px  -  Tailwind spacing scale", 13, false, "6b7280"), 40, 54);

    var spArr = [4, 8, 12, 16, 20, 24, 32, 40, 48];
    var spx = 40;
    var maxH = 48;
    var baseY = 148;
    for (var spi = 0; spi < spArr.length; spi++) {
      var sp = spArr[spi];
      var spBlock = makeRect(sp, sp, "2563eb", 2);
      add(sf, spBlock, spx, baseY + (maxH - sp));
      add(sf, makeTxt(String(sp), 10, false, "6b7280"), spx, baseY + maxH + 6);
      spx += sp + 20;
    }

    add(sf, makeTxt("Border Radius", 14, true, "ffffff"), 40, 232);
    var rdArr = [
      {label:"SM",   val:4,  note:"4px"},
      {label:"MD",   val:6,  note:"6px"},
      {label:"LG",   val:8,  note:"8px"},
      {label:"XL",   val:12, note:"12px"},
      {label:"Full", val:28, note:"pill"},
    ];
    var rdx = 40;
    for (var rdi = 0; rdi < rdArr.length; rdi++) {
      var rd = rdArr[rdi];
      var rdBox = makeRect(56, 56, "1a1a1a", rd.val, "4a9eff");
      add(sf, rdBox, rdx, 256);
      add(sf, makeTxt(rd.label, 10, false, "ffffff"), rdx, 318);
      add(sf, makeTxt(rd.note,  10, false, "4b5563"), rdx, 331);
      rdx += 56 + 24;
    }
    curY += 360 + GAP;
    RESULTS.push("Spacing and Radii frame");
    console.log("[DS] Spacing done");
  } catch (e) {
    console.error("[DS] Spacing failed:", e.message);
    RESULTS.push("Spacing FAILED: " + e.message);
    curY += 360 + GAP;
  }

  // ═══════════════════════════════════════
  // FRAME 4 · Components
  // ═══════════════════════════════════════
  try {
    console.log("[DS] Building Components...");
    var comp = makeFrame("Components", 1040, 700, "0d0d0d");
    comp.x = CANVAS_X; comp.y = curY;
    page.appendChild(comp);
    allFrames.push(comp);

    add(comp, makeTxt("Components", 24, true, "ffffff"), 40, 24);
    add(comp, makeTxt("Core UI patterns from the portfolio codebase", 13, false, "6b7280"), 40, 54);
    add(comp, makeRect(960, 1, "262626", 0), 40, 78);

    // Section: Nav Cards
    add(comp, makeTxt("SIDEBAR NAVIGATION", 10, false, "4b5563"), 40, 96);

    var navStates = [
      {name:"Active",   fill:"2563eb", lbl:"Home",     meta:"bg #2563EB", lc:"ffffff", mc:"93c5fd"},
      {name:"Inactive", fill:"2a2a2a", lbl:"Writing",  meta:"bg #2A2A2A", lc:"d1d5db", mc:"6b7280"},
      {name:"Hover",    fill:"333333", lbl:"Projects", meta:"bg #333333", lc:"ffffff", mc:"9ca3af"},
    ];
    var ncx = 40;
    for (var nci = 0; nci < navStates.length; nci++) {
      var ns = navStates[nci];
      var card = makeFrame("Nav Card - " + ns.name, 224, 120, ns.fill, 6);
      add(comp, card, ncx, 114);
      add(card, makeTxt(ns.lbl, 16, true, ns.lc), 16, 16);
      add(card, makeTxt(ns.name + " state", 11, false, ns.mc), 16, 96);
      ncx += 224 + 20;
    }

    // Section: Mobile Bottom Nav
    add(comp, makeRect(960, 1, "262626", 0), 40, 262);
    add(comp, makeTxt("MOBILE BOTTOM NAV", 10, false, "4b5563"), 40, 272);

    var bnav = makeFrame("Bottom Nav Mobile", 380, 52, "1a1a1a", 26);
    applyStroke(bnav, "333333");
    add(comp, bnav, 40, 290);
    add(bnav, makeRect(116, 40, "333333", 20), 4, 6);
    add(bnav, makeTxt("Home",     14, true,  "ffffff"), 24, 17);
    add(bnav, makeTxt("Writing",  14, false, "9ca3af"), 148, 17);
    add(bnav, makeTxt("Projects", 14, false, "9ca3af"), 274, 17);

    // Section: Social Link Rows
    add(comp, makeRect(960, 1, "262626", 0), 40, 368);
    add(comp, makeTxt("SOCIAL LINK ROWS", 10, false, "4b5563"), 40, 378);

    var socialItems2 = [
      {icon:"X",         lbl:"X",          action:"Follow"},
      {icon:"in",        lbl:"LinkedIn",   action:"Follow"},
      {icon:"@",         lbl:"Mail",       action:"Contact"},
    ];
    var sly = 396;
    for (var soci = 0; soci < socialItems2.length; soci++) {
      var si2 = socialItems2[soci];
      var srow = makeFrame("Social Row - " + si2.lbl, 440, 44, "0d0d0d", 8);
      add(comp, srow, 40, sly);
      add(srow, makeTxt(si2.icon + "   " + si2.lbl, 14, false, "ffffff"), 12, 14);
      add(srow, makeTxt(si2.action, 13, false, "9ca3af"), 360, 14);
      sly += 45;
      if (soci < socialItems2.length - 1) {
        add(comp, makeRect(440, 1, "262626", 0), 40, sly - 1);
      }
    }

    // Section: Buttons & Badges
    add(comp, makeRect(960, 1, "262626", 0), 560, 262);
    add(comp, makeTxt("BUTTONS AND BADGES", 10, false, "4b5563"), 560, 272);

    var pbtn = makeFrame("Button Primary", 152, 44, "2563eb", 12);
    add(comp, pbtn, 560, 290);
    add(pbtn, makeTxt("Subscribe", 14, true, "ffffff"), 24, 14);

    add(comp, makeTxt("bg #2563EB  radius 12px", 10, false, "4b5563"), 560, 342);

    add(comp, makeRect(480, 1, "262626", 0), 560, 362);
    add(comp, makeTxt("BADGES / TAGS", 10, false, "4b5563"), 560, 372);
    var bLabels = ["Design", "AI", "India", "UX"];
    var bdx = 560;
    for (var bdi = 0; bdi < bLabels.length; bdi++) {
      var bw = bLabels[bdi].length * 7 + 20;
      var bframe = makeFrame("Badge " + bLabels[bdi], bw, 24, "2a2a2a", 6);
      add(comp, bframe, bdx, 390);
      add(bframe, makeTxt(bLabels[bdi], 12, false, "9ca3af"), 8, 5);
      bdx += bw + 8;
    }
    add(comp, makeTxt("bg #2A2A2A  text gray-400  text-xs  rounded", 10, false, "4b5563"), 560, 422);

    // Post Card
    add(comp, makeRect(480, 1, "262626", 0), 560, 448);
    add(comp, makeTxt("WRITING POST CARD", 10, false, "4b5563"), 560, 458);

    var pcard = makeFrame("Post Card", 440, 108, "141414", 8);
    add(comp, pcard, 560, 476);
    add(pcard, makeRect(80, 80, "2a2a2a", 8), 12, 14);
    add(pcard, makeTxt("AI in Design - What is actually changing", 15, true, "ffffff"), 104, 14);
    add(pcard, makeTxt("January 15, 2025", 12, false, "6b7280"), 104, 36);
    add(pcard, makeTxt("A look at how AI is reshaping design...", 13, false, "9ca3af"), 104, 56);
    var pb = makeFrame("Badge Design", 60, 22, "2a2a2a", 6);
    add(pcard, pb, 104, 80);
    add(pb, makeTxt("Design", 11, false, "9ca3af"), 8, 4);

    RESULTS.push("Components frame");
    console.log("[DS] Components done");
  } catch (e) {
    console.error("[DS] Components failed:", e.message);
    RESULTS.push("Components FAILED: " + e.message);
  }

  // ── Done ────────────────────────────────────────────────────
  if (allFrames.length > 0) {
    figma.viewport.scrollAndZoomIntoView(allFrames);
  }

  var summary = variablesOk
    ? "Design system complete: " + RESULTS.join(", ")
    : "Frames created (variables skipped - needs Pro plan): " + RESULTS.filter(function(r) { return r.indexOf("FAILED") < 0; }).join(", ");

  console.log("[DS] Done:", summary);
  figma.notify(summary.length > 100 ? "Design system built! " + allFrames.length + " frames created." : summary, { timeout: 6000 });
  figma.closePlugin();
}

main().catch(function(err) {
  console.error("[DS] Fatal:", err.message, err.stack);
  figma.notify("Plugin error: " + err.message, { error: true, timeout: 10000 });
  figma.closePlugin();
});
