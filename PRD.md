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
- As a reviewer, I can see positive outside-model analytes, their preserved mass, and total modeled coverage instead of having them silently discarded or incorrectly treated as a supported signal.
- As a buyer, I never receive a fingerprint or sales asset unless the extracted source rows reconcile to the lab&rsquo;s printed total.
- As a seller, I can upload flower photography and export a complete buyer sheet and social-ready card.
- As a learner, I can inspect an example for every profile and trace each result band to the measured terpenes that caused it.

## Success metrics

- 100% of built-in parser layout fixtures pass.
- Identical terpene inputs always return identical profile scores and strips.
- 100% of generated fingerprints and sales assets come from a passed source-total reconciliation gate.
- A first-time visitor can identify that colors mean aroma families, not single molecules.
- Core upload/classification flow works at 320px and desktop widths.
- No effect or medical claim appears in the classification output.

## Guardrails

- Do not infer effects, medical outcomes, or product quality.
- Do not invent COA values or silently fuzzy-match unknown analytes.
- Keep the ten profile names, order, and colors stable.
- Treat the original PDF as source truth; never classify guessed, OCR-only, unreconciled, stale, or materially under-covered values. Require at least 95% of reconciled positive terpene mass to be represented by the versioned fingerprint model.
- Preserve laboratory source labels and isomer rows in all buyer-facing chemistry tables; canonical aggregation is internal only.
