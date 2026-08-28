# User Flow

## Education path

1. Land on the Flower Spectrum premise and illustrative fingerprint.
2. Read how shape, color, weighting, and aggregation work.
3. Scan the ten fixed aroma profiles and their common terpene drivers.
4. Select any profile to compare its illustrative fingerprint and typical drivers.
5. Continue to the classifier.

## COA happy path

1. Add optional strain, grower, lineage, sales metadata, and a flower image.
2. Upload the original laboratory PDF or provide a public laboratory result-page/PDF link.
3. The parser scans the document, selects the terpene page, and preserves each positive laboratory row with its original label and value.
4. The accuracy gate compares every positive source-row value with the printed Total Terpenes value, independently of classifier support.
5. The coverage gate requires the versioned 38-terpene model to represent at least 95% of the reconciled positive source mass; smaller outside-model rows remain visible and disclosed.
6. If both gates pass, the fingerprint, strip, and sales assets unlock.
7. Review the source rows and reopen the original PDF viewer whenever needed.
8. Select a spectrum band to see the measured terpenes causing that spike.
9. Export the buyer sheet, social PNG, or reusable React component.
10. Add the verified flower to the in-session dataset and optionally download a CSV export.

## Error and empty states

- Empty input asks for a PDF or public lab result link without changing state.
- No recognized rows reports that no trustworthy laboratory rows were found.
- Unknown or ambiguous analytes appear in an amber review panel.
- A missing lab total, guessed result, >0.02% difference, OCR extraction, or modeled coverage below 95% blocks classification and every export.
- Positive outside-model rows never disappear: they count toward reconciliation, remain buyer-visible, and are labeled as preserved/not modeled.
- Image-only PDFs trigger private in-browser OCR for review but never auto-pass.
- Blocked, private-network, oversized, or non-PDF links return a specific retrieval error.
- An empty dataset presents a clear starting prompt.
