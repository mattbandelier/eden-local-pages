# Eden Local Pages — System Architecture

**Audience:** AI coding agents (Claude Code, Codex) executing implementation work, and humans reviewing their output. **Purpose:** Define the load-bearing decisions for this project so implementation choices are constrained, consistent, and don't have to be relitigated phase by phase. **Status:** Living document. Updated when an architectural decision changes — never bypassed.

---

## 1\. Mission

Build a static, programmatic SEO and Google Ads landing system at `landing.edenhealthclubs.com` that generates **city × service** combination pages for Eden Health Club, distinct from but consistent with the brand at `edenhealthclubs.com`.

**Success criteria for v1 (Phases 1–7):**

1. 156 combo pages \+ 25 hub pages \= **181 pSEO pages** live at the subdomain.  
2. Every page passes mobile Lighthouse: **Performance ≥ 90, SEO ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95**.  
3. Every page has unique copy in the H1, hero paragraph, neighborhood blurb, and at least one FAQ — no boilerplate duplication detectable by Google.  
4. Every page has correct schema.org JSON-LD (MedicalProcedure / MedicalTherapy / LocalBusiness / FAQPage / BreadcrumbList).  
5. Google Ads conversion tracking fires on every CTA event.  
6. Sub-2-second LCP on mobile 4G for the top 20 pages by predicted traffic.

**Non-success criteria (explicit):** thin templated content, duplicate H1s, missing canonicals, broken structured data, Lighthouse SEO \< 95, or any page that Google could classify as doorway content.

---

## 2\. System diagram

```
flowchart LR
    subgraph Source[Source data in repo]
        SD[services.json]
        SB[suburbs.json]
        TY[types.ts]
    end

    subgraph Build[Astro build at deploy time]
        GSP[getStaticPaths]
        TPL[Page templates]
        CMP[Components]
        SEO[SEO + schema.org]
    end

    subgraph Output[Static output]
        HTML[Static HTML files]
        CSS[Compiled Tailwind CSS]
        SITEMAP[sitemap.xml + robots.txt]
    end

    subgraph Edge[Vercel edge]
        CDN[Vercel CDN]
        DNS[landing.edenhealthclubs.com]
    end

    subgraph Tracking[Analytics layer]
        GTM[GTM container]
        GA4[GA4]
        GADS[Google Ads conversions]
    end

    SD --> GSP
    SB --> GSP
    TY -.types.-> CMP
    GSP --> TPL
    TPL --> CMP
    CMP --> SEO
    SEO --> HTML
    HTML --> CDN
    CSS --> CDN
    SITEMAP --> CDN
    CDN --> DNS
    HTML -.client load.-> GTM
    GTM --> GA4
    GTM --> GADS
```

The whole pipeline is **build-time static**. No SSR, no runtime data fetching, no server. The only runtime code is the GTM-injected analytics layer in the browser.

---

## 3\. Architectural decisions

Each decision is short, decisive, and includes the rationale \+ what we ruled out. New decisions appended below. Decisions are **binding** — Codex should not deviate without flagging.

### ADR-001 — Astro 5.18.1, static output only

**Decision:** Use Astro 5.18.1 (pinned, not Astro 6\) with the default static adapter. No SSR. No client-side hydration unless a component genuinely cannot work without JS.

**Why:** Astro 6 ships rolldown-vite by default, which is incompatible with current `@tailwindcss/vite` (verified — build fails). Astro 5 uses stable Vite. Static output is simpler, faster, cheaper to host, and pSEO doesn't need dynamic content.

**Ruled out:** Next.js (overkill for static), Eleventy (less ergonomic templating), bare HTML (no DX).

### ADR-002 — Tailwind CSS 4 via `@tailwindcss/vite`

**Decision:** Tailwind 4.1.18, configured via the Vite plugin and a single `src/styles/global.css` with `@import "tailwindcss"` and a `@theme { }` block for Eden brand tokens (`--color-eden-navy: #0F2733`, `--color-eden-green: #8FAE3C`).

**Why:** Tailwind 4's CSS-first config is cleaner than v3's JS config. Single source of truth for brand colors. No utility-class drift.

**Ruled out:** Tailwind 3 \+ `@astrojs/tailwind` (legacy), CSS modules (more boilerplate), CSS-in-JS (unnecessary for static).

### ADR-003 — File-based data, no CMS

**Decision:** Service and suburb data live in `src/data/*.json` checked into the repo. Edited by humans (or AI agents on PRs). Typed via `src/data/types.ts`. Validated at build via `src/data/index.ts`.

**Why:** 25 source rows. CMS overhead isn't justified. Diff-friendly. Reviewable in PRs. Validators give us schema enforcement.

**Ruled out:** Headless CMS (Sanity/Contentful), Markdown frontmatter (less structured), database (operational overhead).

**When to revisit:** If the data row count exceeds \~200 or non-technical editors need direct access without git, evaluate a CMS in Phase 8+.

### ADR-004 — Two-axis pSEO: service × suburb

**Decision:** Pages are generated along two axes — services (13) and suburbs (12). Routes are:

- `/` — homepage (single page)  
- `/[service]/` — service hub (13 pages)  
- `/locations/[suburb]/` — suburb hub (12 pages)  
- `/[service]/[suburb]/` — service × suburb combo (156 pages)

Total: 1 \+ 13 \+ 12 \+ 156 \= **182 pages** (one more than 181 — the homepage).

**Why:** Combo pages are the high-intent conversion targets. Hubs serve as topical authority \+ internal linking. Mirrors proven pSEO patterns.

**Ruled out:** Per-zip pages (too granular, ZIP overlap is messy), per-neighborhood pages (Phase 8+ consideration), single-axis (loses local intent).

