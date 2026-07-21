import dns from "node:dns/promises";
import net from "node:net";

const MAX_PDF_BYTES = 15 * 1024 * 1024;
const MAX_HTML_BYTES = 2 * 1024 * 1024;
const USER_AGENT = "FlowerSpectrumCOAReader/2.0";

function isPrivateAddress(address) {
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return a === 0 || a === 10 || a === 127 || (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) || a >= 224;
  }
  const normalized = address.toLowerCase();
  return normalized === "::1" || normalized === "::" || normalized.startsWith("fc") ||
    normalized.startsWith("fd") || normalized.startsWith("fe8") || normalized.startsWith("fe9") ||
    normalized.startsWith("fea") || normalized.startsWith("feb");
}

async function assertPublicUrl(raw) {
  const url = new URL(raw);
  if (!/^https?:$/.test(url.protocol)) throw new Error("Only HTTP and HTTPS COA links are supported.");
  if (url.username || url.password) throw new Error("Authenticated URLs are not supported.");
  const addresses = await dns.lookup(url.hostname, { all: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("That COA host is not publicly reachable.");
  }
  return url;
}

async function fetchPublic(raw) {
  let url = await assertPublicUrl(raw);
  let response;
  for (let redirects = 0; redirects <= 3; redirects += 1) {
    response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": USER_AGENT, accept: "application/pdf,text/html;q=0.9" } });
    if (![301, 302, 303, 307, 308].includes(response.status)) break;
    const location = response.headers.get("location");
    if (!location) throw new Error("The COA link redirected without a destination.");
    url = await assertPublicUrl(new URL(location, url).toString());
  }
  if (!response?.ok) throw new Error(`The COA host returned ${response?.status || "an error"}.`);
  return { response, url };
}

function isPdf(_contentType, bytes) {
  return String.fromCharCode(...bytes.slice(0, 4)) === "%PDF";
}

async function readBytes(response, maxBytes) {
  const declared = Number(response.headers.get("content-length") || 0);
  if (declared > maxBytes) throw new Error("The linked laboratory document is too large.");
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.byteLength > maxBytes) throw new Error("The linked laboratory document is too large.");
  return bytes;
}

function htmlPdfCandidates(html, pageUrl) {
  const candidates = [];
  const attr = /(?:href|src|data|data-src|data-url)\s*=\s*["']([^"']+)["']/gi;
  for (const match of html.matchAll(attr)) {
    const raw = match[1].replace(/&amp;/g, "&").trim();
    if (!raw || /^(?:javascript|data|mailto):/i.test(raw)) continue;
    let resolved;
    try { resolved = new URL(raw, pageUrl).toString(); } catch { continue; }
    if (/\.pdf(?:$|[?#])|certificate|coa|lab.?report|test.?result|download/i.test(resolved)) candidates.push(resolved);
  }
  return [...new Set(candidates)].slice(0, 12);
}

async function resolvePdf(raw) {
  const first = await fetchPublic(raw);
  const contentType = first.response.headers.get("content-type") || "";
  const max = /html/i.test(contentType) ? MAX_HTML_BYTES : MAX_PDF_BYTES;
  const bytes = await readBytes(first.response, max);
  if (isPdf(contentType, bytes)) return { bytes, url: first.url.toString() };
  if (!/html/i.test(contentType)) throw new Error("The link did not return a PDF or a laboratory result page.");

  const html = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  const candidates = htmlPdfCandidates(html, first.url);
  for (const candidate of candidates) {
    try {
      const found = await fetchPublic(candidate);
      const candidateType = found.response.headers.get("content-type") || "";
      const candidateBytes = await readBytes(found.response, MAX_PDF_BYTES);
      if (isPdf(candidateType, candidateBytes)) return { bytes: candidateBytes, url: found.url.toString() };
    } catch {
      // Continue through the page's remaining document candidates.
    }
  }
  throw new Error("No original PDF certificate was found on that laboratory result page.");
}

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("GET required");
  try {
    const result = await resolvePdf(String(req.query.url || ""));
    res.setHeader("content-type", "application/pdf");
    res.setHeader("cache-control", "no-store");
    res.setHeader("x-flower-spectrum-pdf-url", result.url);
    return res.status(200).send(Buffer.from(result.bytes));
  } catch (error) {
    return res.status(400).send(error.message || "The linked COA could not be retrieved.");
  }
}
