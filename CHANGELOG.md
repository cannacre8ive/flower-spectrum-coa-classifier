# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.4.0] - 2026-07-20

### Added

- Fail-closed reconciliation gate requiring positive source-row mass to match the laboratory-reported Total Terpenes value within 0.02% before classification or export.
- Source-truth audit summary showing source rows, internal engine keys, extracted sum, lab total, and difference.
- Public laboratory result-page resolution that discovers and retrieves the original linked PDF certificate while retaining private-network and size protections.
- Deterministic deployed lab-result-page fixture for end-to-end resolver regression testing.
- Versioned brand and accuracy screenshots for the current release.

### Changed

- Limited COA ingestion to original PDFs and public laboratory result/PDF links; CSV, TXT, and manual-paste ingestion were removed.
- Kept OCR as a review-only fallback that cannot pass the automatic accuracy gate.
- Reworked the header wordmark to the approved off-white treatment with the ten-color spectrum rule and shifted interface emphasis away from teal.
- Buyer-facing terpene tables and loudest-terpene callouts now use the laboratory&rsquo;s original row labels and values; canonical aggregation is internal only.
- Lab-derived metadata fields are cleared and repopulated for every new certificate so stale values cannot carry across uploads.

### Fixed

- Corrected the Johnny Glaze panel to preserve β-Farnesene 0.43%, cis-β-Farnesene 0.99%, and α-Farnesene 0.12% as separate laboratory rows instead of presenting a collapsed β-Farnesene result.
- Prevented fingerprints, buyer sheets, social cards, React exports, and dataset insertion whenever extraction does not reconcile.

## [2.3.2] - 2026-07-20

### Added

- 1200 × 630 production screengrab at `documentation/assets/social-preview.jpg` for link unfurls.
- Complete Open Graph and Twitter Card metadata on both the root entry page and canonical classifier page.
- Canonical URL, theme color, robots image-preview directive, image dimensions, MIME type, and accessible preview alt text.

### Changed

- Added concise social-share copy to the README and documented social-preview requirements across release artifacts.

### Fixed

- Ensured the stable Vercel production URL produces a branded large-image preview instead of a generic text-only link.

## [2.3.1] - 2026-07-20

### Added

- Versioned repository screenshots for the production classifier, Johnny Glaze buyer sheet, social card, and reference/implementation comparison.
- README release-preview section embedding every current visual deliverable directly from `documentation/assets/`.

### Changed

- Refreshed the repository storefront and release documentation to conform to `master-codex.md` packaging standards.

### Fixed

- Ensured visual QA evidence is stored in the tracked documentation tree instead of only in ignored local test output.

## [2.3.0] - 2026-07-20

### Added

- Flower-image upload shared by the buyer sheet, social card, and downloadable React component.
- Johnny Glaze demo image and six-page COA fixture with automatic page-three terpene extraction.
- Public COA URL import through a guarded serverless PDF retriever.
- Interactive ten-profile example fingerprints and a measured-terpene contribution inspector for every spectrum band.
- 1600 px buyer-sheet and 1080 × 1350 social PNG exports.

### Changed

- PDF ingestion now scores every page, selects the likely terpene analysis, and reconstructs independent left/right tables by coordinates.
- Buyer-sheet height now expands with the complete detected terpene panel.
- Sales outputs now combine flower photography, fingerprint, proportional strip, purchase details, COA metrics, and aroma copy.

### Fixed

- Prevented cannabinoid LOQ values from being treated as detected CBD.
- Preserved COA strain names instead of falling back to uploaded filenames.
- Removed bottom-left and bottom-right clipping from long buyer sheets.
- Removed duplicated wording from generated aroma sentences.

## [2.2.0] - 2026-07-18

### Added

- Buyer sheet, 4:5 social card, PNG export, and React JSX download.
- Lot, sample, harvest, quantity, buyer contact, cannabinoid, and CBD fields in the round-trip dataset.

### Changed

- Spectrum strips now use the leader threshold and a maximum of three proportional bands.

## [2.1.0] - 2026-07-18

### Added

- Embedded source-PDF review, coordinate-aware table reconstruction, and in-browser OCR fallback for scanned COAs.
- Reproducible synthetic PDF fixture and generator for end-to-end upload testing.

### Changed

- Replaced the radar/spoke fingerprint with a circular donut fingerprint whose ten segment radii encode absolute profile influence.
- Rewrote fingerprint education around segments, radial size, and the fixed donut center.

### Fixed

- Prevented COA sample, lot, and report identifiers from appearing as unmapped analytes.

## [2.0.0] - 2026-07-18

### Added

- Ten-axis Flower Spectrum aroma fingerprint with canonical profile colors.
- Detailed explanations of fingerprint geometry, color meaning, aromatic weighting, and aggregation.
- Retailer and grower story sections focused on shelf range and craft differentiation.
- Direct text-based PDF, TXT, and CSV upload for the COA classifier.
- Complete product, design, architecture, testing, flow, and contribution documentation.
- Production deployment at `flower-spectrum-coa-classifier.vercel.app`.

### Changed

- Reframed the Chemovar classifier interface in the Flower Spectrum visual identity.
- Updated result cards to show both the fingerprint and proportional shelf strip.
- Packaged the standalone prototype for static Vercel deployment.

### Fixed

- Made the system explanation explicit that profiles aggregate multiple terpenes and do not imply effects or medical outcomes.
- Prevented aligned single-analyte rows containing a percent sign from being misidentified as table headers.
