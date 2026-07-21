# Design System

## Brand premise

The identity is typographic and data-led: a quiet near-black canvas, warm paper moments, and ten earthy profile hues. The fingerprint and strip are the primary recognition devices.

## Color tokens

- Canvas `#0E0E0C`; surface `#181715`; border `#2A2824`.
- Primary text `#E8E3D9`; secondary `#A8A092`; muted `#6E675B`.
- Legacy utility teal `#6AAFA0` is restricted to minor non-brand states; paper `#F2ECDF` and the ten profile colors carry primary emphasis.
- Profile order: Gas `#C9A84C`, Earthy `#6B8E5A`, Citrus `#D4A843`, Fruity `#B75F4A`, Floral `#B98BBE`, Dessert `#D6B58A`, Spicy `#9E6B4A`, Piney `#4F7A5B`, Herbal `#7FA688`, Tropical `#D28B49`.

## Typography

- Display: Newsreader, 400–600, optical serif for brand and editorial moments.
- Body: DM Sans, 400–700 for readable explanation and UI.
- Data: JetBrains Mono, 500–700 for labels, values, codes, and controls.

## Layout and spacing

- Content width: 1240px maximum; 24px desktop and 14px mobile gutters.
- Major sections use 80–112px vertical spacing.
- Borders are square and one pixel. Controls avoid ornamental rounding.
- Mobile breakpoint: 640px; intermediate stacking: 900px.

## Component rules

- Fingerprint: a fixed donut hole surrounded by exactly ten equal-angle profile segments in canonical order; each segment extends farther from the center as its absolute influence share rises.
- Shelf strip: leader first; profiles join at 60% of leader; three colors maximum.
- Profile colors may fill strips, radial fingerprint segments, rules, and small keys; never body copy blocks.
- Wordmark: Newsreader 600 in off-white `#E8E3D9`; never recolor either word to a profile or utility accent. A ten-color spectrum rule sits directly beneath the wordmark.
- Always pair color with a text label or code for accessibility.
- Buyer imagery uses a black contain-fit stage so transparent or black-background flower photography stays intact without stretching.
- The buyer sheet uses a content-aware vertical canvas: every mapped terpene row must fit before the footer, even when that produces a taller export.
- The social card stays at 1080 × 1350 and overlays a compact fingerprint on the flower photograph to keep both recognition devices visible.
- Profile-learning controls use the same fixed ten-color order as the wheel. A selected band exposes the measured compounds and their relative weighted contribution in text as well as color.
- Accuracy gate: neutral while idle, Earthy green when reconciled, Fruity red when blocked. A blocked state replaces the result and all export controls rather than decorating an unsafe classification.
- Source table: retain laboratory labels and distinct isomer rows. Internal canonical mappings may be shown as secondary provenance but may never replace source labels.
- Social link preview: 1200 × 630 production screengrab, near-black canvas preserved, primary promise and fingerprint visible, no invented mock UI. Use concise title/description text in metadata instead of burning extra copy into the image.