### ADR-005 — Subdomain isolation

**Decision:** Deploy to `landing.edenhealthclubs.com` as a separate Vercel project. Independent of the main WordPress site at the apex. Use `noindex` only on placeholder routes that aren't ready — never on launched pSEO pages.

**Why:** Isolates risk (a build break on landing doesn't take down the main site), permits independent stack choices, and Google treats subdomains as separate entities for Search Console.

**Critical constraint:** Never modify the apex DNS A record. Only add the `landing` CNAME at the registrar.

### ADR-006 — Canonical strategy

**Decision:** Every page on `landing.edenhealthclubs.com` is its own canonical (`<link rel="canonical" href="https://landing.edenhealthclubs.com/...">`). We do **not** canonical to the main site.

**Why:** These are unique pages with unique local content. Canonicalling to the main site would tell Google "these don't matter" — the opposite of what we want.

**Edge case:** If a landing page becomes near-duplicate of a main-site page (e.g. landing's `/botox/` vs. main site's `/injectables/botox-wrinkle-relaxers/`), the landing page wins for the local SEO target keyword because the local angle differentiates it. If we ever decide a landing page shouldn't compete, we noindex it — we don't canonical-redirect to the main site.

### ADR-007 — JSON-LD structured data, not microdata

**Decision:** Schema.org markup via JSON-LD `<script>` blocks in the `<head>`. Never inline microdata or RDFa.

**Why:** Easier to maintain, Google's recommended format, doesn't interleave with display markup.

**Required types per page type:**

- Homepage: `Organization` \+ `LocalBusiness`  
- Service hub: `MedicalBusiness` \+ `MedicalProcedure` (or `MedicalTherapy`) \+ `BreadcrumbList`  
- Suburb hub: `LocalBusiness` (with area-served annotation) \+ `BreadcrumbList`  
- Service × Suburb combo: `MedicalBusiness` \+ `MedicalProcedure` \+ `LocalBusiness` (area-served) \+ `FAQPage` \+ `BreadcrumbList`

### ADR-008 — Performance budget enforced at PR time

**Decision:** Initial HTML ≤ 50 KB compressed per page. No render-blocking JS. Critical CSS inlined by Tailwind. Images served as WebP with explicit width/height attributes. LCP ≤ 2.0s on mobile 4G.

**Why:** Local search ranks reward mobile speed. Conversion rate also drops sharply past 3s LCP.

**Enforcement:** Phase 7 adds a CI step that runs `@lhci/cli` against a sampling of pages and fails the build below threshold.

### ADR-009 — GTM as single tag manager

**Decision:** One GTM container loaded in BaseLayout, configured to fire GA4, Google Ads conversions, and any future tags. No standalone GA4 snippet, no standalone Google Ads gtag.

**Why:** Single tag management surface \= single source of truth for tracking. Phase 5 work.

**Note on Eden's existing setup (decided):** Create a **new, dedicated** GTM container for the landing subdomain. The main-site container (`GTM-NHCKCCWX`) is managed by an outside agency (MRKTMADE); the landing site is managed in-house. Separating containers gives Eden full control over conversion tracking on landing without depending on agency turnaround or risking misconfiguration. The new container's ID lives in env var `PUBLIC_GTM_CONTAINER_ID`.

### ADR-010 — No client-side JS unless required

**Decision:** Astro components render server-side only by default. Only add `client:*` hydration when a component genuinely cannot work without JS.

**Why:** Performance budget. Most components on these pages are static markup.

**Likely exceptions:** FAQ accordion (can be CSS-only via `<details>` — preferred), mobile menu (CSS-only `:target` or `<details>` preferred). If JS is genuinely needed, use `client:visible` to defer.

### ADR-011 — TypeScript strict everywhere

**Decision:** `tsconfig.json` extends `astro/tsconfigs/strict`. No `any`, no `// @ts-ignore` without justification, no implicit `any` from JSON imports.

**Why:** Catches schema drift between data files and templates at compile time.

### ADR-012 — Inline lead form as primary CTA

**Decision:** The primary CTA on every page is an **inline lead capture form**, not a link out to the booking system. The form sits in a CTA strip near the top (above fold on desktop, just below hero on mobile) and a repeated CTA strip at the bottom of every page. Form fields:

- First Name — optional  
- Last Name — optional  
- Phone — **required**  
- Email — **required**  
- SMS opt-in — checkbox, default unchecked, TCPA-compliant copy  
- "Anything you'd like us to know" — optional textarea

Plus hidden fields populated automatically:

- `service_slug` — derived from the current page  
- `suburb_slug` — derived from the current page (when applicable)  
- `source_page` — current URL path  
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content` — pulled from URL params  
- `gclid` — Google Ads click ID, when present  
- `referrer` — document.referrer at form load

**Why:** Capturing leads directly on the landing page is higher-converting than sending users out to a separate booking flow for awareness-stage traffic. Hidden context fields give the sales team visibility into exactly which combo page produced the lead.

**Phone link still present:** `tel:` link in the header/footer is preserved as a secondary CTA. Phone conversions fire separately from form conversions in GTM.

### ADR-013 — GoHighLevel as lead submission backend

**Decision (CONFIRMED):** Lead forms POST to a GoHighLevel inbound webhook. Submission is server-side via a Vercel serverless function at `/api/lead` to keep the GHL webhook URL out of client-side code and to allow validation \+ spam filtering before forwarding.

**Why:** GHL is Eden's existing automation platform and the destination for the current lead form (the one shown in the screenshot Matt shared). Routing landing-page leads to GHL keeps them in the same downstream workflow (notifications, contact creation, follow-up automation).

**Integration approach: dedicated inbound webhook**, NOT a clone of the existing GHL-hosted form. Why:

1. GHL-hosted form embeds (iframes) are slow, accessibility-mediocre, and prevent us from running our own client-side validation, conversion tracking, or styling cleanly.  
2. Posting to the existing GHL form's public submit endpoint works, but couples our landing pages to that specific form's field IDs — if Eden ever changes the form structure in GHL, our landing pages break silently.  
3. A dedicated inbound webhook is loosely coupled: it accepts our payload shape, and a GHL workflow on the other side maps fields into contact records. Field changes on either side are explicit, not hidden.

**Implementation:**

- Astro API route at `src/pages/api/lead.ts` — runs as a Vercel serverless function. Configured via `output: 'hybrid'` in `astro.config.mjs` (static everywhere except this one route).  
- Function validates required fields (phone, email), normalizes phone to E.164, forwards the full payload (including hidden context fields) to GHL via `fetch()`.  
- Returns 200 \+ JSON `{ success: true }` on success, 400 on validation failure, 502 on upstream failure.  
- Honeypot field for spam filtering (hidden text input named `website` that real users won't fill but bots will).  
- Rate limit by IP (in-memory for v1, upgradable to Vercel KV in Phase 8).  
- Fires GTM `lead_submit` dataLayer event on success (client-side, after API success response).

**Payload shape sent to GHL webhook:**

```json
{
  "firstName": "string|null",
  "lastName": "string|null",
  "phone": "+1XXXXXXXXXX",
  "email": "string",
  "smsOptIn": false,
  "message": "string|null",
  "service": "service-slug",
  "suburb": "suburb-slug-or-null",
  "sourcePage": "/botox/greenwood-village/",
  "utmSource": "string|null",
  "utmMedium": "string|null",
  "utmCampaign": "string|null",
  "utmTerm": "string|null",
  "utmContent": "string|null",
  "gclid": "string|null",
  "referrer": "string|null",
  "submittedAt": "2026-05-13T12:34:56.789Z"
}
```

The GHL workflow on the receiving end maps these into GHL Contact custom fields. Matt sets that mapping in the GHL workflow UI during webhook setup.

**Environment variable required (Phase 3):** `GHL_WEBHOOK_URL` (Vercel project setting, server-side only — no `PUBLIC_` prefix).

### ADR-014 — Marketing copy must not name specific prescription medications until LegitScript certification

**Decision:** pSEO copy in `services.json`, `suburbs.json`, and any landing-page content must adhere to category and treatment-class language only — no specific prescription drug names — until Eden obtains LegitScript certification for healthcare advertising on Google Ads. Binding alongside the "Don't say" list in `PHASE_2_SPEC.md`.

Specifically prohibited in marketing copy: semaglutide, tirzepatide, Sermorelin, TB-500, BPC-157; GLP-1 brand names (Ozempic, Wegovy, Mounjaro, Zepbound); compounded-product names (Bi-Est, Testosterone Cypionate, Hair Force One); and any other specific compounded medication or pharmacy product name. Also prohibited: "FDA-approved" claims for compounded medications, and specific weight-loss outcome promises.

**Why:** Eden is not currently LegitScript certified. Any prescription medication mention on a landing page that runs as a Google Ads destination triggers automatic disapproval. Compounded medications and FDA-approved branded medications also have different regulatory profiles; landing-page copy that conflates them risks deceptive-advertising scrutiny under FDA/FTC rules. Specific outcome promises attract additional scrutiny.

**Re-evaluation trigger:** When Eden completes LegitScript certification, revisit this ADR. Some restrictions may relax; the FDA/FTC restrictions on compounded-medication framing will likely remain.

**Enforcement:** New batches of copy are grep-scanned for prohibited terms before merge. Voice review is part of the per-phase quality gate.

**Ruled out:** Per-page disclaimer banners (too verbose); attorney review of every entry (operational drag — constraints encoded into voice rules instead).

---

## 4\. Stack & pinned dependencies

| Layer | Choice | Version | Pin reason |
| :---- | :---- | :---- | :---- |
| Framework | Astro | ^5.18.1 | ADR-001 |
| Language | TypeScript | (via Astro) | strict mode |
| Styling | Tailwind CSS | ^4.1.18 | ADR-002 |
| Tailwind integration | @tailwindcss/vite | ^4.1.18 | ADR-002 |
| Sitemap | @astrojs/sitemap | latest at Phase 4 | TBD |
| Hosting | Vercel | n/a | static deploy |
| Domain | landing.edenhealthclubs.com | n/a | ADR-005 |
| Analytics | Google Tag Manager | n/a | ADR-009 |
| Node runtime (local dev) | Node 22.x | LTS | Astro requirement |

**Forbidden additions without an ADR:** any UI framework (React, Vue, Svelte beyond Astro's built-in optional support), any CSS framework other than Tailwind, any state management library, any backend / API runtime, any database.

**Allowed additions without an ADR:** dev tooling (Prettier, ESLint, Vitest, etc.), Astro integrations from the official integrations list, any pure-utility npm package with a clear use case.

---

## 5\. Repository layout

```
eden-local-pages/
├── ARCHITECTURE.md                  ← this file
├── PHASE_2_SPEC.md                  ← Phase 2 working spec
├── astro.config.mjs
├── package.json
├── package-lock.json
├── tsconfig.json
├── .gitignore
├── public/
│   ├── favicon.svg
│   ├── og/                          ← Phase 6: OG images (generated)
│   └── robots.txt                   ← Phase 4
├── src/
│   ├── data/
│   │   ├── types.ts                 ← Service, Suburb, etc.
│   │   ├── services.json            ← 13 entries
│   │   ├── suburbs.json             ← 12 entries
│   │   └── index.ts                 ← loader + validator
│   ├── layouts/
│   │   └── BaseLayout.astro         ← single shell, owns <head>
│   ├── components/                  ← Phase 3
│   │   ├── seo/
│   │   │   ├── SeoHead.astro        ← title, meta, OG, canonical
│   │   │   └── StructuredData.astro ← JSON-LD emitter
│   │   ├── layout/
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── Breadcrumbs.astro
│   │   ├── content/
│   │   │   ├── Hero.astro
│   │   │   ├── BenefitsList.astro
│   │   │   ├── HowItWorks.astro
│   │   │   ├── PricingCard.astro
│   │   │   ├── FAQAccordion.astro
│   │   │   ├── TrustBar.astro
│   │   │   ├── LocalProximity.astro ← only on suburb-aware pages
│   │   │   ├── RelatedServices.astro
│   │   │   ├── LeadForm.astro      ← inline lead capture (ADR-012)
│   │   │   └── CTAStrip.astro      ← wraps LeadForm + secondary phone link
│   │   └── ui/
│   │       ├── Button.astro
│   │       └── FormField.astro      ← typed input wrapper used by LeadForm
│   ├── lib/                         ← Phase 3
│   │   ├── seo.ts                   ← title/description templating
│   │   ├── schema-org.ts            ← JSON-LD builders
│   │   ├── urls.ts                  ← canonical URL helpers
│   │   └── tracking.ts              ← GTM dataLayer helpers
│   ├── pages/
│   │   ├── index.astro              ← homepage
│   │   ├── [service]/
│   │   │   ├── index.astro          ← service hub
│   │   │   └── [suburb].astro       ← service × suburb combo
│   │   ├── locations/
│   │   │   └── [suburb].astro       ← suburb hub
│   │   ├── api/
│   │   │   └── lead.ts              ← SSR endpoint, POST → GHL webhook (ADR-013)
│   │   └── 404.astro                ← Phase 7
│   └── styles/
│       └── global.css               ← @import "tailwindcss" + @theme
```

**File naming:** PascalCase for Astro components. kebab-case for `.ts` utility modules. kebab-case for all URL slugs.

---

## 6\. URL \+ routing architecture

### Route table

| Pattern | File | Generated count | Description |
| :---- | :---- | :---- | :---- |
| `/` | `pages/index.astro` | 1 | Homepage |
| `/[service]/` | `pages/[service]/index.astro` | 13 | Service hub |
| `/locations/[suburb]/` | `pages/locations/[suburb].astro` | 12 | Suburb hub |
| `/[service]/[suburb]/` | `pages/[service]/[suburb].astro` | 156 | Combo |
| `/api/lead` | `pages/api/lead.ts` | 1 (SSR endpoint) | Lead form POST → GHL webhook (ADR-013) |

### URL rules

- All URLs lowercase, kebab-case  
- Trailing slashes consistent with Astro default (set explicitly in `astro.config.mjs`)  
- No query strings in canonical URLs (analytics params permitted but stripped from canonical)  
- 404 catches anything else; suggests up to 3 nearest matches

### `getStaticPaths` contract (Phase 3\)

Each dynamic route exports a `getStaticPaths` that:

1. Imports `services` / `suburbs` from `src/data/index.ts`.  
2. Returns `[{ params, props }]` where `props` contains the typed entity (Service or Suburb or both).  
3. Combo route returns `services.length × suburbs.length` paths.  
4. Never returns synthetic / placeholder paths in production builds.

Example contract for `pages/[service]/[suburb].astro`:

```ts
export async function getStaticPaths() {
  return services.flatMap((service) =>
    suburbs.map((suburb) => ({
      params: { service: service.slug, suburb: suburb.slug },
      props: { service, suburb },
    }))
  );
}
```

### Canonical URL helper (`src/lib/urls.ts`, Phase 3\)

```ts
// Pseudo-code — Codex implements
const SITE_ORIGIN = "https://landing.edenhealthclubs.com";

export function canonicalUrl(path: string): string {
  // Always absolute, always trailing-slash-correct
}
export function serviceUrl(slug: string): string;
export function suburbUrl(slug: string): string;
export function comboUrl(serviceSlug: string, suburbSlug: string): string;
```

---

## 7\. Data architecture

See `PHASE_2_SPEC.md` for the full schema. Key points the architecture commits to:

- Data is **immutable at build time**. Pages render exactly what's in JSON; no runtime fetches.  
- The validator in `src/data/index.ts` is the **single contract enforcement point**. All cross-reference integrity, slug uniqueness, and minimum-depth rules live there.  
- Anything that consumes `services`/`suburbs` does so via `getService()` / `getSuburb()` helpers, not direct array indexing. Phase 3 components must follow this rule.  
- TypeScript types are derived from `types.ts`. JSON files are typed `as Service[]` and `as Suburb[]` at the import boundary only.

---

## 8\. Component architecture & contracts

### Composition principle

Pages are **thin**. They import a layout, fetch their typed entity from `getStaticPaths` props, and arrange components. They contain no inline copy beyond what comes from data. They contain no inline schema markup — that's delegated to `<StructuredData>`.

### Component prop contracts

Every content component takes typed props derived from the data layer. Examples:

```ts
// src/components/content/Hero.astro
interface Props {
  service?: Service;
  suburb?: Suburb;
  variant: "service-hub" | "suburb-hub" | "combo";
}

// src/components/content/FAQAccordion.astro
interface Props {
  items: FAQ[];
  emitJsonLd: boolean; // default true on FAQ-bearing pages
}

// src/components/content/PricingCard.astro
interface Props {
  pricing: Pricing;
  ctaText: string;
  ctaUrl: string;
}
```

### Variant-driven hero copy

The `Hero` component switches copy based on `variant`:

- `service-hub` → `service.name` \+ `service.longDescription`  
- `suburb-hub` → "Eden Health Club in {suburb.name}" \+ `suburb.neighborhoodBlurb`  
- `combo` → `service.name` in `{suburb.name}` \+ a templated sentence that interpolates `service.shortDescription` and `suburb.demographicHook`

This is **the only place** combo copy is composed. Don't sprinkle combo logic across other components.

### CSS conventions

- Tailwind utilities only; no custom CSS unless absolutely required  
- Brand colors via `bg-eden-navy`, `text-eden-green`, etc.  
- Spacing scale follows Tailwind defaults  
- Max content width: `max-w-3xl` for prose, `max-w-6xl` for layout containers  
- Mobile-first; `sm:` `md:` `lg:` breakpoints only when needed

### Accessibility baseline

- Landmark elements (`<main>`, `<nav>`, `<footer>`) on every page  
- `<h1>` exactly once per page  
- `<h2>` for section headers, `<h3>` for sub-sections  
- All `<img>` have `alt`; decorative images use `alt=""`  
- All interactive elements keyboard-focusable; visible focus rings (Tailwind `focus-visible:ring-*`)  
- Color contrast: navy on white, navy/80 on white both pass WCAG AA — no other text combinations

---

## 9\. SEO \+ structured data

### Title \+ meta description templating (`src/lib/seo.ts`, Phase 3\)

```
Page type            Title pattern                                                       Meta description pattern
-----------          --------                                                            ----------
Homepage             Eden Health Club — Greenwood Village Wellness                       (from BaseLayout default)
Service hub          {service.name} in Greenwood Village | Eden Health Club              {service.shortDescription} Eden Health Club, Greenwood Village.
Suburb hub           Eden Health Club in {suburb.name}, CO                               {suburb.neighborhoodBlurb}
Combo                {service.name} in {suburb.name}, CO | Eden Health Club              {service.shortDescription} Serving {suburb.name} from our Greenwood Village clinic.
```

Codex must implement the templating functions in `src/lib/seo.ts`. Templates are derived in code, never hand-written per page.

### Open Graph

Every page emits:

- `og:title` \= page title  
- `og:description` \= meta description  
- `og:type` \= "website"  
- `og:url` \= canonical URL  
- `og:image` \= page-specific OG image (Phase 6\) or brand default until Phase 6

### JSON-LD structured data (`src/lib/schema-org.ts`, Phase 4\)

Codex implements typed builders for each schema type. Single-page combo example:

```ts
buildJsonLd({
  organization: orgFromConfig(),
  localBusiness: localBusinessForSuburb(suburb),
  medicalProcedure: medicalProcedureForService(service),
  faqPage: faqPageFromService(service),
  breadcrumbs: breadcrumbsFor("combo", { service, suburb }),
});
```

Each builder returns a serializable JSON-LD object. `<StructuredData>` Astro component renders the array as `<script type="application/ld+json">` blocks (one per type — never combine into `@graph` for v1; simpler to debug).

### Sitemap \+ robots.txt (Phase 4\)

- `@astrojs/sitemap` integration in `astro.config.mjs`  
- Sitemap auto-includes every generated page  
- `robots.txt` permits all, references the sitemap

---

## 10\. Analytics \+ conversion tracking (Phase 5\)

### GTM placement

- Container script in `<head>` (loaded async)  
- `<noscript>` iframe immediately after `<body>` opens  
- Both placements emitted from `BaseLayout.astro`  
- Container ID stored in `astro.config.mjs` or `.env` — never hardcoded in templates

### dataLayer events

Standardized events Codex must wire into components via a `tracking.ts` helper:

| Event name | Fires on | Required params |
| :---- | :---- | :---- |
| `lead_submit` | Lead form successful submit | `service_slug`, `suburb_slug?`, `sms_opt_in` |
| `lead_submit_attempt` | Lead form submit clicked (pre-validation) | `service_slug`, `suburb_slug?` |
| `lead_submit_error` | Lead form failed (validation or upstream) | `service_slug`, `error_type` |
| `phone_click` | `tel:` link tap | `phone_number`, `page_path` |
| `scroll_75` | 75% scroll depth | `page_path` |
| `view_faq` | FAQ item opened | `service_slug`, `question_id` |

GTM tag config (configured in the GTM UI, not in code):

- GA4 config tag firing on all pages, with hostname dimension so landing-subdomain traffic is filterable  
- Google Ads conversion tag firing on `lead_submit` (primary conversion) and `phone_click` (secondary)  
- Conversion value set to **$0** in v1 (per decision); revisit when we have data on lead → booked-consult rate  
- Enhanced conversions: wire email \+ phone from the form submit event so Google Ads can match offline conversions back to ads (Phase 5\)

---

## 11\. Build, deploy, observability

### Local development

```
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to /dist
npm run preview    # serve /dist locally
```

### Vercel deploy

- Auto-deploys on push to `main`  
- Preview deploys on every PR  
- Build command: `npm run build`  
- Output directory: `dist`  
- Node version: 22.x (set in Vercel project settings)  
- Environment variables:  
  - Phase 3: `GHL_WEBHOOK_URL` — GoHighLevel inbound webhook for `/api/lead` (server-only; not prefixed with `PUBLIC_`)  
  - Phase 5: `PUBLIC_GTM_CONTAINER_ID` — set to `GTM-NHCKCCWX` (existing main-site container, per decisions log)  
  - All phases: `PUBLIC_SITE_ORIGIN` \= `https://landing.edenhealthclubs.com`

### Observability

- Vercel build logs for build failures  
- Google Search Console (Phase 4\) for index coverage \+ impressions  
- GA4 (Phase 5\) for traffic \+ conversion events  
- Lighthouse CI (Phase 7\) for performance regressions on PR

---

## 12\. Coding conventions

### Astro / TypeScript

- TypeScript strict, no `any`, no `// @ts-ignore` without justification comment  
- Astro components: `PascalCase.astro`  
- Utility modules: `kebab-case.ts`  
- Component prop interfaces named `Props` and declared at top of frontmatter  
- Imports grouped: 1\) standard lib, 2\) packages, 3\) `@/` alias if added, 4\) relative  
- No default exports for utilities; named exports only. Astro components must be default exports.

