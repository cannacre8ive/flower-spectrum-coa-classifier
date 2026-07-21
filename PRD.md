# Product Requirements Document

## Why

Cannabis flower is commonly compared through THC percentage and broad indica/sativa labels, neither of which communicates the batch's measured aroma character. Lab terpene panels contain useful information but are difficult to read at a retail counter.

## Product

Flower Spectrum converts a COA terpene panel into two connected artifacts: a ten-axis aroma fingerprint for comparison and a one-to-three-color shelf strip for quick recognition. The COA remains the source of truth; the visual is a deterministic summary.

## Audiences

- Shoppers seeking a plain-language way to compare aroma.
- Retailers balancing the shelf across distinct profiles.
- Growers communicating cultivar, process, and craft beyond THC.
- Budtenders who need a fast, consistent teaching aid.

## Core user stories

- As a grower, I can upload a PDF or provide a public COA link and receive a repeatable fingerprint without copying lab text.
- As a retailer, I can classify multiple products and export a reusable dataset.
- As a shopper, I can understand what every color and spoke means.
- As a reviewer, I can see unmapped analytes instead of having them silently discarded.
- As a seller, I can upload flower photography and export a complete buyer sheet and social-ready card.
- As a learner, I can inspect an example for every profile and trace each result band to the measured terpenes that caused it.

## Success metrics

- 100% of built-in parser layout fixtures pass.
- Identical terpene inputs always return identical profile scores and strips.
- A first-time visitor can identify that colors mean aroma families, not single molecules.
- Core upload/classification flow works at 320px and desktop widths.
- No effect or medical claim appears in the classification output.

## Guardrails

- Do not infer effects, medical outcomes, or product quality.
- Do not invent COA values or silently fuzzy-match unknown analytes.
- Keep the ten profile names, order, and colors stable.
- Treat PDF extraction as convenience; users must review parsed values.
