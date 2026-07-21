import React, { useRef, useState } from "react";
import { toBlob } from "html-to-image";

const PROFILE_ORDER = [
  ["gas_fuel", "#C9A84C"], ["earthy_dank", "#6B8E5A"],
  ["citrus_bright", "#D4A843"], ["fruity_sweet", "#B75F4A"],
  ["floral_soft", "#B98BBE"], ["dessert_creamy", "#D6B58A"],
  ["spicy_warm", "#9E6B4A"], ["piney_fresh", "#4F7A5B"],
  ["herbal_woody", "#7FA688"], ["tropical_tangy", "#D28B49"],
];

function wedge(cx, cy, inner, outer, start, end) {
  const f = (value) => value.toFixed(2);
  const points = [
    [cx + inner * Math.cos(start), cy + inner * Math.sin(start)],
    [cx + outer * Math.cos(start), cy + outer * Math.sin(start)],
    [cx + outer * Math.cos(end), cy + outer * Math.sin(end)],
    [cx + inner * Math.cos(end), cy + inner * Math.sin(end)],
  ];
  return `M${f(points[0][0])} ${f(points[0][1])} L${f(points[1][0])} ${f(points[1][1])} A${f(outer)} ${f(outer)} 0 0 1 ${f(points[2][0])} ${f(points[2][1])} L${f(points[3][0])} ${f(points[3][1])} A${f(inner)} ${f(inner)} 0 0 0 ${f(points[0][0])} ${f(points[0][1])} Z`;
}

function Fingerprint({ scores = [] }) {
  const scoreMap = Object.fromEntries(scores.map((score) => [score.key, score.pct]));
  const max = Math.max(...Object.values(scoreMap), 1);
  const lead = scores[0]?.key;
  const slice = (Math.PI * 2) / 10;
  return (
    <svg viewBox="0 0 260 260" role="img" aria-label="Ten-sector Flower Spectrum fingerprint">
      <circle cx="130" cy="130" r="76.7" fill="none" stroke="#2a2824" strokeDasharray="2 4" />
      <circle cx="130" cy="130" r="119.6" fill="none" stroke="#2a2824" />
      {PROFILE_ORDER.map(([key, color], index) => {
        const pct = scoreMap[key] || 0;
        const outer = pct > 0.5 ? 33.8 + (pct / max) * 85.8 : 37.7;
        const start = -Math.PI / 2 + index * slice + 0.025;
        const end = -Math.PI / 2 + (index + 1) * slice - 0.025;
        return <path key={key} d={wedge(130, 130, 33.8, outer, start, end)} fill={color} opacity={pct > 0.5 ? (key === lead ? 0.92 : 0.22) : 0.14} />;
      })}
      <circle cx="130" cy="130" r="7.28" fill={PROFILE_ORDER.find(([key]) => key === lead)?.[1] || "#6e675b"} />
    </svg>
  );
}

export default function FlowerSpectrumStrainCard({ strain }) {
  const cardRef = useRef(null);
  const [busy, setBusy] = useState(false);

  async function exportPng(share = false) {
    setBusy(true);
    try {
      const blob = await toBlob(cardRef.current, { width: 1080, height: 1350, pixelRatio: 1, cacheBust: true, skipFonts: true });
      const filename = `flower-spectrum-${strain.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      const file = new File([blob], filename, { type: "image/png" });
      if (share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: `${strain.name} · Flower Spectrum`, text: strain.aroma });
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <section style={{ fontFamily: "DM Sans, sans-serif", color: "#e8e3d9" }}>
      <div ref={cardRef} style={{ width: 1080, height: 1350, padding: "64px 68px 54px", background: "#151512", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: "#6AAFA0", font: "700 14px JetBrains Mono", letterSpacing: ".2em", textTransform: "uppercase" }}><span>Available Flower · Buyer Preview</span><span>Flower Spectrum</span></div>
        <div style={{ marginTop: 58 }}><h1 style={{ margin: 0, font: "600 106px/.88 Newsreader", letterSpacing: "-.045em" }}>{strain.name}</h1><p style={{ color: "#a8a092", font: "700 15px JetBrains Mono", letterSpacing: ".15em", textTransform: "uppercase" }}>{strain.lineage}</p><strong style={{ color: strain.segments[0]?.color, font: "700 20px JetBrains Mono", textTransform: "uppercase" }}>{strain.blend} · {strain.confidence || strain.c?.confidence}</strong></div>
        <div style={{ display: "flex", height: 56, marginTop: 35 }}>{strain.segments.map((segment) => <div key={segment.key} style={{ flex: segment.frac, background: segment.color, padding: "26px 18px 0", color: "#0e0e0c", font: "700 13px JetBrains Mono", boxSizing: "border-box" }}>{segment.label.split(" / ")[0]} · {segment.pct}%</div>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 44, alignItems: "center", marginTop: 38 }}><div style={{ position: "relative", height: 350, background: "#050504" }}><img src={strain.image} alt={`${strain.name} flower`} style={{ width: "100%", height: "100%", objectFit: "contain" }} /><div style={{ position: "absolute", right: 8, bottom: 8, width: 175, padding: 5, border: "1px solid #2a2824", background: "rgba(14,14,12,.9)" }}><Fingerprint scores={strain.scores} /></div></div><div><small style={{ color: "#6e675b", font: "700 13px JetBrains Mono", letterSpacing: ".18em", textTransform: "uppercase" }}>Aroma read</small><blockquote style={{ margin: "18px 0", font: "400 34px/1.32 Newsreader" }}>{strain.aroma}</blockquote><div>{strain.topTerps.slice(0, 3).map((terp) => <span key={terp.label} style={{ display: "inline-block", margin: "0 8px 8px 0", padding: "8px 10px", border: "1px solid #2a2824", color: "#a8a092", font: "700 11px JetBrains Mono" }}>{terp.label} {terp.value.toFixed(2)}%</span>)}</div></div></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginTop: 40, borderTop: "1px solid #2a2824", borderBottom: "1px solid #2a2824" }}>{[["THC", strain.thc], ["Total terpenes", strain.terps], ["Harvest", strain.harvest], ["Available", strain.quantity]].map(([label, value]) => <div key={label} style={{ padding: 20, borderRight: "1px solid #2a2824" }}><small style={{ display: "block", color: "#6e675b", font: "700 10px JetBrains Mono", textTransform: "uppercase" }}>{label}</small><strong style={{ font: "600 24px Newsreader" }}>{value}</strong></div>)}</div>
        <div style={{ marginTop: "auto", paddingTop: 22, borderTop: "1px solid #2a2824", display: "flex", justifyContent: "space-between", color: "#6e675b", font: "700 11px JetBrains Mono", textTransform: "uppercase" }}><span>{strain.grower}</span><span>{strain.contact}</span></div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}><button disabled={busy} onClick={() => exportPng(false)}>Export PNG</button><button disabled={busy} onClick={() => exportPng(true)}>Share</button></div>
    </section>
  );
}
