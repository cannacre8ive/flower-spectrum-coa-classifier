import dns from "node:dns/promises";
import net from "node:net";

const MAX_BYTES = 15 * 1024 * 1024;

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

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).send("GET required");
  try {
    let url = await assertPublicUrl(String(req.query.url || ""));
    let response;
    for (let redirects = 0; redirects <= 3; redirects += 1) {
      response = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { "user-agent": "FlowerSpectrumCOAReader/1.0" } });
      if (![301, 302, 303, 307, 308].includes(response.status)) break;
      const location = response.headers.get("location");
      if (!location) throw new Error("The COA link redirected without a destination.");
      url = await assertPublicUrl(new URL(location, url).toString());
    }
    if (!response?.ok) throw new Error(`The COA host returned ${response?.status || "an error"}.`);
    const contentType = response.headers.get("content-type") || "";
    if (!/pdf|octet-stream/i.test(contentType)) throw new Error("The link did not return a PDF document.");
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > MAX_BYTES) throw new Error("The linked COA is larger than 15 MB.");
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > MAX_BYTES) throw new Error("The linked COA is larger than 15 MB.");
    if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF") throw new Error("The linked file is not a valid PDF.");
    res.setHeader("content-type", "application/pdf");
    res.setHeader("cache-control", "no-store");
    return res.status(200).send(Buffer.from(bytes));
  } catch (error) {
    return res.status(400).send(error.message || "The linked COA could not be retrieved.");
  }
}
