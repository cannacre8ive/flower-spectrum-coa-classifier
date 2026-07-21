# Architecture

## Stack

Static HTML, CSS, and browser JavaScript with one Vercel serverless endpoint for retrieving a user-supplied public PDF URL. PDF text extraction uses PDF.js from a pinned CDN version; scanned pages fall back to Tesseract.js OCR loaded on demand. No authentication, database, or build system is required.

## Runtime layers

1. PDF ingestion scores every page, keeps the selected source page visible, rebuilds independent left/right table rows from PDF x/y coordinates, and invokes local OCR only when the text layer yields fewer than two tracked terpenes.
2. General ingestion normalizes explicit lab aliases, detects result columns and units, and surfaces misses.
3. The canonical 38-terpene engine applies tier/potency weights and profile contributions.
4. Gas/Fuel receives an additional balanced co-occurrence score from caryophyllene, limonene, and myrcene/humulene.
5. Ten profile shares drive radial donut segment size; the 60%-of-leader rule drives the strip.
6. Flower images are browser object/data URLs shared by the generated buyer sheet, social card, and React payload.
7. Dataset state lives in memory and exports to CSV with all raw terpene columns.
8. `api/fetch-coa.js` validates HTTP(S) URLs and redirects, rejects private/internal destinations, caps responses at 15 MB, and returns only PDF content.

## Data model

```text
Strain {
  name, grower, lineage, lot, sample, harvest, quantity, contact,
  thc, totalCannabinoids, cbd, totalTerpenes, tier, aroma, notes, image,
  price { g, eighth },
  values { canonicalTerpeneKey: percent }
}
```

## Security and privacy

Uploaded files, classification, PDF rendering, and OCR remain client-side. Only the optional COA-link workflow sends the provided public URL to `api/fetch-coa.js`; the endpoint blocks private-network targets, follows at most three validated redirects, and does not persist the response. External runtime requests also include fonts and pinned PDF.js/Tesseract assets.

## Directory map

```text
/
├── index.html
├── 06_18_2026-flower-spectrum-coa-importer-v1_1.html
├── app.css
├── api/fetch-coa.js
├── assets/johnny-glaze-flower.jpeg
├── components/FlowerSpectrumStrainCard.jsx
├── examples/johnny-glaze-coa.pdf
├── examples/illustrative-coa.txt
├── examples/illustrative-coa.pdf
├── scripts/create_fixture_pdf.py
├── documentation/assets/
├── vercel.json
└── product and engineering documentation
```
