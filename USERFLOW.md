# User Flow

## Education path

1. Land on the Flower Spectrum premise and illustrative fingerprint.
2. Read how shape, color, weighting, and aggregation work.
3. Scan the ten fixed aroma profiles and their common terpene drivers.
4. Select any profile to compare its illustrative fingerprint and typical drivers.
5. Continue to the classifier.

## COA happy path

1. Add optional strain, grower, lineage, sales metadata, and a flower image.
2. Upload a PDF/TXT/CSV or provide a public COA PDF link.
3. The parser scans the document, selects the terpene page, maps explicit analyte aliases, and classifies the values.
4. Review the source page beside the fingerprint, strip, confidence, totals, and mapped table.
5. Correct or remove any parsed value.
6. Select a spectrum band to see the measured terpenes causing that spike.
7. Export the buyer sheet, social PNG, or reusable React component.
8. Add the flower to the in-session dataset, repeat, and download a round-trippable CSV.

## CSV happy path

1. Open the Import CSV tab.
2. Select or paste an exported Flower Spectrum CSV.
3. Review each reclassified row.
4. Add all rows to the dataset and export again if needed.

## Error and empty states

- Empty input asks for COA text without changing state.
- No recognized rows explains the required analyte/value shape.
- Unknown or ambiguous analytes appear in an amber review panel.
- Image-only PDFs trigger private in-browser OCR; unreadable files keep the PDF visible and expose the manual fallback.
- Blocked, private-network, oversized, or non-PDF links return a specific retrieval error.
- An empty dataset presents a clear starting prompt.
