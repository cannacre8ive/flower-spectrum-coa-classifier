# Architecture

## Stack

Static HTML, CSS, and browser JavaScript with one Vercel serverless endpoint for resolving a user-supplied direct PDF or public laboratory result-page URL. PDF text extraction uses PDF.js from a pinned CDN version; scanned pages may use Tesseract.js OCR for review, but OCR cannot pass automatic validation. No authentication, database, or build system is required.

## Runtime layers

1. PDF ingestion scores every page, keeps the selected source page available for review, and rebuilds independent left/right table rows from PDF x/y coordinates.
2. Source-truth parsing preserves each original positive row label/value and separately maps that row to a canonical engine key.
3. The accuracy gate requires a printed Total Terpenes value, at least two positive mapped rows, no positive unmapped/guessed rows, text-layer extraction, and a maximum 0.02% row-sum difference.
4. Only a passed extraction reaches the canonical 38-terpene engine, which applies tier/potency weights and profile contributions.
4. Gas/Fuel receives an additional balanced co-occurrence score from caryophyllene, limonene, and myrcene/humulene.
5. Ten profile shares drive radial donut segment size; the 60%-of-leader rule drives the strip.
6. Flower images are browser object/data URLs shared by the generated buyer sheet, social card, and React payload.
8. Dataset state lives in memory and exports to CSV; CSV is never accepted as a laboratory source.
9. `api/fetch-coa.js` validates HTTP(S) URLs and redirects, rejects private/internal destinations, caps HTML/PDF responses, discovers likely certificate links on public lab pages, and returns only a valid PDF payload.

## Data model

```text
Strain {
  name, grower, lineage, lot, sample, harvest, quantity, contact,
  thc, totalCannabinoids, cbd, totalTerpenes, tier, aroma, notes, image,
  price { g, eighth },
  values { canonicalTerpeneKey: percent }
}

VerifiedParse {
  sourceRows [{ rawLabLabel, percent, canonicalEngineKey }],
  engineValues { canonicalTerpeneKey: summedPercent },
  reportedTotal, sourceSum, delta, extractionMethod,
  status: "passed" | "blocked", issues[]
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
├── examples/johnny-glaze-lab-result.html
├── examples/illustrative-coa.txt
├── examples/illustrative-coa.pdf
├── scripts/create_fixture_pdf.py
├── documentation/assets/social-preview.jpg
├── documentation/assets/*.png
├── vercel.json
└── product and engineering documentation
```

## Social discovery layer

Both HTML entry points expose the same canonical production URL, short product description, Open Graph fields, and Twitter large-image card. The preview image is a real 1200 × 630 production screengrab served from the same public Vercel origin so social crawlers do not depend on GitHub or local files.
