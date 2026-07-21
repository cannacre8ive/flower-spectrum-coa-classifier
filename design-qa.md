# Design QA — Flower Spectrum COA classifier v2.4

## Evidence

- Brand/header implementation: `documentation/assets/flower-spectrum-v2-4-top.png`
- Johnny Glaze reconciliation state: `documentation/assets/flower-spectrum-v2-4-accuracy.png`
- Supplied parser screenshot beside final implementation: `documentation/assets/flower-spectrum-reference-vs-v2-4.png`
- Social link preview: `documentation/assets/social-preview.jpg` (1200 × 630)
- Johnny Glaze buyer export: `documentation/assets/johnny-glaze-buyer-sheet.png`
- Johnny Glaze social export: `documentation/assets/johnny-glaze-social-card.png`
- Production URL: `https://flower-spectrum-coa-classifier.vercel.app`

The user-supplied parser screenshot and the final classifier were normalized and inspected together at the same 960 × 540 panel size. The comparison specifically evaluates the brand lockup, spectrum use, PDF workflow, source provenance, and visibility of the validation state.

## Accuracy findings

1. The real six-page Johnny Glaze PDF selects page 3 and extracts 16 positive laboratory source rows.
2. Source rows total 4.06%, matching the laboratory&rsquo;s printed Total Terpenes value of 4.06% with a 0.00% difference.
3. Sixteen source rows map to 15 internal keys because β-Farnesene 0.43% and cis-β-Farnesene 0.99% intentionally share one classifier key. Buyer-facing output keeps both rows distinct and also preserves α-Farnesene 0.12%.
4. The automatic gate blocks missing totals, positive unmapped rows, guessed result columns, OCR-derived values, and source-total differences above 0.02%.
5. A deliberate 4.09% fixture total produces a 0.03% difference and a blocked result. No fingerprint, buyer sheet, social card, React component, or dataset action is rendered.
6. Loading a new PDF clears and repopulates all lab-sourced metadata, preventing values from a prior certificate from carrying forward.
7. The in-app regression suite passes 13/13 checks: 12 parser layouts plus the Johnny Glaze source-truth regression.

## Visual findings

1. The wordmark is Newsreader 600 in off-white, with no teal recoloring. The ten-color spectrum rule sits directly beneath it as specified by the supplied brand guidelines.
2. The canonical spectrum now carries interface emphasis: Gas/gold for editorial markers, Citrus for active controls, Earthy green for passed reconciliation, and Fruity red for blocked states. Teal is no longer the dominant brand signal.
3. The reference comparison shows the earlier ambiguous PDF-first state replaced by a visible, plain-language accuracy gate while keeping the original certificate one click away in a collapsible review panel.
4. The classifier accepts only an original PDF or public lab result link. CSV/TXT/paste controls are absent.
5. The fixed donut-hole fingerprint, equal-angle segments, and radius-by-influence behavior remain unchanged.
6. Buyer and social outputs use the preserved source rows, complete purchase information, Johnny Glaze image, and content-aware buyer-sheet height without footer clipping.
7. The 1200 × 630 social preview is a real current-interface capture with the Flower Spectrum name, spectrum rule, core promise, and fingerprint inside the center-safe frame.

## Severity review

- P0: none
- P1: none
- P2: none
- P3: none blocking handoff

final result: passed