### Tailwind

- Utility classes only; avoid `@apply` unless extracting a literally repeated 5+ class combo  
- Order classes: layout → spacing → typography → color → state → animation (rough convention; not enforced by linter in v1)  
- Custom values via theme tokens, never arbitrary `[#hex]` in templates

### Git

- Branch naming: `phase-N-{slug}` (e.g. `phase-3-routing`) or `feat/{slug}` for sub-features  
- Commit format: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`)  
- Commit scope when meaningful (e.g. `feat(seo): add canonical helper`)  
- PRs always link to phase being executed; PR body lists files touched and acceptance criteria met  
- Squash-merge PRs into `main`

### File header comment (utility modules)

Every `.ts` utility file starts with a short header comment describing purpose. Example:

```ts
// src/lib/seo.ts
// Title and meta description templating. Pure functions over typed
// inputs; no I/O.
```

---

## 13\. Quality gates per phase

A phase is **done** when every gate passes:

1. `npm run build` succeeds with zero errors and zero warnings.  
2. `tsc --noEmit` passes (Astro runs this internally; verify locally if needed).  
3. The data validator (`src/data/index.ts`) passes — gate active from Phase 2 onward.  
4. Manual smoke test on `npm run dev`: each new page type loads, no console errors, layout intact at 375px and 1280px viewports.  
5. Phase-specific quality gates (defined in each phase's spec).  
6. Commit history is clean (no fixup/wip commits in `main`).

---

## 14\. Phase plan

### Phase 1 — Scaffold (DONE)

Astro project, Tailwind, BaseLayout, placeholder routes with empty `getStaticPaths`, coming-soon homepage.

### Phase 2 — Data layer (IN PROGRESS)

`src/data/types.ts`, `services.json` (13), `suburbs.json` (12), `index.ts` (loader \+ validator). See `PHASE_2_SPEC.md`.

**Quality gate:** validator passes; data files match the canonical example depth.

### Phase 3 — Dynamic routes \+ component library \+ lead form

- Populate `getStaticPaths` in the 3 dynamic route files to generate real pages from data  
- Build the component library under `src/components/` per section 8  
- Build `src/lib/seo.ts` and `src/lib/urls.ts`  
- Build the **inline lead form component** (`LeadForm.astro`) per ADR-012  
- Build the **`/api/lead` serverless function** that validates \+ forwards to GHL per ADR-013 (requires `GHL_WEBHOOK_URL` env var in Vercel)  
- Build `src/lib/tracking.ts` minimal helpers used by the form for `lead_submit_attempt` / `lead_submit` / `lead_submit_error` (full GTM wiring lands in Phase 5\)  
- Each generated page renders Hero, Benefits, How It Works, Pricing, FAQ, Trust Bar, Related, Lead Form (in CTA Strip), Footer  
- Each page has unique title \+ meta description per templating rules

**Quality gate:** 182 pages generated; manual review of 5 randomly sampled combo pages shows unique copy, correct hero variant, correct cross-links, no console errors. Lead form submits successfully to GHL on a test lead with the hidden context fields populated correctly.

### Phase 4 — SEO \+ structured data \+ sitemap

- `src/lib/schema-org.ts` with typed builders  
- `<StructuredData>` component  
- `@astrojs/sitemap` integration  
- `public/robots.txt`  
- Verify with Google Rich Results Test on 1 sampled page per type

**Quality gate:** every page type passes Google Rich Results Test. Sitemap lists 182 URLs. robots.txt validates.

### Phase 5 — Analytics \+ conversion tracking

- Create new GTM container for landing subdomain  
- Wire into BaseLayout  
- Build `src/lib/tracking.ts` dataLayer helpers  
- Instrument all CTA / phone / booking events per section 10  
- Configure tags in GTM UI (GA4, Google Ads conversion)  
- Verify with GTM Preview mode

**Quality gate:** Tag Assistant shows all expected events firing on representative pages. GA4 real-time report receives events. Google Ads conversion test fires.

### Phase 6 — Imagery \+ OG images

- Source or commission imagery for hero backgrounds (per category, not per service to keep volume manageable)  
- Generate per-page OG images via build-time script (e.g. Satori or Astro built-in OG image generation)  
- Add `<img>` lazy-loading \+ `loading="lazy"` \+ explicit width/height  
- Move imagery to `/public/` \+ serve as WebP

**Quality gate:** every page has a distinct OG image; LCP unchanged from Phase 3 baseline.

### Phase 7 — Performance, A11y, launch checklist

- Run Lighthouse CI on a representative sample (top 10 by predicted traffic \+ 1 from each page type)  
- Fix any score below threshold (ADR-008)  
- Run axe on representative pages  
- Add 404 page  
- Final canonical / sitemap / robots.txt verification  
- Submit sitemap to Google Search Console

**Quality gate:** Lighthouse mobile ≥ 90 / 95 / 95 / 95 on the sample. Search Console accepts sitemap. No critical axe violations.

### Phase 8+ — Post-launch (not committed)

Candidates (ordered by likely priority):

- Lead capture forms with server-side endpoint  
- A/B testing infrastructure (e.g. Vercel split rollouts)  
- Promo banner / seasonal messaging surface  
- Additional services or suburbs  
- Per-neighborhood pages (sub-axis)  
- Reviews integration (pulling from GBP)  
- Search Console keyword tracking dashboard  
- Migration of edited service copy back to the main site

---

## 15\. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
| :---- | :---- | :---- | :---- |
| Google flags pages as templated / doorway content | Medium | High | Unique copy per combo (suburb hook \+ service short desc weaving), no boilerplate, hub pages establish topical authority, FAQs vary per service |
| Self-cannibalization with main edenhealthclubs.com | Medium | Medium | Distinct local intent in titles \+ canonicals; subdomain separation; main site outranks for brand searches, landing wins for local intent |
| Build time grows past Vercel free tier limits | Low | Medium | Static output is cheap; monitor; if needed parallelize `getStaticPaths` or split data files |
| Tailwind / Astro upgrade breaks build | Medium | Low | Versions pinned; upgrade tracked in own PR with manual review |
| `@tailwindcss/vite` ships fix for rolldown-vite | Low | Low (opportunity) | Re-evaluate Astro 6 upgrade in Phase 8 |
| Codex drifts from voice rules during bulk drafting | Medium | Medium | `/codex:adversarial-review` pass on each batch; canonical examples in spec; humans review before merge |
| Lighthouse score drops on PR | Medium | Medium | Phase 7 adds Lighthouse CI gate |
| DNS / cert issue at landing subdomain | Low | High | Already mitigated; monitor first 24h post-add via dnschecker.org \+ Vercel domain status |
| Lead form spam / bot submissions | High | Medium | Honeypot field \+ IP rate limit in `/api/lead` (Phase 3); upgrade to Cloudflare Turnstile or hCaptcha if abuse persists (Phase 8\) |
| GHL webhook downtime drops leads | Low | High | `/api/lead` logs failed submissions; consider Vercel KV-backed retry queue in Phase 8 if it ever happens in production |

---

## 16\. Non-goals (explicit)

We are not building, in v1–v7:

- A CMS or admin UI for non-technical editors  
- A user account / login system  
- Full SSR (we will have **one** server-rendered API route at `/api/lead` for form submission — the rest of the site stays fully static)  
- A database (lead storage is delegated to GHL)  
- Embedded booking widgets (we link out to booking subdomain as a secondary path; primary CTA is the inline lead form)  
- `aggregateRating` schema.org markup (deferred to Phase 8 — needs a real review data pipeline)  
- Per-page OG image generation (Phase 8 candidate; v1 uses a single brand-default OG image)  
- Multilingual support  
- Native mobile apps  
- E-commerce  
- A blog or content marketing surface (lives on main site at `/blog/`)  
- Reviews aggregation from third-party platforms  
- Live chat  
- A/B testing infrastructure (Phase 8 candidate; requires meaningful per-page traffic first)

If a request lands on any of these, it goes into the Phase 8+ backlog, not v1.

---

## 17\. Decisions log (resolved questions)

These were open questions in the first draft of this document. Resolved on 2026-05-13. Codex should treat each as a binding decision.

1. **GTM container:** Create a **new, dedicated** GTM container for the landing subdomain (in-house owned, separate from the agency-managed main-site container `GTM-NHCKCCWX`). New container ID to be set in `PUBLIC_GTM_CONTAINER_ID` env var once created.  
2. **Phone number:** `720-605-7678` (main number). Stored as a single config value so it can be swapped for a tracked number later without template changes.  
3. **CTA destination:** Inline lead form (per ADR-012). Form fields: phone \+ email required; first/last name \+ SMS opt-in \+ free-text optional. Hidden context fields auto-populated (service\_slug, suburb\_slug, source\_page, UTM params, gclid, referrer). Submission via `/api/lead` serverless function forwarding to GHL webhook (per ADR-013, pending GHL confirmation).  
4. **Phone tap & form submit conversion value:** $0 in v1. Revisit once lead → consult conversion rate is measurable in Phase 5+.  
5. **OG image strategy:** Single brand-default OG image (1200×630px) for all pages in v1. Per-page OG generation deferred to Phase 8 — pSEO traffic comes from search, not social, so per-page OG ROI is low until proven.  
6. **Imagery:** Real photography or properly-licensed stock. No AI-generated faces or bodies in any medical/aesthetic context (credibility risk). Phase 6 may commission \~8–12 service-category photos for visual variety; reused across combos to keep cost down.  
7. **Schema.org `aggregateRating`:** Not in v1. Requires reliable review data pipeline (GBP API or curated feed). Add in Phase 8 once a feed exists. v1 still emits MedicalProcedure/MedicalTherapy, LocalBusiness, FAQPage, and BreadcrumbList JSON-LD — those don't depend on review data.  
8. **Sitemap submission:** Submit to both Google Search Console (mandatory) and Bing Webmaster Tools (5-minute setup; non-trivial Bing share among Colorado healthcare demographics).  
9. **Phase 8 prioritization (post-launch order):**  
   1. Search Console keyword performance dashboard  
   2. Lead form analytics enrichment (UTM passthrough into GHL, abandonment tracking)  
   3. Per-neighborhood pages for high-performing suburbs (data-driven expansion)  
   4. `aggregateRating` schema.org markup with a real review feed  
   5. A/B testing infrastructure (only when per-page traffic supports significance)

## 17a. Setup tasks Matt owns before Phase 3 / Phase 5

These are admin tasks outside the codebase. They don't block Phase 2\.

- **Create new GTM container** (blocks Phase 5). Steps below in this document. Result: a `GTM-XXXXXXX` ID that goes into Vercel env var `PUBLIC_GTM_CONTAINER_ID`.  
- **Create GHL inbound webhook** (blocks Phase 3 form testing — does NOT block Phase 3 code generation). Steps below. Result: a webhook URL that goes into Vercel env var `GHL_WEBHOOK_URL`.  
- **GHL custom fields mapping** (during webhook setup): add custom fields in GHL to receive `service`, `suburb`, `sourcePage`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`, `gclid`, `referrer`. Or accept the lead with a single "Lead Notes" field that gets the full JSON dump — simpler but less queryable in GHL. (Architecture default: discrete custom fields per item, for filtering and reporting inside GHL.)  
- **Thank-you state decision** (Phase 3 implementation detail): in-place success message after submit (default), or redirect to a dedicated `/thank-you/` page? Dedicated page is slightly better for conversion tracking accuracy in Google Ads. Architecture default: in-place success. Matt can override during Phase 3\.  
- **SMS opt-in TCPA copy:** Use Eden's existing wording from the current GHL form ("I agree to receive SMS messages from Eden Health Club. Reply STOP at any time to opt out. Message & data rates may apply.") verbatim. Decided — matches existing legal-cleared copy.

