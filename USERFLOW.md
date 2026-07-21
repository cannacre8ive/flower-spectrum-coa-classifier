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
4. The accuracy gate compares the positive source-row sum with the printed Total Terpenes value.
5. If the difference is at most 0.02%, the canonical internal mapping is classified and the fingerprint, strip, and sales assets unlock.
6. Review the source rows and reopen the original PDF viewer whenever needed.
7. Select a spectrum band to see the measured terpenes causing that spike.
8. Export the buyer sheet, social PNG, or reusable React component.
9. Add the verified flower to the in-session dataset and optionally download a CSV export.

## Error and empty states

- Empty input asks for a PDF or public lab result link without changing state.
- No recognized rows reports that no trustworthy laboratory rows were found.
- Unknown or ambiguous analytes appear in an amber review panel.
- A missing lab total, positive unmapped row, guessed result, >0.02% difference, or OCR extraction blocks classification and every export.
- Image-only PDFs trigger private in-browser OCR for review but never auto-pass.
- Blocked, private-network, oversized, or non-PDF links return a specific retrieval error.
- An empty dataset presents a clear starting prompt.
