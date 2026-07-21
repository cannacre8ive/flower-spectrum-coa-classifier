# Testing and Pre-deployment Checklist

## Automated-in-app checks

- Run the parser coverage self-test and require 12/12 fixtures.
- Verify simple percent, multi-column LOD/LOQ, mg/g, isomers, ND/LOQ, and cannabinoid filtering.

## Manual functional checks

- Insert the illustrative COA and confirm a fingerprint, strip, mapped table, and confidence appear.
- Edit and remove a terpene and confirm the visual updates immediately.
- Add a flower, export CSV, re-import it, and confirm the classification is identical.
- Verify an unknown analyte appears under Unmapped.
- Upload `examples/johnny-glaze-coa.pdf`; verify page 3 is selected and the status reads `Page 3 · 15 mapped`.
- Confirm Johnny Glaze resolves sample `2108CH0442.1887`, lot `JG 060821`, harvest `06/08/2021`, CBD `0.08%`, total cannabinoids `34.00%`, and total terpenes `4.06%`.
- Confirm the isomer-aware panel includes β-Farnesene `1.42%`, D-Limonene `0.87%`, Linalool `0.44%`, and β-Caryophyllene `0.31%`.
- Paste the deployed Johnny Glaze PDF URL into COA link import and confirm it produces the same classification.
- Upload a JPEG through the flower image control and confirm it appears in both generated assets.
- Export both PNGs and confirm exact dimensions of 1600 × content height and 1080 × 1350.
- Inspect the buyer-sheet footer and full 15-row panel; no content may be clipped or overlap the footer.
- Select all ten illustrative profile buttons and confirm the fingerprint/detail state changes.
- Select a result band and confirm only measured contributing terpenes are listed with values.
- Upload an image-only PDF; verify the OCR progress state appears and mapped values remain editable.
- Confirm blank input and no-match states are understandable.

## Visual and accessibility checks

- Test at 1440px, 1024px, 768px, 390px, and 320px widths.
- Confirm no horizontal overflow and all controls remain operable.
- Confirm profile labels accompany color in the wheel and key.
- Confirm focus states, semantic headings, file label, and navigation anchors.
- Test reduced motion preference.

## Release checks

- Capture the current interface in `documentation/assets/`.
- Update README live URL, screenshot, recent updates, and CHANGELOG.
- Verify the production URL returns HTTP 200 and the classifier flow works.
