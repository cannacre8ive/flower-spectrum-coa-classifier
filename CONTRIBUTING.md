# Contributing

## Local development

Serve the repository with `python3 -m http.server 4173`; do not open the HTML directly when testing PDF workers. No secrets or install step are required.

## Standards

- Use `codex/feature-name` or `codex/bugfix-name` branches.
- Preserve the canonical profile order, colors, and 38-terpene engine unless a reviewed model version explicitly changes them.
- Keep unknown analytes visible; never add fuzzy matching without test fixtures.
- Accept only original PDFs or public laboratory result/PDF links as COA inputs. CSV may remain an output, never an input.
- Preserve every buyer-facing source row and require source-total reconciliation before invoking the classifier or exporters.
- Use semantic HTML and verify at 320px before review.
- Add parser fixtures for every newly supported lab layout or alias.
- Update CHANGELOG and relevant context documents with every behavior change.

## Pull request review

1. Explain the user-facing outcome and any engine/model change.
2. Run the 15-check in-app suite: parser layouts, Johnny Glaze 16-row/4.06%, Mt. Hood Magic 19-row/3.41% with 99.12% modeled coverage, and at least one intentionally blocked mismatch/coverage case.
3. Include desktop and mobile screenshots for visual changes.
4. Confirm the required aroma-only disclaimer remains visible.
5. For every production deployment, refresh the share image when the UI changes and verify Open Graph/Twitter metadata against the stable public Vercel alias.
