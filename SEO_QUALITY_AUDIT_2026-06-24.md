# SEO Quality Audit - June 24, 2026

## Executive Summary

The landing page system is not thin by word count, but it does have a programmatic SEO risk: many service-by-suburb pages are structurally similar. That is the exact pattern Google is increasingly cautious about when pages are generated at scale without enough unique user value.

The right move is not to delete the system. The right move is to keep the strongest, most strategic pages indexable, keep the rest usable for ads/internal navigation, and only add pages back to the sitemap after they have meaningful differentiation.

## Google Policy Context

Official Google references used for this audit:

- May 2026 core update status: https://status.search.google.com/incidents/uMLEE3QXW6wfYyBDeJc6
- Google core update guidance: https://developers.google.com/search/updates/core-updates
- Google spam policy on scaled content abuse: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content-abuse

The key practical takeaway: programmatic pages are acceptable when they help users, but large sets of similar pages created primarily for search coverage can be omitted from results or become a quality liability.

## What Was Measured

- Built pages locally: 209 HTML pages.
- Original service-by-suburb system: 156 combo pages from 13 services x 12 suburbs.
- New fitness pages currently present locally: 27 pages.
- Sitemap after safety gating: 41 URLs.
- Indexable combo pages after safety gating: 15 premium combo pages.
- Non-premium combo pages now remain accessible but emit `noindex,follow`.
- Fitness pages now remain accessible but emit `noindex,follow` until intentionally reviewed.

The issue is not page length. Most generated combo pages are roughly 900-1,000 words. The risk is same-service similarity across suburbs.

Highest-risk similarity examples from the local build:

- `/botox/centennial/` vs `/botox/denver/` - 0.839 cosine similarity.
- `/botox/denver/` vs `/botox/greenwood-village/` - 0.816 cosine similarity.
- `/botox/centennial/` vs `/botox/greenwood-village/` - 0.815 cosine similarity.
- Medical weight loss, hormone, and peptide pages also showed high same-service similarity across suburbs.

## Fix Applied

The site now uses an explicit indexability allowlist for combo pages.

Indexable premium combo pages:

- `/diamondglow-facial/greenwood-village/`
- `/botox/greenwood-village/`
- `/lip-filler/greenwood-village/`
- `/iv-therapy/littleton/`
- `/microneedling/greenwood-village/`
- `/dermal-fillers/greenwood-village/`
- `/medical-weight-loss/greenwood-village/`
- `/bbl-photofacial/greenwood-village/`
- `/female-bhrt/greenwood-village/`
- `/male-trt/greenwood-village/`
- `/peptide-therapy/greenwood-village/`
- `/prf-hair-restoration/greenwood-village/`
- `/nad-iv-therapy/greenwood-village/`
- `/botox/centennial/`
- `/botox/denver/`

All other combo pages are still live for users and links, but now emit:

```html
<meta name="robots" content="noindex,follow">
```

The sitemap now includes:

- Homepage.
- 13 service hubs.
- 12 suburb hubs.
- 15 premium combo pages.

Total sitemap count: 41 URLs.

## Why This Is The Right Move

This preserves the technical system while lowering SEO risk.

Users and ads can still reach non-premium pages. Google is no longer being asked to index every city-by-service variant before the content has been differentiated. Authority is concentrated on the best pages: the premium pages, hubs, and known high-intent service/suburb combinations.

## Next Highest-Leverage Builds

1. Build a dedicated premium med spa / medical spa Denver page.

   Reason: paid search already spent on `"med spa denver"`, and the current system does not have a purpose-built page for that intent. This likely hurts Quality Score and conversion rate.

2. Differentiate the Botox geo cluster.

   Reason: Botox Denver, Centennial, and Greenwood Village are currently the most similar indexed combo pages. Each needs its own local angle, not just suburb swaps.

3. Deepen YMYL-sensitive wellness pages before broader indexing.

   Priority pages: medical weight loss, female BHRT, male TRT, peptide therapy, NAD IV therapy.

   These should include stronger provider oversight language, lab/screening process, eligibility/contraindications, and local appointment logistics.

4. Keep building premium pages only where there is real demand.

   Demand signals can come from Google Ads search terms, GSC impressions, GBP clicks, GHL lead data, and known service priorities.

## Recommended Indexing Rule Going Forward

Do not add a generated page to the sitemap unless it has at least one of the following:

- Known search demand or paid-search spend.
- Clearly distinct local context.
- Service-specific FAQ and clinical fit content.
- Conversion-oriented offer/pricing section.
- Real media or strong Eden-specific proof.
- Internal links from relevant hubs.

This keeps the landing system aggressive, but not reckless.
