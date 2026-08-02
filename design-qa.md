# Wa-Node Homepage Design QA

- source visual truth:
  - `C:/Users/hiroz/Downloads/スクリーンショット 2026-07-12 143950.png` (final hero composition reference)
  - `C:/Users/hiroz/.codex/generated_images/019e1619-ec71-7d10-9b1d-b5bd9ba321d8/exec-6941d46b-c11d-4abc-b187-04cd33789d66.png` (editorial hero)
  - `C:/Users/hiroz/.codex/generated_images/019e1619-ec71-7d10-9b1d-b5bd9ba321d8/exec-f05a5192-f6e1-4b8a-a6d5-ce3a39714db0.png` (consultation guidance)
- implementation URL: `http://127.0.0.1:4323/`
- implementation screenshots:
  - `E:/個人用データ/wa-node-design-concepts/qa/home-desktop-1440x1024-final.png`
  - `E:/個人用データ/wa-node-design-concepts/qa/home-mobile-390x844-final.png`
- combined comparison: `E:/個人用データ/wa-node-design-concepts/qa/desktop-comparison-board-final.png`
- viewports: 1440 x 1024, 390 x 844
- state: Japanese homepage, initial load; Before/After toggle also tested

## Full-view comparison evidence

The implementation follows the final supplied hero reference: no in-hero badge or tagline, a vertical red rule, red and black Mincho headline, teal divider, left-aligned wide actions with arrows, and the transparent blue technology image faded toward the right edge. The area below the hero adopts the selected consultation-led structure with preparation, pricing, and process cues followed by trust signals and a three-step journey.

## Focused region comparison evidence

The hero and first transition were large enough to inspect in the combined board. Typography, image crop, CTA alignment, white/teal/red/gold tokens, and the amount of the following section visible in the first viewport were checked. A separate mobile capture was used to verify wrapping, CTA sizing, image placement, and the next-section hint.

## Required fidelity surfaces

- Fonts and typography: existing Shippori Mincho hierarchy preserved; headline weight and wrapping remain legible at both viewports.
- Spacing and layout rhythm: editorial rule, hero copy, actions, information rail, and trust rail align to a consistent grid. Mobile uses a single-column rhythm without horizontal overflow.
- Colors and visual tokens: existing white, deep teal, action red, and muted gold remain consistent with the selected concepts.
- Image quality and asset fidelity: existing optimized `hero.webp` is reused with the correct transparent cyan subject and desktop/mobile crops.
- Copy and content: no claims, testimonials, awards, or metrics were invented. The trust label uses `カウンセラーとして` as requested.

## Comparison history

1. P2: Hero CTAs inherited global center alignment. Fixed with a hero-scoped `justify-content: flex-start` rule.
2. P2: The mobile hero consumed the entire first viewport and did not hint at the next section. Fixed by shortening the lead and reducing mobile image padding while preserving the subject.
3. P2: The journey heading appeared washed out at the bottom of the desktop viewport because the reveal state had not completed. Fixed by removing reveal gating from this above-the-fold transition.
4. Post-fix evidence: desktop and mobile captures show readable content, intact CTA controls, and the next section visible without overlap.
5. The final supplied hero reference removed auxiliary labels and gave the headline more visual authority. The hero was updated with the same red/black title split, teal divider, quieter right-side image, and arrow CTAs; desktop and mobile captures were refreshed after the change.
6. The red vertical guide initially continued through the supporting copy. It now occupies the same grid row as the H1 only; measured rule and H1 heights match at both desktop (246px) and mobile (169px).

## Interaction and runtime checks

- Page identity and title: passed.
- Meaningful DOM content: passed.
- Framework error overlay: none.
- Console warnings/errors: none relevant.
- Before/After interaction: passed; clicking Before changed `aria-pressed` to `true` and `data-phase` to `before`.
- Responsive layout: passed at 1440 x 1024 and 390 x 844.

## Remaining P3 polish

- Consider testing one intermediate tablet width during the next full-site QA pass.

final result: passed
