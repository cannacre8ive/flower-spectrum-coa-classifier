# Changelog

All notable changes follow [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

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
