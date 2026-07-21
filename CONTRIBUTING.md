# Contributing

## Local development

Serve the repository with `python3 -m http.server 4173`; do not open the HTML directly when testing PDF workers. No secrets or install step are required.

## Standards

- Use `codex/feature-name` or `codex/bugfix-name` branches.
- Preserve the canonical profile order, colors, and 38-terpene engine unless a reviewed model version explicitly changes them.
- Keep unknown analytes visible; never add fuzzy matching without test fixtures.
- Use semantic HTML and verify at 320px before review.
- Add parser fixtures for every newly supported lab layout or alias.
- Update CHANGELOG and relevant context documents with every behavior change.

## Pull request review

1. Explain the user-facing outcome and any engine/model change.
2. Run the in-app self-test and the manual COA happy path.
3. Include desktop and mobile screenshots for visual changes.
4. Confirm the required aroma-only disclaimer remains visible.
5. For every production deployment, refresh the share image when the UI changes and verify Open Graph/Twitter metadata against the stable public Vercel alias.
