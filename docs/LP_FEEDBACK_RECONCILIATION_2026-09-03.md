# LP Feedback Reconciliation - 2026-09-03

This is the implementation and handoff record for the LP Feedback Google Doc. It separates the pages controlled in this repository from the two agency-owned WordPress landing pages.

## Locked offer rules

| Lane | Public offer | Treatment included? |
| --- | --- | --- |
| Peptide | $299 consultation + baseline lab work + personalized plan | No |
| Broad peptide + longevity | $299 consultation + baseline lab work + personalized plan | No |
| Hormone optimization | $175 = $100 consultation + $75 hormone panel | No |
| Women's hormone optimization | $175 = $100 consultation + $75 women's hormone panel | No |
| Longevity | $175 consultation + lab work + provider-guided roadmap | No |
| Weight management | $149 private consultation + InBody assessment + roadmap | No medication or lab promise |
| IV therapy | $129 first qualifying wellness IV | NAD+ and Niagen excluded; no iron or ferritin IVs |
| Hair loss | Free hair-loss assessment | No treatment promise |
| Microneedling | Consultation request | No outcome guarantee |
| Male TRT | $100 consultation; pellet pricing stated separately at $500 modified / $700 full dosing | No treatment included in consultation |

## Controlled landing pages

| Page | Implemented result | Visual / conversion status |
| --- | --- | --- |
| `/lp/peptide-optimization-denver/` | $299 offer aligned to consultation, Eden peptide baseline panel, and plan; five-review carousel; category comparison; clinic imagery; desktop video; persistent CTA | Complete |
| `/lp/hormone-peptide-optimization-denver/` | Removed every first-month treatment-credit reference from visible copy, FAQ, lead metadata, and offer value; added five-review carousel and a real Eden consultation image | Complete |
| `/lp/hormone-optimization-denver/` | $175 offer and sex-specific panel details aligned; real consultation imagery; desktop video; five reviews; persistent CTA | Complete |
| `/lp/womens-hormone-optimization-denver/` | $175 women's visit aligned to FSH, estradiol, and total/free testosterone with SHBG; real consultation imagery; desktop video; five reviews; persistent CTA | Complete |
| `/lp/longevity-clinic-denver/` | $175 consult + lab-work position; real Eden provider image; desktop video; outcome-led copy; category comparison; five reviews | Complete |
| `/lp/weight-management-denver/` | $149 private consultation + InBody + roadmap aligned to the approved RSA; real InBody image; desktop video; category comparison; five reviews | Complete |
| `/lp/iv-therapy-denver/` | Real Eden IV lounge and visit imagery; $129 qualifying-IV offer; exclusions clear; IV menu preserved without iron/ferritin; category comparison; five reviews | Complete |
| `/lp/microneedling-denver/` | Added a real Eden SkinPen treatment image and treatment-room image; kept consultation framing, five reviews, and persistent CTA | Complete |
| `/hair-loss-consult/greenwood-village/` | Kept the free assessment; replaced a generic consult visual with Eden's real treatment room; comparison, cost FAQ, five reviews, and persistent CTA retained | Complete; no verified hair-treatment photo was substituted |
| `/male-trt/denver/` | Pellet prices remain visible outside FAQ; five reviews; responsive paid-page conversion components and sticky actions retained | Complete |

## Visual system

- Real, consented Eden photography replaces generic imagery where the service identity could be verified: IV lounge, IV visit, provider consultation, provider review, InBody assessment, SkinPen treatment, and treatment room.
- New vertical photos were resized and compressed for paid-traffic performance without changing their visible crops.
- Desktop-only motion uses Eden's existing clinic video and defers playback; mobile keeps a stable poster/image to protect readability and load time.
- Comparison sections use a light sage band, deep green type, and white comparison surface. Competitors are described by category behavior only. No competitor trademarks, rankings, or unverifiable superiority claims appear on the paid pages.
- Cards use restrained radii, stable image dimensions, and no nested-card presentation.

## GHL routing audit

Each controlled form submits through `/api/lead`, preserves GCLID/GBRAID/WBRAID attribution fields, and enrolls the contact into one direct workflow. When a direct workflow is selected, the generic webhook is suppressed to prevent duplicate workflow entry.

| Page lane | Workflow |
| --- | --- |
| Both $299 peptide pages | Peptide workflow `a9f9adfe-efd1-4cb0-bbcc-6eebc1b0181b` |
| Longevity | Baseline workflow `2fa02d3f-f4e2-4f63-89ea-3a3eae9610e1` |
| Hormone, women's hormone, weight, IV, and TRT | IW wellness workflow `672c856a-bafe-47a2-9c7f-d23b071127a8` |
| Microneedling | Medical Spa workflow `b496b143-dacc-4b7f-8112-239dd040b360` |
| Hair loss | Hair Restoration workflow `69ce52fb-8bd9-429e-994c-a2d033e43437` |

No live test lead was submitted during visual QA, so production workflow receipt should remain part of the next controlled end-to-end test.

## Agency-owned WordPress handoff

### Integrative Medicine

1. Keep the existing `Voted #1 Wellness Center` line. Add an outcome-led line directly beneath it: `Understand what's changing. Leave with a clear next step.` Do not add another award or ranking claim.
2. Replace the two black content bands with light sage/soft green from the Eden style guide. Use deep green headings and body text with accessible contrast.
3. Move the existing review content directly below the hero. Keep the same reviews, display five to six cards in a touch-friendly horizontal carousel, and allow manual swipe/arrow navigation. Do not change the form, GHL routing, CTA destination, or service row in this pass.

### Medical Spa

1. Replace the heavy black bands with a lighter Eden sage/green treatment and deep green text. Preserve clear separation between sections.
2. Move the existing reviews directly below the hero and present five to six in the same horizontal, mobile-friendly carousel pattern as Integrative Medicine.
3. Keep the remaining document ideas staged, not live in this pass: hero service tiles, regular-home-page banner/pop-up, service-row cleanup, and direct Zenoti booking. Those require separate design and tracking approval. Make no GHL routing change yet.

## QA gates

- `npm run build`: pass.
- Ten controlled routes: pass for one form, expected sticky action, no broken images, and no horizontal overflow at the connected browser viewport.
- Five-review social proof: present on all listed controlled pages; microneedling also contains two treatment figures.
- $299 treatment-credit language: removed from both paid $299 experiences.
- Policy copy: no outcome guarantees, competitor names, direct prescription-sale offer, or treatment-included claim added.
- Remaining production gate: deploy, verify every live URL returns 200, then run one controlled test lead per workflow lane using non-production contact handling agreed with the GHL owner.