## 17b. Setup walkthrough — new GTM container

1. Go to [https://tagmanager.google.com](https://tagmanager.google.com) (sign in with the Google account that owns the existing Eden GTM account).  
2. Inside the Eden GTM account, click "Create Container" (top right of the account view).  
3. Container name: `Eden Health Club — Landing Pages`  
4. Target platform: **Web**  
5. Click Create. Accept the Terms of Service.  
6. You'll be shown the install snippet (two `<script>` blocks). **Don't paste them into your site manually** — Phase 5 wires this into BaseLayout via the env var. Just close the install snippet dialog.  
7. In the container, click the container ID at the top (it'll look like `GTM-XXXXXXX`). Copy it.  
8. In Vercel project settings → Environment Variables, add:  
   - Key: `PUBLIC_GTM_CONTAINER_ID`  
   - Value: the `GTM-XXXXXXX` ID you just copied  
   - Environments: Production \+ Preview \+ Development  
9. Done. Phase 5 code will read it automatically.

## 17c. Setup walkthrough — GHL inbound webhook

This creates a workflow trigger in GHL that listens for our landing-page form submissions.

1. Log in to GoHighLevel. In the left sidebar, go to **Automation → Workflows**.  
2. Click **\+ Create Workflow** → **Start from Scratch**.  
3. Workflow name: `Landing Pages — Lead Capture`  
4. Click the trigger node (at the top of the workflow canvas) and select **Inbound Webhook** from the trigger list.  
5. GHL generates a webhook URL. It will look like `https://services.leadconnectorhq.com/hooks/...`. **Copy it.**  
6. In Vercel project settings → Environment Variables, add:  
   - Key: `GHL_WEBHOOK_URL`  
   - Value: the webhook URL you just copied  
   - Environments: Production \+ Preview \+ Development  
7. Back in GHL, in the inbound webhook trigger config, paste the example payload (from ADR-013 above) into the "Sample Payload" field so GHL knows the field shape. Save.  
8. Add workflow actions below the trigger:  
   - **Create / Update Contact** — map `email`, `phone`, `firstName`, `lastName` from the inbound payload to standard contact fields.  
   - **Set Custom Field Values** — map `service`, `suburb`, `sourcePage`, `utmSource`, `utmMedium`, `utmCampaign`, `utmTerm`, `utmContent`, `gclid`, `referrer` to custom fields. (Create these custom fields in GHL Settings → Custom Fields first if they don't exist.)  
   - **Add to Pipeline** — drop the new lead into whatever stage your existing form workflow uses (e.g. "New Inquiry").  
   - **Send notification** — Slack / email / SMS to the team, matching what the existing form workflow does.  
   - Optional: tag the contact with `landing-pages` so it's easy to filter inside GHL reports.  
9. Publish the workflow.

**Test the webhook before Phase 3 deploys:** in the GHL inbound webhook trigger settings, there's usually a "Test" button that lets you fire a sample payload. Verify a test contact appears in GHL with all fields populated. Once that works, Phase 3's `/api/lead` route will just work — Codex handles everything else in code.

---

## 18\. How to use this document

**If you are Codex receiving an implementation task:**

1. Read this whole file once at the start of a session. Don't skim. The decisions are load-bearing.  
2. Read the phase spec for the phase you're executing (e.g. `PHASE_2_SPEC.md` for Phase 2).  
3. If you encounter a question that the architecture doesn't answer, **don't invent an answer**. Either flag it to the human running the session or leave a `// TODO(arch):` comment with the question.  
4. If you find yourself wanting to deviate from an ADR, **stop and surface it**. Don't just do it.  
5. Match the conventions in section 12 without being asked.

**If you are a human reviewing AI-generated work:**

1. Check the ADRs first — most quality issues are ADR violations.  
2. Check the quality gates for the phase — they're the acceptance criteria.  
3. Check the conventions in section 12 — TypeScript strict, file naming, etc.  
4. Look at the risk table — if a PR doesn't address a relevant risk, push back.

---

**Last updated:** Phase 2 in progress, May 13, 2026\. **Owner:** Matt Bandelier ([matt@edenhealthclubs.com](mailto:matt@edenhealthclubs.com)). **Architect of record (this doc):** Claude in Cowork mode.  
