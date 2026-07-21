# Testing and Pre-deployment Checklist

## Automated-in-app checks

- Run the parser coverage self-test and require 12/12 fixtures.
- Verify simple percent, multi-column LOD/LOQ, mg/g, isomers, ND/LOQ, and cannabinoid filtering.
- Run the Johnny Glaze regression and require: 16 positive source rows, 15 internal keys, source sum 4.06%, reported total 4.06%, difference 0.00%, and `passed` status.

## Manual functional checks

- Confirm the upload control accepts PDF only and no CSV/TXT/paste ingestion is exposed.
- Verify an unknown analyte appears under Unmapped.
- Upload `examples/johnny-glaze-coa.pdf`; verify page 3 is selected and the status reads `Page 3 · 15 mapped`.
- Confirm Johnny Glaze resolves sample `2108CH0442.1887`, lot `JG 060821`, harvest `06/08/2021`, CBD `0.08%`, total cannabinoids `34.00%`, and total terpenes `4.06%`.
- Confirm the buyer-facing source panel separately includes β-Farnesene `0.43%`, cis-β-Farnesene `0.99%`, α-Farnesene `0.12%`, δ-Limonene `0.87%`, Linalool `0.44%`, and β-Caryophyllene `0.31%`.
- Confirm the accuracy gate shows `16 source rows`, `15 internal classifier keys`, `4.06%`, `4.06%`, and `0.00%` before assets unlock.
- Change a fixture total by 0.03%; confirm the fingerprint, buyer sheet, social card, React export, and Add to Dataset action are all withheld.
- Load one COA after another and confirm lab-sourced strain, farm, lot, sample, harvest, cannabinoid, CBD, THC, and total-terpene fields never retain stale values.
- Paste both a deployed direct PDF URL and a public laboratory result-page URL into link import; confirm each resolves the original PDF and produces the same verified result.
- Use `examples/johnny-glaze-lab-result.html` as the deterministic deployed result-page fixture; the resolver must discover `johnny-glaze-coa.pdf` and return the same 629,029-byte certificate payload.
- Upload a JPEG through the flower image control and confirm it appears in both generated assets.
- Export both PNGs and confirm exact dimensions of 1600 × content height and 1080 × 1350.
- Inspect the buyer-sheet footer and full 16-row source panel; no content may be clipped or overlap the footer.
- Select all ten illustrative profile buttons and confirm the fingerprint/detail state changes.
- Select a result band and confirm only measured contributing terpenes are listed with values.
- Upload an image-only PDF; verify OCR progress appears but the result is blocked with a human-verification message and no exports.
- Confirm blank input and no-match states are understandable.

## Visual and accessibility checks

- Test at 1440px, 1024px, 768px, 390px, and 320px widths.
- Confirm no horizontal overflow and all controls remain operable.
- Confirm profile labels accompany color in the wheel and key.
- Confirm focus states, semantic headings, file label, and navigation anchors.
- Confirm the wordmark is off-white and the ten-color spectrum strip appears directly beneath it at desktop and mobile widths.
- Test reduced motion preference.

## Release checks

- Capture the current interface in `documentation/assets/`.
- Capture or refresh `documentation/assets/social-preview.jpg` at 1200 × 630 from the deployed production UI.
- Verify the stable Vercel alias and social-preview image both return unauthenticated HTTP 200 responses.
- Inspect rendered HTML for canonical, description, Open Graph, and `summary_large_image` Twitter metadata using absolute HTTPS URLs.
- Confirm the preview title is concise, the description is useful out of context, and the image has explicit dimensions and alt text.
- Update README live URL, screenshot, recent updates, and CHANGELOG.
- Verify the production URL returns HTTP 200 and the classifier flow works.
