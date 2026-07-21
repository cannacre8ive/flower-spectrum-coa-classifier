import { useState, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   FLOWER SPECTRUM · PROFILE EXPLORER + TEMPLATE STUDIO
   ───────────────────────────────────────────────────────────────────────────
   - Clickable profile detail for all 10 categories
   - Live label templates per strain (Jar / Shelf / Package)
   - Full Spectrum printed menu template
   - Staff Picks premium menu with fingerprints
   - Engine matches Chemovar Classifier v1.2 (10 profiles, gas emergence)
   ═══════════════════════════════════════════════════════════════════════════ */

const VERSION = "v10.0";
const BUILD = "06_16_2026";

// ── PROFILES ──
const PROFILES = [
  { key:"gas_fuel",      label:"Gas / Fuel",      color:"#C9A84C", short:"GAS",
    tagline:"Loud, pungent diesel and chemical funk",
    sensory:"Pungent diesel, solvent, and aggressive skunk. The loudest jar on the shelf — it announces itself before you even open it.",
    drivers:["β-Caryophyllene + D-Limonene + Myrcene (balanced)", "α-Humulene", "p-Cymene (minor)"],
    foundWith:["spicy_warm","earthy_dank"],
    note:"Gas is the only profile that emerges from a balance of multiple terpenes rather than a single driver — when caryophyllene, limonene, and myrcene/humulene all show up in similar amounts, you get diesel." },
  { key:"earthy_dank",   label:"Earthy / Dank",   color:"#6B8E5A", short:"EARTH",
    tagline:"Deep soil, musk, and weight",
    sensory:"Wet forest floor, damp soil, fresh-cut mushroom. Grounded and heavy. Carries an old-school musk that reads as substantial.",
    drivers:["Myrcene", "α-Humulene"],
    foundWith:["gas_fuel","herbal_woody"] },
  { key:"citrus_bright", label:"Citrus / Bright", color:"#D4A843", short:"CITRUS",
    tagline:"Zesty lemon, orange, grapefruit",
    sensory:"Fresh-cut citrus rind, lemon zest, ripe orange. Sharp and uplifting — the brightest, most awake corner of the spectrum.",
    drivers:["D-Limonene", "Valencene"],
    foundWith:["fruity_sweet","piney_fresh"] },
  { key:"fruity_sweet",  label:"Fruity / Sweet",  color:"#B75F4A", short:"FRUIT",
    tagline:"Juicy, candy, ripe stone fruit",
    sensory:"Berry, stone fruit, candy. The sweetest, juiciest profile — often led by terpinolene's haze-like fruit-fresh character.",
    drivers:["Terpinolene", "β-Farnesene", "β-Ocimene"],
    foundWith:["floral_soft","tropical_tangy"] },
  { key:"floral_soft",   label:"Floral / Soft",   color:"#B98BBE", short:"FLORAL",
    tagline:"Lavender, rose, perfumed softness",
    sensory:"Crushed lavender, rose petal, soft perfume. Delicate and aromatic — the calmest corner of the spectrum.",
    drivers:["Linalool", "α-Bisabolol", "trans-Nerolidol", "α-Terpineol"],
    foundWith:["dessert_creamy","fruity_sweet"] },
  { key:"dessert_creamy",label:"Dessert / Creamy",color:"#D6B58A", short:"DESSERT",
    tagline:"Vanilla, cake, rich and smooth",
    sensory:"Vanilla, cake batter, sweet cream. Smooth and indulgent — sits on top of other profiles rather than driving them.",
    drivers:["Linalool + α-Bisabolol", "over sweet/spicy base"],
    foundWith:["floral_soft","spicy_warm"],
    combination:true,
    note:"Dessert / Creamy is a combination profile — it emerges from soft florals layered over sweetness and warmth. Strains in this category classify Primary Floral or Spicy on a COA, but the culture calls them dessert flowers." },
  { key:"spicy_warm",    label:"Spicy / Warm",    color:"#9E6B4A", short:"SPICY",
    tagline:"Black pepper, clove, warm spice",
    sensory:"Cracked black pepper, clove, baking spice. Warm and assertive — the only terpene profile dominated by a single aromatic heavyweight.",
    drivers:["β-Caryophyllene", "Caryophyllene Oxide", "α-Humulene"],
    foundWith:["gas_fuel","herbal_woody"] },
  { key:"piney_fresh",   label:"Piney / Fresh",   color:"#4F7A5B", short:"PINE",
    tagline:"Pine, fir, crisp mountain air",
    sensory:"Pine needle, Douglas fir, crisp mountain air. Sharp and resinous — clean and bracing, often invigorating.",
    drivers:["α-Pinene", "β-Pinene", "Camphene", "Δ-3-Carene"],
    foundWith:["herbal_woody","citrus_bright"] },
  { key:"herbal_woody",  label:"Herbal / Woody",  color:"#7FA688", short:"HERB",
    tagline:"Loose tea, sage, fresh-cut wood",
    sensory:"Loose-leaf tea, sage, dry hop, fresh sawn wood. Dry and savory — refined and understated, more 'considered' than loud.",
    drivers:["α-Humulene", "Guaiol", "Fenchol", "Eucalyptol"],
    foundWith:["piney_fresh","spicy_warm"] },
  { key:"tropical_tangy",label:"Tropical / Tangy",color:"#D28B49", short:"TROPIC",
    tagline:"Mango, guava, sun-ripened fruit",
    sensory:"Mango, guava, passionfruit. Exotic and tangy — vibrant fruit you'd find in a juice bar, not a pie.",
    drivers:["β-Ocimene", "Terpinolene", "Valencene"],
    foundWith:["fruity_sweet","citrus_bright"] },
];
const PBK = Object.fromEntries(PROFILES.map(p => [p.key, p]));

// ── TERPENE DATABASE (compact — matches v1.2 classifier semantics) ──
const POT_DEF = { primary:1.0, impact:1.1, trace:0.7 };
const TERPENES = [
  // PRIMARY
  { key:"myrcene",      label:"Myrcene",          tier:"primary", profile:"earthy_dank",   also:["gas_fuel","herbal_woody"] },
  { key:"limonene",     label:"D-Limonene",       tier:"primary", profile:"citrus_bright", also:["fruity_sweet","gas_fuel"] },
  { key:"caryophyllene",label:"β-Caryophyllene",  tier:"primary", profile:"spicy_warm",    also:["gas_fuel"], potency:1.15 },
  { key:"linalool",     label:"Linalool",         tier:"primary", profile:"floral_soft",   also:["dessert_creamy"], potency:1.2 },
  { key:"pinene_a",     label:"α-Pinene",         tier:"primary", profile:"piney_fresh",   also:["herbal_woody"] },
  { key:"pinene_b",     label:"β-Pinene",         tier:"primary", profile:"piney_fresh",   also:["herbal_woody"] },
  { key:"terpinolene",  label:"Terpinolene",      tier:"primary", profile:"fruity_sweet",  also:["tropical_tangy","piney_fresh"] },
  { key:"humulene",     label:"α-Humulene",       tier:"primary", profile:"herbal_woody",  also:["spicy_warm","earthy_dank","gas_fuel"] },
  { key:"ocimene",      label:"β-Ocimene",        tier:"primary", profile:"tropical_tangy",also:["fruity_sweet","floral_soft"] },
  // IMPACT
  { key:"bisabolol",    label:"α-Bisabolol",      tier:"impact",  profile:"floral_soft",   also:["dessert_creamy"], potency:1.2 },
  { key:"valencene",    label:"Valencene",        tier:"impact",  profile:"citrus_bright", also:["tropical_tangy"], potency:1.2 },
  { key:"nerolidol",    label:"trans-Nerolidol",  tier:"impact",  profile:"floral_soft",   also:["herbal_woody"], potency:1.15 },
  { key:"guaiol",       label:"Guaiol",           tier:"impact",  profile:"herbal_woody",  also:["piney_fresh"] },
  { key:"terpineol",    label:"α-Terpineol",      tier:"impact",  profile:"floral_soft",   also:["piney_fresh"] },
  { key:"caryophyllene_oxide", label:"Caryophyllene Oxide", tier:"impact", profile:"spicy_warm", also:["herbal_woody"] },
  { key:"farnesene_b",  label:"β-Farnesene",      tier:"impact",  profile:"fruity_sweet",  also:["herbal_woody"], potency:0.3 },
  { key:"farnesene_a",  label:"α-Farnesene",      tier:"impact",  profile:"fruity_sweet",  also:["herbal_woody"], potency:0.3 },
  { key:"camphene",     label:"Camphene",         tier:"impact",  profile:"piney_fresh",   also:["herbal_woody"] },
  { key:"carene",       label:"Δ-3-Carene",       tier:"impact",  profile:"piney_fresh",   also:["citrus_bright"] },
  { key:"pcymene",      label:"p-Cymene",         tier:"impact",  profile:"gas_fuel",      also:["spicy_warm"], potency:0.85 },
  { key:"fenchol",      label:"Fenchol",          tier:"impact",  profile:"herbal_woody",  also:["piney_fresh"] },
  { key:"eucalyptol",   label:"Eucalyptol",       tier:"impact",  profile:"herbal_woody",  also:["piney_fresh"] },
  { key:"geraniol",     label:"Geraniol",         tier:"impact",  profile:"floral_soft",   also:["fruity_sweet"], potency:1.15 },
  // TRACE
  { key:"phytol",       label:"Phytol",           tier:"trace",   profile:"herbal_woody" },
  { key:"phellandrene", label:"α-Phellandrene",   tier:"trace",   profile:"citrus_bright", also:["herbal_woody"] },
  { key:"aterpinene",   label:"α-Terpinene",      tier:"trace",   profile:"piney_fresh",   also:["citrus_bright"] },
  { key:"geranyl_acetate", label:"Geranyl Acetate", tier:"trace", profile:"floral_soft",   also:["fruity_sweet"] },
];
const TBK = Object.fromEntries(TERPENES.map(t => [t.key, t]));
const potOf = t => (t.potency != null ? t.potency : POT_DEF[t.tier]);

function contribOf(t) {
  const c = {}; c[t.profile] = 0.7;
  (t.also || []).forEach((p, i) => { c[p] = i === 0 ? 0.2 : 0.1; });
  const s = Object.values(c).reduce((a, b) => a + b, 0);
  Object.keys(c).forEach(k => c[k] = c[k] / s);
  return c;
}

function classify(values) {
  const scores = {}; PROFILES.forEach(p => scores[p.key] = 0);
  TERPENES.forEach(t => {
    const v = values[t.key] || 0; if (v <= 0) return;
    const w = v * potOf(t), c = contribOf(t);
    Object.entries(c).forEach(([pk, ww]) => { scores[pk] += w * ww; });
  });
  // Emergent gas: balanced co-occurrence of carry+lim+(myr|hum)
  const car = (values.caryophyllene||0)*potOf(TBK.caryophyllene);
  const lim = (values.limonene||0)*potOf(TBK.limonene);
  const mus = (values.myrcene||0)*potOf(TBK.myrcene) + (values.humulene||0)*potOf(TBK.humulene);
  if (car>0 && lim>0 && mus>0) {
    const mn = Math.min(car,lim,mus), mx = Math.max(car,lim,mus);
    scores.gas_fuel += 1.5 * mn * Math.pow(mn/mx, 1.5);
  }
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  if (total === 0) return null;
  const ranked = PROFILES.map(p => ({ ...p, pct: Math.round((scores[p.key]/total)*100) }))
    .sort((a,b) => b.pct - a.pct);
  const gap = ranked[0].pct - ranked[1].pct;
  const confidence = gap >= 22 ? "Defined" : gap >= 10 ? "Leaning" : "Blend";
  const totalTerp = TERPENES.reduce((s,t)=>s+(values[t.key]||0),0);
  return { ranked, confidence, gap, totalTerp };
}

function topTerpenes(values, n=3) {
  return TERPENES.map(t => ({ t, v: values[t.key]||0 }))
    .filter(x => x.v > 0).sort((a,b) => b.v - a.v).slice(0, n);
}

// Aromatic lead (potency-weighted) — what's actually loudest
function aromaticLead(values) {
  const ranked = TERPENES.map(t => ({ t, w: (values[t.key]||0)*potOf(t) }))
    .filter(x => x.w > 0).sort((a,b) => b.w - a.w);
  return ranked[0]?.t.label || "—";
}

// ── BAND SEGMENTS — proportional to each profile's share of the breakdown ──
// A profile joins the band if its score is >= 50% of the leader's, capped at 3.
// Widths are proportional to the included profiles' percentages, so a near-solid
// flower reads as one color and a true blend splits proportionally.
function bandSegments(classification) {
  if (!classification) return [];
  const r = classification.ranked.filter(x => x.pct > 0);
  if (!r.length) return [];
  const lead = r[0].pct;
  let segs = r.filter(x => x.pct >= lead * 0.6).slice(0, 3);
  const total = segs.reduce((a, s) => a + s.pct, 0) || 1;
  return segs.map(s => ({ key: s.key, color: s.color, label: s.label, frac: s.pct / total, pct: s.pct }));
}

// ── BLEND NAME — honest combined name when two profiles are close ──
// "Spicy-Gas", "Citrus-Fruit". Single name when one clearly dominates.
function blendName(classification) {
  if (!classification) return "—";
  const segs = bandSegments(classification);
  if (segs.length <= 1) return PBK[segs[0]?.key || classification.ranked[0].key].label.split(" / ")[0];
  return segs.slice(0, 2).map(s => PBK[s.key].label.split(" / ")[0]).join("-");
}

// ── SORT / GROUP / CSV (data backend) ──
const SORT_OPTIONS = [
  { key:"default", label:"Default" },
  { key:"name", label:"Name (A–Z)" },
  { key:"price_desc", label:"Price (high→low)" },
  { key:"price_asc", label:"Price (low→high)" },
  { key:"thc_desc", label:"THC (high→low)" },
  { key:"terps_desc", label:"Terpene % (high→low)" },
  { key:"profile", label:"Profile" },
];
const GROUP_OPTIONS = [
  { key:"profile", label:"Primary Profile" },
  { key:"tier", label:"Tier" },
  { key:"none", label:"No Grouping" },
];
const TIER_LABEL = { top:"Top Shelf", mid:"Mid Shelf", value:"Value" };

function sortStrains(strains, sortKey) {
  const a = [...strains];
  switch (sortKey) {
    case "name": return a.sort((x,y) => x.name.localeCompare(y.name));
    case "price_desc": return a.sort((x,y) => (y.price.eighth) - (x.price.eighth));
    case "price_asc": return a.sort((x,y) => (x.price.eighth) - (y.price.eighth));
    case "thc_desc": return a.sort((x,y) => y.thc - x.thc);
    case "terps_desc": return a.sort((x,y) => (y.classification?.totalTerp||0) - (x.classification?.totalTerp||0));
    case "profile": return a.sort((x,y) => PROFILES.findIndex(p=>p.key===x.classification.ranked[0].key) - PROFILES.findIndex(p=>p.key===y.classification.ranked[0].key));
    default: return a;
  }
}

function buildGroups(strains, groupBy, sortKey) {
  const sorted = sortStrains(strains, sortKey === "default" ? "profile" : sortKey);
  if (groupBy === "none") {
    return [{ key:"all", label:"All Flower", color:"#8a8478", strains: sorted }];
  }
  if (groupBy === "tier") {
    return ["top","mid","value"].map(t => ({
      key:t, label:TIER_LABEL[t], color:"#8a8478",
      strains: sorted.filter(s => s.tier === t),
    })).filter(g => g.strains.length > 0);
  }
  // profile
  return PROFILES.map(p => ({
    key:p.key, label:p.label, color:p.color, tagline:p.tagline,
    strains: sorted.filter(s => s.classification && s.classification.ranked[0].key === p.key),
  })).filter(g => g.strains.length > 0);
}

// CSV of the populated menu — establishes the column format for future import
function strainsToCSV(strains, scope) {
  const cols = ["Strain","Grower","Lineage","Primary Profile","Profile %","Secondary","Secondary %","Blend Name","Confidence","THC %","Total Terpenes %","Top Terps","Aroma","Tier","Price 1g","Price 1/8","Staff Pick","Picked By","Pick Note","Notes"];
  const esc = v => { const t = String(v ?? "").replace(/"/g,'""'); return /[",\n]/.test(t) ? `"${t}"` : t; };
  const rows = strains.map(s => {
    const c = s.classification, r = c?.ranked || [];
    const tops = topTerpenes(s.values, 4).map(t => t.t.label).join(" / ");
    return [
      s.name, s.grower, s.lineage || "",
      r[0] ? r[0].label : "", r[0] ? r[0].pct : "",
      r[1] ? r[1].label : "", r[1] ? r[1].pct : "",
      blendName(c), c ? c.confidence : "",
      s.thc, c ? c.totalTerp.toFixed(2) : "",
      tops, s.aroma || "", s.tier || "",
      s.price?.g ?? "", s.price?.eighth ?? "",
      s.staffPick ? "Yes" : "No", s.staffPick?.by || "", s.staffPick?.quote || "",
      s.notes || "",
    ].map(esc).join(",");
  });
  const header = `Flower Spectrum ${scope} Export,${VERSION},${BUILD}`;
  return header + "\n\n" + cols.join(",") + "\n" + rows.join("\n");
}

// ── STRAIN DATA ──
// real:true = verified COA from your Ideal Cannabis files
// illustrative:true = terpene values shaped to match the strain's known character
const SEED_STRAINS = [
  // GAS/FUEL — gas references from your v3.2 menu
  { name:"Sour Diesel", grower:"Archive PDX", lineage:"Chemdawg 91 × Super Skunk", aroma:"Sharp diesel and lemon peel with a skunky tail.", real:false, illustrative:true,
    values:{ caryophyllene:0.60, limonene:0.52, myrcene:0.50, humulene:0.20, pinene_a:0.12, pcymene:0.05, terpinolene:0.06, linalool:0.05 },
    thc:26.4, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Pungent fuel-forward with a citrus exhale.",
    staffPick:{ by:"Marcus", quote:"My benchmark for what diesel should taste like. Loud out of the jar, sharp on the inhale, citrus on the way out." } },
  { name:"Motorbreath #15", grower:"Resin Ranchers", lineage:"Chemdawg × SFV OG Kush BX1", aroma:"Motor oil and dank fuel edged with sour citrus.", real:false, illustrative:true,
    values:{ caryophyllene:0.70, limonene:0.55, myrcene:0.45, humulene:0.22, linalool:0.10, pcymene:0.04, nerolidol:0.08 },
    thc:29.1, tier:"top",
    price:{ g:15, eighth:48, quarter:85, half:160, oz:290 },
    notes:"Motor oil nose, knockout potency.",
    staffPick:{ by:"Marcus", quote:"When I want to be flattened. This is the loudest jar we carry — opens the room every time." } },

  // EARTHY/DANK
  { name:"Meat Stomper", grower:"Ideal Cannabis", lineage:"Proprietary · Ideal Cannabis (unpublished)", aroma:"Heavy dank musk with a savory, almost meaty funk.", real:true,
    values:{ myrcene:0.97, linalool:0.31, caryophyllene:0.24, limonene:0.20, nerolidol:0.15, farnesene_a:0.10, humulene:0.09, ocimene:0.07, valencene:0.04, pinene_b:0.04, phytol:0.04, farnesene_b:0.03 },
    thc:23.1, tier:"top",
    price:{ g:13, eighth:40, quarter:72, half:135, oz:250 },
    notes:"Dank-forward, heavy myrcene, with a savory edge.",
    staffPick:{ by:"Dana", quote:"Real-deal dank. Smells like opening a jar at a friend's grow tent. Heavy on the body, perfect end-of-day." } },
  { name:"Afghan Kush", grower:"East Fork Cultivars", lineage:"Hindu Kush landrace (Afghanistan)", aroma:"Earthy hash and musk, dense and sweet.", real:false, illustrative:true,
    values:{ myrcene:0.65, humulene:0.18, caryophyllene:0.20, pinene_b:0.08, linalool:0.10 },
    thc:19.6, tier:"mid",
    price:{ g:10, eighth:30, quarter:55, half:100, oz:180 },
    notes:"Old-school sedation, musky earth." },

  // CITRUS/BRIGHT
  { name:"Layer Cake", grower:"Ideal Cannabis", lineage:"Wedding Cake × GMO", aroma:"Lemon zest layered over rich vanilla cake.", real:true,
    values:{ limonene:0.88, myrcene:0.48, caryophyllene:0.27, nerolidol:0.16, terpinolene:0.15, pinene_b:0.13, farnesene_a:0.12, humulene:0.10, fenchol:0.09, terpineol:0.09, pinene_a:0.08, valencene:0.04, phytol:0.03, bisabolol:0.03 },
    thc:24.8, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Bright limonene-led with rich cake undertones.",
    staffPick:{ by:"Priya", quote:"Cleanest citrus jar in the case. Reads as lemon zest, but the cake side keeps showing up on the back end." } },

  // FRUITY/SWEET
  { name:"Positive Mental Attitude", grower:"Ideal Cannabis", lineage:"Proprietary · Ideal Cannabis (unpublished)", aroma:"Bright tropical haze and fresh fruit, never heavy.", real:true,
    values:{ terpinolene:1.15, myrcene:0.40, limonene:0.34, farnesene_b:0.37, pinene_b:0.12, caryophyllene:0.10, nerolidol:0.08, pinene_a:0.07, phellandrene:0.06, farnesene_a:0.06, humulene:0.05, terpineol:0.05, aterpinene:0.04, carene:0.04, fenchol:0.03, bisabolol:0.03, valencene:0.03, phytol:0.04 },
    thc:22.4, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Terpinolene-led, haze-bright, daytime fruit.",
    staffPick:{ by:"Priya", quote:"My favorite daytime jar. Bright fruit, never heavy, leaves you sharp. Customers who try it come back for it." } },
  { name:"Cascade Orange", grower:"Ideal Cannabis", lineage:"Proprietary · Ideal Cannabis (unpublished)", aroma:"Sweet orange and haze with a piney edge.", real:true,
    values:{ terpinolene:0.74, limonene:0.33, myrcene:0.29, caryophyllene:0.11, nerolidol:0.10, pinene_b:0.09, pinene_a:0.07, terpineol:0.07, ocimene:0.05, farnesene_b:0.05, farnesene_a:0.05, humulene:0.04, fenchol:0.04, phytol:0.04, aterpinene:0.03, phellandrene:0.03, bisabolol:0.03 },
    thc:21.7, tier:"top",
    price:{ g:13, eighth:40, quarter:72, half:135, oz:250 },
    notes:"Terpinolene with a citrus lift." },
  { name:"Mt. Hood Magic", grower:"Ideal Cannabis", lineage:"Proprietary · Ideal Cannabis (unpublished)", aroma:"Juicy tropical fruit with a tangy, candied lift.", real:true,
    values:{ terpinolene:1.05, caryophyllene:0.43, myrcene:0.29, farnesene_b:0.25, limonene:0.22, ocimene:0.22, farnesene_a:0.21, humulene:0.17, pinene_b:0.11, bisabolol:0.07, pinene_a:0.06, valencene:0.05, phellandrene:0.05, aterpinene:0.04, terpineol:0.04, nerolidol:0.04, carene:0.04, phytol:0.03 },
    thc:25.2, tier:"top",
    price:{ g:15, eighth:46, quarter:82, half:150, oz:280 },
    notes:"Fruity primary with a tropical-tangy lift.",
    staffPick:{ by:"Dana", quote:"The richest terp profile we've ever seen on a flower. 3.37% total — you can smell it through the jar." } },

  // FLORAL/SOFT
  { name:"Lavender Haze", grower:"Deschutes Growery", lineage:"Lavender × Haze", aroma:"Crushed lavender and rose with a soft herbal finish.", real:false, illustrative:true,
    values:{ linalool:0.55, bisabolol:0.28, nerolidol:0.22, caryophyllene:0.18, terpineol:0.12, myrcene:0.12, limonene:0.08, geraniol:0.06 },
    thc:21.3, tier:"top",
    price:{ g:13, eighth:40, quarter:72, half:135, oz:250 },
    notes:"Lavender-forward with soft chamomile finish." },
  { name:"Granddaddy Purple", grower:"East Fork Cultivars", lineage:"Purple Urkle × Big Bud", aroma:"Grape candy and floral musk.", real:false, illustrative:true,
    values:{ linalool:0.40, myrcene:0.35, caryophyllene:0.25, pinene_b:0.10, terpineol:0.08, nerolidol:0.08 },
    thc:20.8, tier:"mid",
    price:{ g:11, eighth:34, quarter:60, half:110, oz:200 },
    notes:"Classic purple with floral-grape softness." },

  // DESSERT/CREAMY (combination — strains classify Spicy/Floral but read 'dessert')
  { name:"Wedding Cake Gelato", grower:"Ideal Cannabis", lineage:"Wedding Cake × Gelato", aroma:"Peppery spice wrapped in sweet frosting and cream.", real:true,
    values:{ caryophyllene:0.86, farnesene_b:0.58, limonene:0.42, farnesene_a:0.39, humulene:0.28, nerolidol:0.27, myrcene:0.20, valencene:0.08, pinene_b:0.08, terpinolene:0.08, fenchol:0.07, terpineol:0.07, pinene_a:0.06, ocimene:0.05, geranyl_acetate:0.04, phytol:0.04 },
    thc:26.7, tier:"top",
    price:{ g:15, eighth:46, quarter:82, half:150, oz:280 },
    notes:"Spicy primary, sweet cream undertone.",
    staffPick:{ by:"Priya", quote:"The dessert pick. Spicy on the label but reads like frosting on the palate — every customer who asks for 'cake' should be handed this." } },
  { name:"Ice Cream Cake", grower:"Resin Ranchers", lineage:"Wedding Cake × Gelato #33", aroma:"Sweet cream and vanilla over a warm, doughy base.", real:false, illustrative:true,
    values:{ caryophyllene:0.55, linalool:0.32, limonene:0.28, bisabolol:0.18, myrcene:0.20, nerolidol:0.12, humulene:0.10 },
    thc:23.5, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Sweet cream layered over warm spice." },

  // SPICY/WARM
  { name:"Gorilla Glue #4", grower:"Ideal Cannabis", lineage:"Chem's Sister × Sour Dubb × Chocolate Diesel", aroma:"Black pepper and pungent fuel with a chem-sour edge.", real:true,
    values:{ caryophyllene:0.75, farnesene_b:0.93, farnesene_a:0.32, myrcene:0.43, limonene:0.48, nerolidol:0.30, humulene:0.21, linalool:0.12, bisabolol:0.11, valencene:0.10, pinene_b:0.07, pinene_a:0.04, fenchol:0.06, terpineol:0.06, geranyl_acetate:0.03, phytol:0.03 },
    thc:25.4, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Spicy lead, real gas on the back.",
    staffPick:{ by:"Marcus", quote:"Reads spicy on the test, but it sits right on the gas line — open the jar and it's both. The thinking person's GG4." } },
  { name:"Do Si Dos", grower:"Certified Cannabis", lineage:"GSC × Face Off OG", aroma:"Sharp pepper and pine softened by a floral, minty finish.", real:true,
    values:{ caryophyllene:1.03, limonene:0.45, linalool:0.31, humulene:0.30, bisabolol:0.16, farnesene_b:0.09, myrcene:0.08, pinene_b:0.07, fenchol:0.05, terpineol:0.04, pinene_a:0.03 },
    thc:24.1, tier:"top",
    price:{ g:14, eighth:42, quarter:75, half:140, oz:260 },
    notes:"Heavy caryophyllene with a floral finish." },

  // PINEY/FRESH
  { name:"Trainwreck", grower:"Gnome Grown", lineage:"Mexican × Thai × Afghani", aroma:"Sharp pine and lemon with a spicy haze snap.", real:false, illustrative:true,
    values:{ pinene_a:0.50, terpinolene:0.30, caryophyllene:0.25, pinene_b:0.20, myrcene:0.18, limonene:0.12 },
    thc:22.7, tier:"mid",
    price:{ g:11, eighth:34, quarter:60, half:110, oz:200 },
    notes:"Sharp pine with a haze edge." },
  { name:"Mountain Crest", grower:"East Fork Cultivars", lineage:"Proprietary · East Fork selection (unpublished)", aroma:"Crisp pine forest and cool mountain air.", real:false, illustrative:true,
    values:{ pinene_a:0.58, pinene_b:0.28, myrcene:0.18, caryophyllene:0.15, terpinolene:0.10, camphene:0.08 },
    thc:19.4, tier:"mid",
    price:{ g:10, eighth:30, quarter:55, half:100, oz:180 },
    notes:"Forest-air pine, crisp and clean." },

  // HERBAL/WOODY
  { name:"Northern Lights", grower:"Deschutes Growery", lineage:"Afghani × Thai", aroma:"Dry hop, hay, and sweet earthy wood.", real:false, illustrative:true,
    values:{ humulene:0.45, caryophyllene:0.35, myrcene:0.30, pinene_a:0.18, guaiol:0.12, fenchol:0.10, humulene_oxide:0 },
    thc:20.5, tier:"mid",
    price:{ g:11, eighth:34, quarter:60, half:110, oz:200 },
    notes:"Dry hop, hay, refined woody finish." },
  { name:"Headband", grower:"Prūf Cultivar", lineage:"OG Kush × Sour Diesel", aroma:"Herbal pine with a peppery, lemony bite.", real:false, illustrative:true,
    values:{ humulene:0.40, caryophyllene:0.45, pinene_a:0.25, fenchol:0.15, myrcene:0.18, guaiol:0.10 },
    thc:21.8, tier:"mid",
    price:{ g:11, eighth:34, quarter:60, half:110, oz:200 },
    notes:"Herbal-pine spine with peppery snap." },

  // TROPICAL/TANGY
  { name:"Pineapple Express", grower:"Archive PDX", lineage:"Trainwreck × Hawaiian", aroma:"Ripe pineapple and mango over a sweet, woody base.", real:false, illustrative:true,
    values:{ ocimene:0.50, terpinolene:0.30, limonene:0.35, caryophyllene:0.20, valencene:0.15, myrcene:0.15, farnesene_b:0.10 },
    thc:22.8, tier:"top",
    price:{ g:13, eighth:40, quarter:72, half:135, oz:250 },
    notes:"Mango-pineapple lift over sweet base." },
  { name:"Maui Wowie", grower:"Resin Ranchers", lineage:"Hawaiian sativa landrace", aroma:"Tropical pineapple and citrus, light and sweet.", real:false, illustrative:true,
    values:{ ocimene:0.42, terpinolene:0.28, limonene:0.30, valencene:0.18, caryophyllene:0.18, myrcene:0.12 },
    thc:21.2, tier:"mid",
    price:{ g:12, eighth:36, quarter:65, half:120, oz:220 },
    notes:"Tropical fruit with a tangy zest finish." },
];

// Pre-classify every strain so the rest of the UI is data-driven
SEED_STRAINS.forEach(s => { s.classification = classify(s.values); });

// Map: profile.key → strains where it's primary, with confidence
function strainsByPrimary(strains, pk) {
  return strains.filter(s => s.classification && s.classification.ranked[0].key === pk);
}
// Map: profile.key → strains where it's strongly present (primary OR top-2 secondary)
function strainsTouching(strains, pk) {
  return strains.filter(s => {
    if (!s.classification) return false;
    const top2 = s.classification.ranked.slice(0, 2);
    return top2.some(r => r.key === pk && r.pct >= 12);
  });
}

// ── helpers: color shade + SVG wedge ──
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r=(n>>16)&255, g=(n>>8)&255, b=n&255;
  if (amt>=0) { r+=(255-r)*amt; g+=(255-g)*amt; b+=(255-b)*amt; }
  else { r*=(1+amt); g*=(1+amt); b*=(1+amt); }
  const h = x => Math.round(Math.max(0,Math.min(255,x))).toString(16).padStart(2,"0");
  return "#"+h(r)+h(g)+h(b);
}
function wedge(cx,cy,ir,or_,sa,ea) {
  const f = v => v.toFixed(2);
  const x1=cx+ir*Math.cos(sa), y1=cy+ir*Math.sin(sa);
  const x2=cx+or_*Math.cos(sa), y2=cy+or_*Math.sin(sa);
  const x3=cx+or_*Math.cos(ea), y3=cy+or_*Math.sin(ea);
  const x4=cx+ir*Math.cos(ea), y4=cy+ir*Math.sin(ea);
  return `M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} A${f(or_)} ${f(or_)} 0 0 1 ${f(x3)} ${f(y3)} L${f(x4)} ${f(y4)} A${f(ir)} ${f(ir)} 0 0 0 ${f(x1)} ${f(y1)} Z`;
}

// ── Fingerprint (Spectrum mode — 10 fixed sectors) ──
function Fingerprint({ classification, size=120, highlight=null }) {
  if (!classification) return <div style={{ width:size, height:size }}/>;
  const cx=size/2, cy=size/2, maxR=size*0.46, minR=size*0.13;
  const n=PROFILES.length, slice=2*Math.PI/n, gap=0.05;
  const pctMap = Object.fromEntries(classification.ranked.map(r => [r.key, r.pct]));
  const maxV = Math.max(...Object.values(pctMap), 1);
  const guides = [0.5, 1.0].map(f => minR + f*(maxR-minR));
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display:"block" }}>
      {guides.map((r,i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#2a2824" strokeWidth={0.5} strokeDasharray="2 4" opacity={0.5}/>)}
      <circle cx={cx} cy={cy} r={maxR} fill="none" stroke="#2a2824" strokeWidth={0.75}/>
      <circle cx={cx} cy={cy} r={minR} fill="none" stroke="#2a2824" strokeWidth={0.5}/>
      {PROFILES.map((p,i) => {
        const v = pctMap[p.key] || 0;
        const has = v > 0.5;
        const r = has ? minR + (v/maxV)*(maxR-minR) : minR + size*0.015;
        const sa = -Math.PI/2 + i*slice + gap/2;
        const ea = -Math.PI/2 + (i+1)*slice - gap/2;
        const dim = highlight && highlight !== p.key;
        return <path key={p.key} d={wedge(cx,cy,minR,r,sa,ea)} fill={p.color} opacity={has ? (dim ? 0.25 : 0.92) : 0.15}/>;
      })}
      <circle cx={cx} cy={cy} r={size*0.025} fill={highlight ? PBK[highlight].color : "#5e5a50"}/>
    </svg>
  );
}

// ── BreakdownBars: top-N profile bars with primary tag ──
function BreakdownBars({ classification, max=5, compact=false }) {
  if (!classification) return null;
  const slice = classification.ranked.slice(0, max);
  const pmax = slice[0].pct || 1;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap: compact ? 3 : 5 }}>
      {slice.map((p,i) => {
        const isPrimary = i === 0;
        return (
          <div key={p.key} style={{ display:"flex", alignItems:"center", gap: 6 }}>
            <span style={{ width:7, height:7, borderRadius:2, background:p.color, flexShrink:0 }}/>
            <span style={{ fontFamily:"var(--body)", fontSize: compact ? 10 : 11, color:"var(--fg-dim)", width: compact ? 84 : 100, flexShrink:0, fontWeight: isPrimary ? 600 : 400 }}>{p.label}</span>
            <div style={{ flex:1, height: compact ? 4 : 6, background:"var(--bg)", borderRadius: 3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(p.pct/pmax)*100}%`, background:p.color, opacity: isPrimary ? 1 : 0.65 }}/>
            </div>
            <span style={{ fontFamily:"var(--mono)", fontSize: compact ? 9 : 10, color: isPrimary ? p.color : "var(--muted)", fontWeight: isPrimary ? 700 : 500, width: 30, textAlign:"right" }}>{p.pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

// ── PROPORTIONAL color band (1–3 colors, widths ∝ profile %) ──
function LabelBand({ classification, orientation="vertical", thickness=null, length=null }) {
  if (!classification) return null;
  const segs = bandSegments(classification);
  const isV = orientation === "vertical";
  const w = isV ? (thickness || 38) : (length || "100%");
  const h = isV ? (length || "100%") : (thickness || 14);
  return (
    <div style={{ width:w, height:h, display:"flex", flexDirection: isV ? "column" : "row", overflow:"hidden" }}>
      {segs.map(s => (
        <div key={s.key} style={{ flex:`${s.frac} 0 0`, background:s.color }}/>
      ))}
    </div>
  );
}

// ── LABEL TEMPLATES (Avery 6464 / shelf / package — preview-sized, print specs noted) ──

const M = "var(--mono)";
const B = "var(--body)";
const D = "var(--display)";

function Tag({ children, color, dark=false }) {
  return (
    <span style={{
      display:"inline-block", padding:"2px 7px", borderRadius:3,
      background:color, color: dark ? "#fff" : "#15130f",
      fontFamily:M, fontSize:8, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase",
    }}>{children}</span>
  );
}

// Jar/Deli Pop Label  2.25" × 1.25"  → 360x200 preview
function JarLabel({ strain }) {
  const c = strain.classification;
  if (!c) return null;
  const p1 = c.ranked[0];
  const tops = topTerpenes(strain.values, 3);
  return (
    <div style={{
      width: 360, height: 200, background:"#f4eee3", color:"#1a1816",
      display:"flex", borderRadius: 4, overflow:"hidden", boxShadow:"0 3px 14px rgba(0,0,0,0.45)",
      border:"1px solid rgba(255,255,255,0.05)",
    }}>
      <LabelBand classification={c} orientation="vertical" thickness={42} />
      <div style={{ flex:1, padding:"12px 14px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:M, fontSize:8, color:"#6b6358", letterSpacing:1.5, textTransform:"uppercase" }}>{p1.label}{c.confidence !== "Defined" ? <span style={{ color: c.ranked[1].color, marginLeft: 4 }}>· {c.ranked[1].label}</span> : ""}</div>
          <div style={{ fontFamily:D, fontSize: 22, fontWeight:700, lineHeight:1.05, marginTop: 2, color:"#15130f" }}>{strain.name}</div>
          <div style={{ fontFamily:B, fontSize:11, fontStyle:"italic", color:"#5e574d", marginTop: 1 }}>{strain.grower}</div>
        </div>
        <div>
          <div style={{ fontFamily:B, fontSize:10, fontStyle:"italic", color:"#3a3530", lineHeight:1.25, marginBottom: 5 }}>{strain.aroma}</div>
          <div style={{ display:"flex", gap: 12, marginBottom: 5, fontFamily:M, fontSize:9, color:"#3a3530" }}>
            <span><strong style={{ color:"#15130f" }}>THC</strong> {strain.thc}%</span>
            <span><strong style={{ color:"#15130f" }}>TERPS</strong> {c.totalTerp.toFixed(2)}%</span>
            <span style={{ marginLeft:"auto", fontFamily:D, fontStyle:"italic", color:"#15130f", fontSize: 13 }}>${strain.price.eighth}<span style={{ fontSize:9, fontFamily:M }}> /8th</span></span>
          </div>
          <div style={{ fontFamily:M, fontSize:7.5, color:"#6b6358", letterSpacing:1, textTransform:"uppercase" }}>Top Terps · {tops.map(t => t.t.label).join(" · ")}</div>
        </div>
      </div>
    </div>
  );
}

// Shelf Tag  1.75" × 1"  → 280x160 preview
function ShelfTag({ strain }) {
  const c = strain.classification;
  if (!c) return null;
  const p1 = c.ranked[0];
  return (
    <div style={{
      width: 280, height: 160, background:"#f4eee3", color:"#1a1816",
      display:"flex", flexDirection:"column", borderRadius: 4, overflow:"hidden", boxShadow:"0 3px 14px rgba(0,0,0,0.45)",
      border:"1px solid rgba(255,255,255,0.05)",
    }}>
      <LabelBand classification={c} orientation="horizontal" thickness={10} />
      <div style={{ flex:1, padding:"10px 12px", display:"flex", flexDirection:"column" }}>
        <div style={{ fontFamily:M, fontSize:8, color:"#6b6358", letterSpacing:1.5, textTransform:"uppercase" }}>{p1.label}</div>
        <div style={{ fontFamily:D, fontSize: 19, fontWeight:700, lineHeight:1.05, marginTop: 2, color:"#15130f" }}>{strain.name}</div>
        <div style={{ fontFamily:B, fontSize:10, fontStyle:"italic", color:"#5e574d" }}>{strain.grower}</div>
        <div style={{ marginTop:"auto", display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <div style={{ fontFamily:M, fontSize:9, color:"#3a3530" }}>
            <span><strong style={{ color:"#15130f" }}>{strain.thc}%</strong> THC</span>
            <span style={{ marginLeft: 8 }}><strong style={{ color:"#15130f" }}>{c.totalTerp.toFixed(1)}%</strong> Terps</span>
          </div>
          <div style={{ fontFamily:D, fontStyle:"italic", fontSize: 22, color:"#15130f", fontWeight:700 }}>${strain.price.eighth}</div>
        </div>
      </div>
    </div>
  );
}

// Package Label  3.5" × 2.25"  → 420x270 preview
function PackageLabel({ strain }) {
  const c = strain.classification;
  if (!c) return null;
  const p1 = c.ranked[0];
  const tops = topTerpenes(strain.values, 4);
  return (
    <div style={{
      width: 420, height: 270, background:"#f4eee3", color:"#1a1816",
      display:"flex", flexDirection:"column", borderRadius: 4, overflow:"hidden", boxShadow:"0 3px 14px rgba(0,0,0,0.45)",
      border:"1px solid rgba(255,255,255,0.05)",
    }}>
      <LabelBand classification={c} orientation="horizontal" thickness={16} />
      <div style={{ flex:1, padding:"14px 16px", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom: 6 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:M, fontSize:8, color:"#6b6358", letterSpacing:1.5, textTransform:"uppercase" }}>
              {p1.label}{c.confidence !== "Defined" ? <span> · {c.ranked[1].label}</span> : ""} <span style={{ color:"#a0998c" }}>· {c.confidence}</span>
            </div>
            <div style={{ fontFamily:D, fontSize: 22, fontWeight:700, lineHeight:1.05, marginTop: 2, color:"#15130f" }}>{strain.name}</div>
            <div style={{ fontFamily:B, fontSize:11, fontStyle:"italic", color:"#5e574d" }}>{strain.grower}</div>
          </div>
          <div style={{ marginLeft: 10 }}><Fingerprint classification={c} size={56} highlight={p1.key}/></div>
        </div>
        <div style={{ marginTop: 4 }}>
          <BreakdownBars classification={c} max={4} compact={true}/>
        </div>
        <div style={{ marginTop:"auto", borderTop:"1px solid #d6cdbb", paddingTop: 7 }}>
          <div style={{ fontFamily:B, fontSize: 10.5, fontStyle:"italic", color:"#3a3530", lineHeight: 1.4, marginBottom: 5 }}>{strain.aroma}</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
            <div style={{ flex:1, paddingRight: 10, minWidth: 0 }}>
              <div style={{ fontFamily:M, fontSize: 7, color:"#6b6358", letterSpacing:1, textTransform:"uppercase", marginBottom: 2 }}>Top Terps</div>
              <div style={{ fontFamily:B, fontSize: 9, color:"#3a3530", lineHeight: 1.4 }}>{tops.map(t => t.t.label).join(" · ")}</div>
            </div>
            <div style={{ display:"flex", gap: 14, fontFamily:M, fontSize:9, color:"#3a3530" }}>
              <span><strong style={{ color:"#15130f" }}>THC</strong> {strain.thc}%</span>
              <span><strong style={{ color:"#15130f" }}>TERPS</strong> {c.totalTerp.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Menu row preview — how the strain reads on a printed shop menu
function MenuRow({ strain, accent=true }) {
  const c = strain.classification;
  if (!c) return null;
  const p1 = c.ranked[0];
  return (
    <div style={{ display:"flex", alignItems:"center", gap: 10, padding:"10px 14px", borderBottom:"1px solid var(--border)", background: accent ? "transparent" : "var(--surface)" }}>
      <LabelBand classification={c} orientation="vertical" thickness={4} length={42} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", alignItems:"baseline", gap: 8 }}>
          <span style={{ fontFamily:D, fontSize: 15, fontWeight:600, color:"var(--fg)" }}>{strain.name}</span>
          <span style={{ fontFamily:B, fontSize: 11, fontStyle:"italic", color:"var(--muted)" }}>{strain.grower}</span>
        </div>
        <div style={{ fontFamily:M, fontSize: 9, color:"var(--muted)", letterSpacing: 0.5, marginTop: 1 }}>
          {p1.label} {p1.pct}%{c.confidence !== "Defined" ? <span> · {c.ranked[1].label} {c.ranked[1].pct}%</span> : ""}
        </div>
      </div>
      <div style={{ fontFamily:M, fontSize: 10, color:"var(--fg-dim)", textAlign:"right", width: 90 }}>
        THC {strain.thc}% · {c.totalTerp.toFixed(1)}%
      </div>
      <div style={{ fontFamily:D, fontSize: 16, color:"var(--fg)", fontWeight:600, width: 50, textAlign:"right" }}>${strain.price.eighth}</div>
    </div>
  );
}

// ── PROFILE DETAIL PANEL — clickable detail with templates ──
function ProfileDetail({ profile, strains, selectedStrain, onPickStrain }) {
  const strainsP = strainsByPrimary(strains, profile.key);
  const strainsT = strainsTouching(strains, profile.key).filter(s => !strainsP.includes(s));
  // For Dessert (no primary), use Touching as "Cultural Examples"
  const showStrains = strainsP.length > 0 ? strainsP : strainsT;
  const fallback = showStrains[0] || strains[0];
  const strain = selectedStrain || fallback;

  return (
    <div style={{ border:"1px solid var(--border)", borderTop:`3px solid ${profile.color}`, borderRadius: "0 0 14px 14px", background:"var(--surface)", overflow:"hidden" }}>
      {/* HEADER */}
      <div style={{ padding:"22px 26px 18px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap: 18 }}>
          <div style={{ width: 78, height: 78, borderRadius: 8, background: profile.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink: 0 }}>
            <span style={{ fontFamily:M, fontSize: 11, color:"#13110c", fontWeight: 800, letterSpacing: 1 }}>{profile.short}</span>
          </div>
          <div style={{ flex:1, minWidth: 0 }}>
            <div style={{ fontFamily:M, fontSize: 9, color: profile.color, letterSpacing: 2.5, textTransform:"uppercase", marginBottom: 4 }}>PROFILE · {String(PROFILES.findIndex(p => p.key === profile.key)+1).padStart(2,"0")} / 10</div>
            <h2 style={{ fontFamily:D, fontSize: 30, fontWeight:700, color:"var(--fg)", margin:"0 0 4px", lineHeight:1.05 }}>{profile.label}</h2>
            <div style={{ fontFamily:D, fontSize: 15, fontStyle:"italic", color:"var(--fg-dim)" }}>{profile.tagline}</div>
          </div>
          {profile.combination && <Tag color="#a08a6a" dark>Combination Profile</Tag>}
        </div>
        <div style={{ fontFamily:B, fontSize: 14, color:"var(--fg-dim)", lineHeight: 1.65, marginTop: 14, maxWidth: 720 }}>{profile.sensory}</div>
        {profile.note && (
          <div style={{ marginTop: 12, padding:"10px 14px", borderLeft: `2px solid ${profile.color}`, background:"var(--bg)", borderRadius:"0 6px 6px 0", fontFamily:B, fontSize: 12.5, color:"var(--muted)", lineHeight: 1.55 }}>{profile.note}</div>
        )}
      </div>

      {/* DRIVERS + FOUND WITH + STRAIN PICKER */}
      <div style={{ padding:"18px 26px", borderBottom:"1px solid var(--border)", display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1.8, textTransform:"uppercase", marginBottom: 8 }}>Driven By</div>
          <div style={{ display:"flex", flexDirection:"column", gap: 5 }}>
            {profile.drivers.map(d => (
              <span key={d} style={{ fontFamily:B, fontSize: 11.5, color:"var(--fg-dim)", padding:"3px 8px", border:`1px solid ${profile.color}50`, borderRadius:4, alignSelf:"flex-start" }}>{d}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1.8, textTransform:"uppercase", marginBottom: 8 }}>Commonly Found With</div>
          <div style={{ display:"flex", flexDirection:"column", gap: 5 }}>
            {profile.foundWith.map(k => (
              <span key={k} style={{ display:"flex", alignItems:"center", gap: 7, fontFamily:M, fontSize: 10.5, color:"var(--fg-dim)" }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background: PBK[k].color, flexShrink: 0 }}/>{PBK[k].label}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1.8, textTransform:"uppercase", marginBottom: 8 }}>{strainsP.length > 0 ? "Classified Examples" : "Cultural Examples"}{showStrains.length > 1 ? ` · pick one` : ""}</div>
          <div style={{ display:"flex", flexDirection:"column", gap: 4 }}>
            {showStrains.map(s => {
              const isOn = s.name === strain.name;
              return (
                <button key={s.name} onClick={() => onPickStrain(s)} style={{
                  padding:"6px 10px", border:`1px solid ${isOn ? profile.color : "var(--border)"}`, borderRadius: 5, cursor:"pointer",
                  background: isOn ? `${profile.color}1f` : "transparent", color: isOn ? "var(--fg)" : "var(--fg-dim)",
                  textAlign:"left", display:"flex", alignItems:"center", justifyContent:"space-between", gap: 6, transition:"all 0.18s",
                }}>
                  <span style={{ fontFamily:B, fontSize: 12 }}>{s.name}</span>
                  <span style={{ fontFamily:M, fontSize: 8, color: s.real ? "#6B8E5A" : "#a08a6a" }}>{s.real ? "REAL COA" : "ILLUSTR."}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TEMPLATES — three labels at scale + menu row */}
      <div style={{ padding:"22px 26px", borderBottom:"1px solid var(--border)" }}>
        <div style={{ display:"flex", alignItems:"baseline", justifyContent:"space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1.8, textTransform:"uppercase", marginBottom: 3 }}>Print Templates · Avery 6464</div>
            <div style={{ fontFamily:D, fontSize: 17, color:"var(--fg)", fontWeight: 600 }}>How <em>{strain.name}</em> reads in print</div>
          </div>
          <div style={{ fontFamily:M, fontSize: 9, color:"var(--muted)" }}>Confidence: <span style={{ color:"var(--fg-dim)" }}>{strain.classification.confidence}</span> · Band: <span style={{ color: strain.classification.ranked[0].color }}>{strain.classification.confidence === "Defined" ? "solid" : strain.classification.confidence === "Leaning" ? "primary + accent" : "split 60/40"}</span></div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap: 24, justifyContent:"center" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap: 8 }}>
            <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 1.5, textTransform:"uppercase" }}>A · Jar / Deli Pop · 2.25 × 1.25 in</div>
            <JarLabel strain={strain} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap: 8 }}>
            <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 1.5, textTransform:"uppercase" }}>B · Shelf Tag · 1.75 × 1 in</div>
            <ShelfTag strain={strain} />
          </div>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap: 8 }}>
            <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 1.5, textTransform:"uppercase" }}>C · Package Label · 3.5 × 2.25 in</div>
            <PackageLabel strain={strain} />
          </div>
        </div>
      </div>

      {/* MENU ROW */}
      <div style={{ padding:"22px 26px" }}>
        <div style={{ fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1.8, textTransform:"uppercase", marginBottom: 10 }}>Printed Menu Row</div>
        <div style={{ border:"1px solid var(--border)", borderRadius: 6, overflow:"hidden", background:"var(--bg)" }}>
          <MenuRow strain={strain} />
        </div>
      </div>
    </div>
  );
}

// ── FULL SPECTRUM MENU TEMPLATE — grouped, with key + lineage + g/8th price ──
function SpectrumMenu({ strains, showKey=true, sortKey="default", groupBy="profile" }) {
  const grouped = buildGroups(strains, groupBy, sortKey);
  const usedProfiles = PROFILES.filter(p => strains.some(s => s.classification && bandSegments(s.classification).some(seg => seg.key === p.key)));
  return (
    <div className="fs-print-sheet" style={{ background:"#f4eee3", color:"#1a1816", borderRadius: 10, overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.5)" }}>
      {/* menu header */}
      <div style={{ padding:"28px 32px 18px", borderBottom:"2px solid #1a1816" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap: 20 }}>
          <div>
            <div style={{ display:"flex", gap: 3, marginBottom: 10 }}>{PROFILES.map(p => <span key={p.key} style={{ width:7, height:20, background:p.color }}/>)}</div>
            <h2 style={{ fontFamily:D, fontSize: 34, fontWeight:700, margin:0, color:"#15130f", lineHeight:1 }}>Flower, by Aroma</h2>
            <div style={{ fontFamily:B, fontSize: 13, fontStyle:"italic", color:"#5e574d", marginTop: 4 }}>Organized by terpene profile, not indica/sativa. The nose knows — now with the science to back it.</div>
          </div>
          <div style={{ textAlign:"right", fontFamily:M, fontSize: 9, color:"#6b6358", letterSpacing: 1 }}>FLOWER SPECTRUM<br/>SYSTEM</div>
        </div>
        {/* KEY / LEGEND */}
        {showKey && (
          <div style={{ marginTop: 16, paddingTop: 14, borderTop:"1px solid #d6cdbb" }}>
            <div style={{ fontFamily:M, fontSize: 8, color:"#6b6358", letterSpacing: 1.5, textTransform:"uppercase", marginBottom: 7 }}>Color Key · Aroma Profile</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 16px" }}>
              {usedProfiles.map(p => (
                <span key={p.key} style={{ display:"flex", alignItems:"center", gap: 6, fontFamily:M, fontSize: 9.5, color:"#3a3530" }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: p.color }}/>{p.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* groups */}
      <div style={{ padding:"6px 0 16px" }}>
        {grouped.map(g => (
          <div key={g.key} className="fs-group" style={{ marginTop: 8 }}>
            <div style={{ display:"flex", alignItems:"center", gap: 10, padding:"8px 32px", background: `${g.color}1a` }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: g.color }}/>
              <span style={{ fontFamily:M, fontSize: 11, fontWeight:700, letterSpacing: 2, textTransform:"uppercase", color:"#15130f" }}>{g.label}</span>
              {g.tagline && <span style={{ fontFamily:B, fontSize: 11, fontStyle:"italic", color:"#6b6358" }}>— {g.tagline}</span>}
            </div>
            {g.strains.map(s => {
              const c = s.classification;
              const blend = c.confidence !== "Defined" ? blendName(c) : null;
              return (
                <div key={s.name} className="fs-row" style={{ display:"flex", alignItems:"center", gap: 12, padding:"9px 32px", borderBottom:"1px solid #e2d9c8" }}>
                  <div style={{ width: 4, alignSelf:"stretch", display:"flex", flexDirection:"column", flexShrink: 0 }}>
                    {bandSegments(c).map(seg => <div key={seg.key} style={{ flex:`${seg.frac} 0 0`, background:seg.color }}/>)}
                  </div>
                  <div style={{ flex:1, minWidth: 0 }}>
                    <div style={{ display:"flex", alignItems:"baseline", gap: 8, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:D, fontSize: 15, fontWeight:600, color:"#15130f" }}>{s.name}</span>
                      <span style={{ fontFamily:B, fontSize: 11, fontStyle:"italic", color:"#6b6358" }}>{s.grower}</span>
                      {blend && <span style={{ fontFamily:M, fontSize: 8, color: c.ranked[1].color, fontWeight:700, letterSpacing: 0.5 }}>{blend.toUpperCase()}</span>}
                    </div>
                    <div style={{ fontFamily:M, fontSize: 8.5, color:"#8a8170", letterSpacing: 0.3, marginTop: 1 }}>{s.lineage}</div>
                    <div style={{ fontFamily:B, fontSize: 11, color:"#5e574d", marginTop: 2 }}>{s.aroma}</div>
                  </div>
                  <div style={{ fontFamily:M, fontSize: 9.5, color:"#3a3530", textAlign:"right", width: 84, flexShrink: 0 }}>
                    <div><strong>{s.thc}%</strong> THC</div>
                    <div style={{ color:"#6b6358" }}>{c.totalTerp.toFixed(1)}% terps</div>
                  </div>
                  <div style={{ textAlign:"right", width: 78, flexShrink: 0, fontFamily:D, color:"#15130f" }}>
                    <div style={{ fontSize: 18, fontWeight:700, lineHeight: 1 }}>${s.price.eighth}<span style={{ fontFamily:M, fontSize: 8, fontWeight:400, color:"#6b6358" }}> /8th</span></div>
                    <div style={{ fontSize: 12, fontWeight:600, color:"#5e574d", marginTop: 1 }}>${s.price.g}<span style={{ fontFamily:M, fontSize: 8, fontWeight:400, color:"#6b6358" }}> /g</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ padding:"12px 32px", borderTop:"2px solid #1a1816", display:"flex", justifyContent:"space-between", fontFamily:M, fontSize: 8.5, color:"#6b6358", letterSpacing: 1 }}>
        <span>PRICES TAX INCLUDED · COLOR BAND ∝ TERPENE PROFILE</span>
        <span>AROMA CLASSIFICATION · NOT EFFECTS OR MEDICAL CLAIMS</span>
      </div>
    </div>
  );
}

// ── STAFF PICKS MENU — premium fingerprint showcase ──
function StaffPicksMenu({ strains, sortKey="default" }) {
  const picks = sortStrains(strains.filter(s => s.staffPick), sortKey);
  return (
    <div className="fs-print-sheet" style={{ background:"#15130f", border:"1px solid #2a2824", borderRadius: 10, overflow:"hidden" }}>
      <div style={{ padding:"28px 32px 18px", borderBottom:"1px solid #2a2824", textAlign:"center" }}>
        <div style={{ fontFamily:M, fontSize: 10, letterSpacing: 4, textTransform:"uppercase", color:"var(--accent)", marginBottom: 8 }}>The Spectrum Selects</div>
        <h2 style={{ fontFamily:D, fontSize: 32, fontWeight:700, margin:0, color:"var(--fg)", lineHeight:1.05 }}>Staff Picks</h2>
        <div style={{ fontFamily:B, fontSize: 13, fontStyle:"italic", color:"var(--fg-dim)", marginTop: 6, maxWidth: 480, marginLeft:"auto", marginRight:"auto" }}>The jars we'd spend our own money on. Each one terpene-tested, classified, and chosen by a person who works the floor.</div>
      </div>
      <div style={{ padding:"10px" }}>
        {picks.map(s => {
          const c = s.classification;
          const p1 = c.ranked[0];
          const tops = topTerpenes(s.values, 4);
          return (
            <div key={s.name} className="fs-pick" style={{ display:"flex", gap: 20, padding:"20px", borderBottom:"1px solid #2a2824", alignItems:"center" }}>
              {/* fingerprint */}
              <div style={{ flexShrink: 0, display:"flex", flexDirection:"column", alignItems:"center", gap: 6 }}>
                <Fingerprint classification={c} size={104} highlight={p1.key}/>
                <span style={{ fontFamily:M, fontSize: 8, color: p1.color, letterSpacing: 1, textTransform:"uppercase" }}>{blendName(c)}</span>
              </div>
              {/* center */}
              <div style={{ flex:1, minWidth: 0 }}>
                <div style={{ display:"flex", alignItems:"baseline", gap: 10, flexWrap:"wrap" }}>
                  <span style={{ fontFamily:D, fontSize: 23, fontWeight:700, color:"var(--fg)" }}>{s.name}</span>
                  <span style={{ fontFamily:B, fontSize: 12, fontStyle:"italic", color:"var(--muted)" }}>{s.grower}</span>
                  {s.real && <Tag color="#6B8E5A" dark>Lab-Verified</Tag>}
                </div>
                <div style={{ fontFamily:M, fontSize: 9, color:"var(--muted)", letterSpacing: 0.3, marginTop: 3 }}>{s.lineage}</div>
                <div style={{ display:"flex", gap: 14, margin:"7px 0 10px", fontFamily:M, fontSize: 10, color:"var(--fg-dim)" }}>
                  <span><strong style={{ color:"var(--fg)" }}>{s.thc}%</strong> THC</span>
                  <span><strong style={{ color:"var(--fg)" }}>{c.totalTerp.toFixed(2)}%</strong> TERPS</span>
                  <span style={{ color: c.confidence !== "Defined" ? p1.color : "var(--muted)" }}>{c.confidence !== "Defined" ? blendName(c) + " blend" : c.confidence}</span>
                </div>
                <div style={{ display:"flex", alignItems:"flex-start", gap: 8, padding:"10px 14px", background:"#1d1a15", borderLeft:`2px solid ${PICK(s)}`, borderRadius:"0 6px 6px 0" }}>
                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius:"50%", background:"#2a2620", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:D, fontSize: 13, fontWeight:700, color:"var(--accent)" }}>{s.staffPick.by[0]}</div>
                  <div>
                    <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 1, textTransform:"uppercase", marginBottom: 2 }}>{s.staffPick.by}'s pick</div>
                    <div style={{ fontFamily:B, fontSize: 12.5, fontStyle:"italic", color:"var(--fg-dim)", lineHeight: 1.5 }}>"{s.staffPick.quote}"</div>
                  </div>
                </div>
                <div style={{ fontFamily:B, fontSize: 12, fontStyle:"italic", color:"var(--fg-dim)", marginTop: 9 }}>{s.aroma}</div>
                <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 0.8, textTransform:"uppercase", marginTop: 4 }}>Top Terps · {tops.map(t => t.t.label).join(" · ")}</div>
              </div>
              {/* price */}
              <div style={{ flexShrink: 0, textAlign:"right" }}>
                <div style={{ fontFamily:D, fontSize: 30, fontWeight:700, color:"var(--fg)", lineHeight:1 }}>${s.price.eighth}</div>
                <div style={{ fontFamily:M, fontSize: 8, color:"var(--muted)", letterSpacing: 1 }}>PER EIGHTH</div>
                <div style={{ fontFamily:M, fontSize: 9, color:"var(--fg-dim)", marginTop: 6 }}>${s.price.g}/g</div>
                <div style={{ fontFamily:M, fontSize: 9, color:"var(--fg-dim)" }}>${s.price.oz}/oz</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding:"12px 32px", textAlign:"center", fontFamily:M, fontSize: 8.5, color:"var(--muted)", letterSpacing: 1 }}>
        TERPENE-TESTED CRAFT FLOWER · AROMA CLASSIFICATION, NOT EFFECTS · FLOWER SPECTRUM SYSTEM
      </div>
    </div>
  );
}
function PICK(s){ return s.classification.ranked[0].color; }

// ── CSV EXPORT MODAL (data-URI + real anchor; sandbox-safe) ──
function CsvModal({ csv, filename, onClose }) {
  if (!csv) return null;
  const href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex: 200, padding: 20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius: 12, padding: 24, maxWidth: 520, width:"100%" }}>
        <div style={{ fontFamily:"var(--display)", fontSize: 20, fontWeight:700, color:"var(--fg)", marginBottom: 6 }}>Export CSV</div>
        <div style={{ fontFamily:"var(--body)", fontSize: 13, color:"var(--fg-dim)", lineHeight: 1.5, marginBottom: 16 }}>This is the column format the importer will expect later. Right-click → Save Link As, or tap to open.</div>
        <a href={href} download={filename} style={{ display:"inline-block", padding:"11px 20px", background:"var(--accent)", color:"#0e0e0c", borderRadius: 8, fontFamily:"var(--mono)", fontSize: 12, fontWeight:700, letterSpacing: 1, textTransform:"uppercase", textDecoration:"none" }}>↓ Download {filename}</a>
        <button onClick={onClose} style={{ marginLeft: 10, padding:"11px 18px", background:"transparent", border:"1px solid var(--border)", color:"var(--fg-dim)", borderRadius: 8, fontFamily:"var(--mono)", fontSize: 12, cursor:"pointer" }}>Close</button>
        <pre style={{ marginTop: 16, padding: 12, background:"var(--bg)", border:"1px solid var(--border)", borderRadius: 8, fontFamily:"var(--mono)", fontSize: 9.5, color:"var(--muted)", maxHeight: 160, overflow:"auto", whiteSpace:"pre" }}>{csv.split("\n").slice(0, 6).join("\n")}{"\n…"}</pre>
      </div>
    </div>
  );
}

// ── DATA PANEL — sort / group / edit backend / export ──
const EDIT_FIELDS = [
  { key:"name", label:"Strain", w:150 },
  { key:"grower", label:"Grower", w:130 },
  { key:"lineage", label:"Lineage", w:200 },
  { key:"thc", label:"THC%", w:60, num:true },
  { key:"price.g", label:"$/g", w:55, num:true },
  { key:"price.eighth", label:"$/8th", w:60, num:true },
  { key:"tier", label:"Tier", w:70 },
];
function getField(s, path) { return path.split(".").reduce((o,k)=>o?.[k], s); }
function setField(s, path, val) {
  const copy = JSON.parse(JSON.stringify(s));
  const parts = path.split("."); let o = copy;
  for (let i=0;i<parts.length-1;i++) o = o[parts[i]];
  o[parts[parts.length-1]] = val;
  return copy;
}

function DataPanel({ strains, scope, onEdit, onExport, sortKey, setSortKey, groupBy, setGroupBy, showKey, setShowKey, showGrouping }) {
  return (
    <div style={{ border:"1px solid var(--border)", borderRadius: 12, background:"var(--surface)", marginBottom: 22, overflow:"hidden" }}>
      <div style={{ padding:"14px 18px", borderBottom:"1px solid var(--border)", display:"flex", flexWrap:"wrap", gap: 14, alignItems:"center" }}>
        <span style={{ fontFamily:"var(--mono)", fontSize: 10, color:"var(--accent)", letterSpacing: 2, textTransform:"uppercase" }}>Data Backend · {scope}</span>
        <label style={{ display:"flex", alignItems:"center", gap: 6, fontFamily:"var(--mono)", fontSize: 10, color:"var(--fg-dim)", textTransform:"uppercase", letterSpacing: 0.5 }}>
          Sort
          <select value={sortKey} onChange={e=>setSortKey(e.target.value)} style={selStyle}>
            {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
          </select>
        </label>
        {showGrouping && (
          <label style={{ display:"flex", alignItems:"center", gap: 6, fontFamily:"var(--mono)", fontSize: 10, color:"var(--fg-dim)", textTransform:"uppercase", letterSpacing: 0.5 }}>
            Group
            <select value={groupBy} onChange={e=>setGroupBy(e.target.value)} style={selStyle}>
              {GROUP_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </label>
        )}
        {setShowKey && (
          <label style={{ display:"flex", alignItems:"center", gap: 6, fontFamily:"var(--mono)", fontSize: 10, color:"var(--fg-dim)", textTransform:"uppercase", letterSpacing: 0.5, cursor:"pointer" }}>
            <input type="checkbox" checked={showKey} onChange={e=>setShowKey(e.target.checked)} /> Color Key
          </label>
        )}
        <div style={{ marginLeft:"auto", display:"flex", gap: 8 }}>
          <button onClick={onExport} style={btnStyle}>↓ Export CSV</button>
          <button onClick={() => window.print()} style={btnStyle}>⎙ Print</button>
        </div>
      </div>
      {/* editable table */}
      <div style={{ overflowX:"auto", maxHeight: 280, overflowY:"auto" }}>
        <table style={{ borderCollapse:"collapse", width:"100%", minWidth: 720 }}>
          <thead>
            <tr>
              {EDIT_FIELDS.map(f => <th key={f.key} style={thStyle}>{f.label}</th>)}
              <th style={thStyle}>Profile (auto)</th>
            </tr>
          </thead>
          <tbody>
            {strains.map((s, i) => (
              <tr key={i} style={{ borderBottom:"1px solid var(--border)" }}>
                {EDIT_FIELDS.map(f => (
                  <td key={f.key} style={tdStyle}>
                    <input
                      value={getField(s, f.key) ?? ""}
                      onChange={e => onEdit(i, f.key, f.num ? (parseFloat(e.target.value)||0) : e.target.value)}
                      style={{ width: f.w, background:"transparent", border:"1px solid transparent", color:"var(--fg-dim)", fontFamily:"var(--body)", fontSize: 11, padding:"3px 5px", borderRadius: 4 }}
                      onFocus={e=>e.target.style.border="1px solid var(--accent)"}
                      onBlur={e=>e.target.style.border="1px solid transparent"}
                    />
                  </td>
                ))}
                <td style={tdStyle}>
                  <span style={{ display:"flex", alignItems:"center", gap: 5, fontFamily:"var(--mono)", fontSize: 10, color:"var(--muted)" }}>
                    <span style={{ width:8, height:8, borderRadius:2, background: s.classification.ranked[0].color }}/>
                    {blendName(s.classification)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding:"8px 18px", fontFamily:"var(--mono)", fontSize: 9, color:"var(--muted)", letterSpacing: 0.5 }}>
        {strains.length} rows · Profile is auto-derived from terpene data (edit terpenes via COA import — coming later)
      </div>
    </div>
  );
}
const selStyle = { background:"var(--bg)", border:"1px solid var(--border)", color:"var(--fg)", fontFamily:"var(--mono)", fontSize: 10, padding:"4px 6px", borderRadius: 5 };
const btnStyle = { background:"var(--accent)", color:"#0e0e0c", border:"none", padding:"7px 13px", borderRadius: 6, fontFamily:"var(--mono)", fontSize: 10, fontWeight:700, letterSpacing: 0.5, textTransform:"uppercase", cursor:"pointer" };
const thStyle = { textAlign:"left", fontFamily:"var(--mono)", fontSize: 8, color:"var(--muted)", letterSpacing: 1, textTransform:"uppercase", padding:"8px 6px", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--surface)", whiteSpace:"nowrap" };
const tdStyle = { padding:"2px 4px", verticalAlign:"middle" };

// ── APP ──
export default function App() {
  const [view, setView] = useState("explorer");
  const [activeKey, setActiveKey] = useState(PROFILES[0].key);
  const [pickedStrain, setPickedStrain] = useState(null);
  const [rawStrains, setRawStrains] = useState(SEED_STRAINS);
  const [sortKey, setSortKey] = useState("default");
  const [groupBy, setGroupBy] = useState("profile");
  const [showKey, setShowKey] = useState(true);
  const [showData, setShowData] = useState(false);
  const [csv, setCsv] = useState(null);

  // classification is derived from terpene values (stable; metadata edits don't change it)
  const strains = useMemo(() => rawStrains.map(s => ({ ...s, classification: classify(s.values) })), [rawStrains]);
  const activeProfile = PBK[activeKey];

  const selectProfile = useCallback((k) => { setActiveKey(k); setPickedStrain(null); }, []);
  const editStrain = useCallback((i, field, val) => {
    setRawStrains(prev => prev.map((s, idx) => idx === i ? setField(s, field, val) : s));
  }, []);
  const exportCSV = useCallback((scope, list) => {
    setCsv({ text: strainsToCSV(list, scope), name: `flower-spectrum-${scope.toLowerCase().replace(/[^a-z]+/g,"-")}-${BUILD}.csv` });
  }, []);

  const flowerStrains = strains; // all are flower in this dataset
  const pickStrains = strains.filter(s => s.staffPick);
  const scopeList = view === "staffPicks" ? pickStrains : flowerStrains;
  const scopeName = view === "explorer" ? "Profile Explorer" : view === "spectrumMenu" ? "Spectrum Menu" : "Staff Picks";

  return (
    <div style={{
      "--bg":"#0e0e0c", "--surface":"#181715", "--border":"#2a2824",
      "--fg":"#e8e3d9", "--fg-dim":"#a8a092", "--muted":"#6e675b", "--accent":"#6AAFA0",
      "--display":"'Newsreader',Georgia,serif", "--body":"'DM Sans',system-ui,sans-serif", "--mono":"'JetBrains Mono',monospace",
      minHeight:"100vh", background:"var(--bg)", color:"var(--fg)", fontFamily:"var(--body)",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700;800&display=swap');*{box-sizing:border-box}button{font:inherit}
        @media print {
          .fs-no-print { display:none !important; }
          .fs-print-sheet { box-shadow:none !important; border-radius:0 !important; }
          .fs-group, .fs-row, .fs-pick { break-inside:avoid; page-break-inside:avoid; }
          @page { size: letter; margin: 0.4in; }
          body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        }`}</style>

      <CsvModal csv={csv?.text} filename={csv?.name} onClose={() => setCsv(null)} />

      {/* NAV */}
      <nav className="fs-no-print" style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px clamp(16px,4vw,40px)", borderBottom:"1px solid var(--border)", position:"sticky", top:0, background:"var(--bg)", zIndex: 50 }}>
        <div style={{ display:"flex", alignItems:"center", gap: 11 }}>
          <div style={{ display:"flex", gap: 2 }}>{PROFILES.slice(0,6).map(p => <span key={p.key} style={{ width:5, height:16, background:p.color, borderRadius:1 }}/>)}</div>
          <span style={{ fontFamily:"var(--mono)", fontSize: 11, letterSpacing: 2, textTransform:"uppercase", color:"var(--fg-dim)" }}>Flower Spectrum</span>
        </div>
        <span style={{ fontFamily:"var(--mono)", fontSize: 10, color:"var(--muted)", letterSpacing: 1 }}>Explorer + Menus · {VERSION}</span>
      </nav>

      {/* VIEW TABS */}
      <div className="fs-no-print" style={{ display:"flex", gap: 4, padding:"16px clamp(16px,4vw,40px) 0", flexWrap:"wrap", alignItems:"center" }}>
        {[["explorer","Profile Explorer"],["spectrumMenu","Spectrum Menu"],["staffPicks","Staff Picks Menu"]].map(([k,label]) => (
          <button key={k} onClick={() => setView(k)} style={{
            padding:"10px 18px", border:`1px solid ${view===k ? "var(--accent)" : "var(--border)"}`, borderBottom: view===k ? "1px solid var(--bg)" : "1px solid var(--border)",
            borderRadius:"8px 8px 0 0", cursor:"pointer", marginBottom: -1,
            background: view===k ? "var(--surface)" : "transparent", color: view===k ? "var(--fg)" : "var(--muted)",
            fontFamily:"var(--mono)", fontSize: 11, letterSpacing: 1, textTransform:"uppercase", transition:"all 0.18s",
          }}>{label}</button>
        ))}
        <button onClick={() => setShowData(v=>!v)} style={{
          marginLeft:"auto", padding:"8px 14px", border:`1px solid ${showData ? "var(--accent)" : "var(--border)"}`, borderRadius: 8, cursor:"pointer",
          background: showData ? "var(--accent)" : "transparent", color: showData ? "#0e0e0c" : "var(--fg-dim)",
          fontFamily:"var(--mono)", fontSize: 10, letterSpacing: 1, textTransform:"uppercase", fontWeight: showData ? 700 : 400,
        }}>⚙ Data {showData ? "▲" : "▼"}</button>
      </div>
      <div className="fs-no-print" style={{ borderTop:"1px solid var(--border)", marginTop: -1 }}/>

      <div style={{ maxWidth: 1080, margin:"0 auto", padding:"0 clamp(16px,4vw,40px) 80px" }}>

        {/* DATA PANEL (shared, scoped to current view) */}
        {showData && (
          <div className="fs-no-print" style={{ paddingTop: 22 }}>
            <DataPanel
              strains={scopeList} scope={scopeName}
              onEdit={editStrain}
              onExport={() => exportCSV(scopeName, scopeList)}
              sortKey={sortKey} setSortKey={setSortKey}
              groupBy={groupBy} setGroupBy={setGroupBy}
              showKey={showKey} setShowKey={view==="spectrumMenu" ? setShowKey : null}
              showGrouping={view==="spectrumMenu"}
            />
          </div>
        )}

        {view === "explorer" && (
          <div style={{ paddingTop: 28 }}>
            <div className="fs-no-print" style={{ marginBottom: 22 }}>
              <div style={{ fontFamily:"var(--mono)", fontSize: 10, color:"var(--accent)", letterSpacing: 3, textTransform:"uppercase", marginBottom: 10 }}>Click a profile to explore</div>
              <h1 style={{ fontFamily:"var(--display)", fontSize:"clamp(26px,5vw,40px)", fontWeight:600, color:"var(--fg)", margin:"0 0 6px", lineHeight:1.1 }}>Ten aromas. Every label and menu, built from one system.</h1>
              <p style={{ fontFamily:"var(--body)", fontSize: 14, color:"var(--fg-dim)", margin: 0, fontStyle:"italic" }}>The nose knows — this is just the science catching up to what people have always known.</p>
            </div>

            <div className="fs-no-print" style={{ display:"flex", flexWrap:"wrap", gap: 7 }}>
              {PROFILES.map(p => {
                const on = activeKey === p.key;
                return (
                  <button key={p.key} onClick={() => selectProfile(p.key)} style={{
                    display:"flex", alignItems:"center", gap: 8, padding:"9px 14px", cursor:"pointer",
                    background: on ? `${p.color}22` : "var(--surface)",
                    border:`1px solid ${on ? p.color : "var(--border)"}`,
                    borderBottom: on ? `1px solid ${p.color}` : "1px solid var(--border)",
                    borderRadius: on ? "8px 8px 0 0" : 8, transition:"all 0.18s",
                  }}>
                    <span style={{ width: 11, height: 11, borderRadius: 3, background: p.color }}/>
                    <span style={{ fontFamily:"var(--mono)", fontSize: 11, color: on ? "var(--fg)" : "var(--fg-dim)", letterSpacing: 0.5, whiteSpace:"nowrap" }}>{p.label}</span>
                  </button>
                );
              })}
            </div>

            <ProfileDetail profile={activeProfile} strains={strains} selectedStrain={pickedStrain} onPickStrain={setPickedStrain} />
          </div>
        )}

        {view === "spectrumMenu" && (
          <div style={{ paddingTop: 28 }}>
            <div className="fs-no-print" style={{ marginBottom: 18 }}>
              <div style={{ fontFamily:"var(--mono)", fontSize: 10, color:"var(--accent)", letterSpacing: 3, textTransform:"uppercase", marginBottom: 10 }}>Print Template · Full Shop Menu</div>
              <h1 style={{ fontFamily:"var(--display)", fontSize:"clamp(24px,5vw,36px)", fontWeight:600, color:"var(--fg)", margin:"0 0 6px", lineHeight:1.1 }}>The Spectrum Menu</h1>
              <p style={{ fontFamily:"var(--body)", fontSize: 15, color:"var(--fg-dim)", lineHeight: 1.6, maxWidth: 620, margin: 0 }}>Grouped by aroma, with lineage, gram &amp; eighth pricing, and a color key. Use the Data panel to sort, group, export the CSV, or print to letter.</p>
            </div>
            <SpectrumMenu strains={flowerStrains} showKey={showKey} sortKey={sortKey} groupBy={groupBy} />
          </div>
        )}

        {view === "staffPicks" && (
          <div style={{ paddingTop: 28 }}>
            <div className="fs-no-print" style={{ marginBottom: 18 }}>
              <div style={{ fontFamily:"var(--mono)", fontSize: 10, color:"var(--accent)", letterSpacing: 3, textTransform:"uppercase", marginBottom: 10 }}>Print Template · Premium Showcase</div>
              <h1 style={{ fontFamily:"var(--display)", fontSize:"clamp(24px,5vw,36px)", fontWeight:600, color:"var(--fg)", margin:"0 0 6px", lineHeight:1.1 }}>The Staff Picks Menu</h1>
              <p style={{ fontFamily:"var(--body)", fontSize: 15, color:"var(--fg-dim)", lineHeight: 1.6, maxWidth: 620, margin: 0 }}>Fingerprint-forward and story-driven, with honest blend names for flower that straddles two profiles. Built to justify a premium price by showing the work behind the flower.</p>
            </div>
            <StaffPicksMenu strains={flowerStrains} sortKey={sortKey} />
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="fs-no-print" style={{ borderTop:"1px solid var(--border)", padding:"20px clamp(16px,4vw,40px)", textAlign:"center" }}>
        <div style={{ fontFamily:"var(--mono)", fontSize: 9, color:"var(--muted)", letterSpacing: 2, textTransform:"uppercase" }}>Flower Spectrum · Profile Explorer + Menus · {VERSION} · {BUILD}</div>
        <div style={{ fontFamily:"var(--body)", fontSize: 11, color:"var(--muted)", marginTop: 5 }}>CannaCre8ive · Aroma classification, not effects or medical claims · cannacre8ive.com</div>
      </div>
    </div>
  );
}
