# Phase 3 Spec — Dynamic Routes, Component Library, and Lead Form

Repo: eden-local-pages Status: Phase 2 shipped. This phase generates the 182 real pages and the inline lead capture system that feeds GHL. ADR anchors: ARCHITECTURE.md ADR-001 through ADR-014 are binding.

## 1. Goal

After Phase 3:

- 182 pages live at landing.edenhealthclubs.com — homepage, 13 service hubs, 12 suburb hubs, 156 combo pages
- Every page renders a consistent component library: Hero, BenefitsList, HowItWorks, PricingCard, FAQAccordion, TrustBar, LocalProximity (combo + suburb hub only), RelatedServices, LeadForm (CTAStrip), Footer
- Lead form submits to GHL via /api/lead serverless function with full UTM + source-page context
- Build still passes; Lighthouse mobile ≥85 on a sample combo page (final tightening happens in Phase 7)

What this phase does NOT do:

- Schema.org JSON-LD (Phase 4)
- Sitemap + robots.txt (Phase 4)
- GTM analytics wiring (Phase 5)
- Custom imagery (Phase 6)
- 404 page (Phase 7)

## 2. Prerequisites

Before starting Phase 3, confirm:

- Phase 2 is merged to main and deployed on Vercel (commit 9e17182 or later).
- GHL_WEBHOOK_URL is set in Vercel project settings → Environment Variables → Production + Preview. Sensitive var. No PUBLIC_ prefix.
- ARCHITECTURE.md and PHASE_2_SPEC.md are committed and current.
- GHL inbound webhook workflow exists, is Published, and is configured to accept the payload shape in ADR-013.
- PUBLIC_GTM_CONTAINER_ID is not required for this phase — leave it blank or set to a placeholder string. Phase 5 wires GTM. Phase 3 code calls pushDataLayer() helpers that no-op silently if GTM is absent.

## 3. How to use this spec

Open Claude Code in the repo. Paste this in three stages following the same hybrid pattern as Phase 2:

- Stage A — scaffolding (Claude does itself): types stubs, src/lib/urls.ts, src/lib/seo.ts, src/lib/tracking.ts, BaseLayout updates, all three dynamic route files wired with getStaticPaths, and the /api/lead serverless function. No components yet beyond the canonical combo page.
- Stage B — canonical combo page sample (Claude does itself): build the full /botox/greenwood-village/ combo page end-to-end with every component implemented. This is the quality-gate sample. Review before extending.
- Stage C — extend to all 182 pages (/codex:rescue): once sample is approved, Codex generalizes the component implementations so every dynamic route renders correctly.

Adversarial review pass after Stage C, then commit.

## 4. Files to create / modify

### New files

```
src/
├── lib/
│   ├── urls.ts              ← canonical URL helpers
│   ├── seo.ts               ← title + meta description templating
│   └── tracking.ts          ← GTM dataLayer push helpers (Phase 5 wires GTM itself)
├── components/
│   ├── content/
│   │   ├── Hero.astro
│   │   ├── BenefitsList.astro
│   │   ├── HowItWorks.astro
│   │   ├── PricingCard.astro
│   │   ├── FAQAccordion.astro
│   │   ├── TrustBar.astro
│   │   ├── LocalProximity.astro
│   │   ├── RelatedServices.astro
│   │   ├── LeadForm.astro
│   │   └── CTAStrip.astro
│   ├── layout/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   └── Breadcrumbs.astro
│   └── ui/
│       ├── Button.astro
│       └── FormField.astro
└── pages/
    └── api/
        └── lead.ts          ← Vercel serverless function
```

```
astro.config.mjs             ← add output: 'hybrid' so /api/lead can be SSR
src/layouts/BaseLayout.astro ← inject Header + Footer; accept ogImage prop; emit JSON-LD via Phase 4 hook
src/pages/index.astro        ← rebuild homepage with real component composition
src/pages/[service]/index.astro
src/pages/[service]/[suburb].astro
src/pages/locations/[suburb].astro
```

## 5. Astro hybrid output mode

Add to astro.config.mjs:

```
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'hybrid',
  adapter: vercel(),
  vite: { plugins: [tailwindcss()] },
});
```

output: 'hybrid' keeps every page static by default. Only src/pages/api/lead.ts opts into SSR via the export below. This preserves the performance benefits of static generation while letting the lead form POST server-side.

Install: npm install --save @astrojs/vercel

## 6. src/lib/urls.ts — canonical URL helpers

```
// src/lib/urls.ts
// Pure functions that produce absolute canonical URLs for every page type.
// No I/O. Imported by templates and SEO helpers.

const SITE_ORIGIN = "https://landing.edenhealthclubs.com";

function withTrailingSlash(path: string): string {
  if (path === "" || path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

export function canonicalUrl(path: string): string {
  return `${SITE_ORIGIN}${withTrailingSlash(path)}`;
}

export function homeUrl(): string {
  return canonicalUrl("/");
}

export function serviceHubUrl(serviceSlug: string): string {
  return canonicalUrl(`/${serviceSlug}`);
}

export function suburbHubUrl(suburbSlug: string): string {
  return canonicalUrl(`/locations/${suburbSlug}`);
}

export function comboUrl(serviceSlug: string, suburbSlug: string): string {
  return canonicalUrl(`/${serviceSlug}/${suburbSlug}`);
}

export const ORIGIN = SITE_ORIGIN;
```

## 7. src/lib/seo.ts — title + meta templating

```
// src/lib/seo.ts
// Title and meta description templating per page type.
// All Greenwood Village references hard-coded — this is a single-clinic system.

import type { Service, Suburb } from "../data/types";

const CLINIC_LOCATION = "Greenwood Village";

export interface PageMeta {
  title: string;
  description: string;
}

export function homepageMeta(): PageMeta {
  return {
    title: "Eden Health Club — Greenwood Village Wellness Clinic",
    description:
      "Functional medicine, aesthetics, recovery, and fitness under one roof in Greenwood Village. Licensed Experts. Advanced Credentials. Unmatched Care.",
  };
}

export function serviceHubMeta(service: Service): PageMeta {
  return {
    title: `${service.name} in ${CLINIC_LOCATION} | Eden Health Club`,
    description: `${service.shortDescription} Eden Health Club, ${CLINIC_LOCATION}.`.slice(0, 180),
  };
}

export function suburbHubMeta(suburb: Suburb): PageMeta {
  return {
    title: `Eden Health Club in ${suburb.name}, CO`,
    description: suburb.neighborhoodBlurb.slice(0, 180),
  };
}

export function comboMeta(service: Service, suburb: Suburb): PageMeta {
  return {
    title: `${service.name} in ${suburb.name}, CO | Eden Health Club`,
    description: `${service.shortDescription} Serving ${suburb.name} from our ${CLINIC_LOCATION} clinic.`.slice(0, 180),
  };
}
```

## 8. src/lib/tracking.ts — dataLayer helpers (GTM-ready, no-op when GTM absent)

```
// src/lib/tracking.ts
// Client-side helpers for pushing events to GTM's dataLayer.
// No-op silently when GTM is not loaded (so Phase 3 ships before GTM is wired in Phase 5).

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}

// Convenience wrappers — one per standardized event from ADR-009.
export function trackLeadSubmitAttempt(serviceSlug: string, suburbSlug: string | null): void {
  pushEvent("lead_submit_attempt", { service_slug: serviceSlug, suburb_slug: suburbSlug });
}

export function trackLeadSubmit(serviceSlug: string, suburbSlug: string | null, smsOptIn: boolean): void {
  pushEvent("lead_submit", {
    service_slug: serviceSlug,
    suburb_slug: suburbSlug,
    sms_opt_in: smsOptIn,
  });
}

export function trackLeadSubmitError(serviceSlug: string, suburbSlug: string | null, errorType: string): void {
  pushEvent("lead_submit_error", {
    service_slug: serviceSlug,
    suburb_slug: suburbSlug,
    error_type: errorType,
  });
}

export function trackPhoneClick(phoneNumber: string): void {
  pushEvent("phone_click", { phone_number: phoneNumber, page_path: window.location.pathname });
}
```

## 9. src/pages/api/lead.ts — serverless function

```
// src/pages/api/lead.ts
// SSR endpoint. Validates lead form submissions, normalizes phone format,
// forwards to GHL inbound webhook with full context.

import type { APIRoute } from "astro";

export const prerender = false; // opt this route out of static; runs as Vercel serverless function

interface LeadPayload {
  firstName: string | null;
  lastName: string | null;
  phone: string;
  email: string;
  smsOptIn: boolean;
  message: string | null;
  service: string;
  suburb: string | null;
  sourcePage: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  gclid: string | null;
  referrer: string | null;
  submittedAt: string;
  // Honeypot field — bots fill this, real users don't
  website?: string;
}

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return null; // invalid
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return new Response(JSON.stringify({ success: false, error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Honeypot — if filled, silently 200 (don't tell bots they failed)
  if (body.website && body.website.length > 0) {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate required fields
  if (!body.phone || !body.email) {
    return new Response(JSON.stringify({ success: false, error: "missing_required_fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!isValidEmail(body.email)) {
    return new Response(JSON.stringify({ success: false, error: "invalid_email" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const normalizedPhone = normalizePhone(body.phone);
  if (!normalizedPhone) {
    return new Response(JSON.stringify({ success: false, error: "invalid_phone" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const webhookUrl = import.meta.env.GHL_WEBHOOK_URL;
  if (!webhookUrl) {
    return new Response(JSON.stringify({ success: false, error: "missing_webhook_config" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const payload = {
    firstName: body.firstName,
    lastName: body.lastName,
    phone: normalizedPhone,
    email: body.email.trim().toLowerCase(),
    smsOptIn: !!body.smsOptIn,
    message: body.message,
    service: body.service,
    suburb: body.suburb,
    sourcePage: body.sourcePage,
    utmSource: body.utmSource,
    utmMedium: body.utmMedium,
    utmCampaign: body.utmCampaign,
    utmTerm: body.utmTerm,
    utmContent: body.utmContent,
    gclid: body.gclid,
    referrer: body.referrer,
    submittedAt: body.submittedAt || new Date().toISOString(),
  };

  try {
    const upstream = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!upstream.ok) {
      return new Response(JSON.stringify({ success: false, error: "upstream_error" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ success: false, error: "upstream_unreachable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

## 10. src/components/content/LeadForm.astro — canonical implementation

The form is server-rendered as plain HTML with progressive enhancement via inline <script>. JS is responsible for: capturing UTM params from URL, capturing gclid from URL, capturing document.referrer, packaging the payload, POSTing to /api/lead, and showing success/error state in-place (per ADR — in-place success message default, not redirect).

```
---
// src/components/content/LeadForm.astro
// Inline lead capture form. POSTs to /api/lead, fires GTM dataLayer event on success.
// Service/suburb context injected via props from the parent page.

interface Props {
	serviceSlug: string;
	suburbSlug: string | null;
	heading?: string;
	subheading?: string;
}

const {
	serviceSlug,
	suburbSlug = null,
	heading = "Book a consult",
	subheading = "We'll reach out within one business day.",
} = Astro.props;
---

<section class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
	<h2 class="text-2xl font-semibold tracking-tight text-eden-navy">{heading}</h2>
	<p class="mt-1 text-sm text-slate-600">{subheading}</p>

	<form
		class="mt-6 space-y-4"
		data-lead-form
		data-service-slug={serviceSlug}
		data-suburb-slug={suburbSlug ?? ""}
		novalidate
	>
		<div class="grid gap-4 sm:grid-cols-2">
			<label class="block">
				<span class="text-sm font-medium text-eden-navy">First name</span>
				<input
					type="text"
					name="firstName"
					autocomplete="given-name"
					class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-eden-green focus:outline-none focus:ring-1 focus:ring-eden-green"
				/>
			</label>
			<label class="block">
				<span class="text-sm font-medium text-eden-navy">Last name</span>
				<input
					type="text"
					name="lastName"
					autocomplete="family-name"
					class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-eden-green focus:outline-none focus:ring-1 focus:ring-eden-green"
				/>
			</label>
		</div>

		<label class="block">
			<span class="text-sm font-medium text-eden-navy">
				Phone <span class="text-eden-green">*</span>
			</span>
			<input
				type="tel"
				name="phone"
				required
				autocomplete="tel"
				inputmode="tel"
				class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-eden-green focus:outline-none focus:ring-1 focus:ring-eden-green"
			/>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-eden-navy">
				Email <span class="text-eden-green">*</span>
			</span>
			<input
				type="email"
				name="email"
				required
				autocomplete="email"
				class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-eden-green focus:outline-none focus:ring-1 focus:ring-eden-green"
			/>
		</label>

		<label class="flex items-start gap-3">
			<input
				type="checkbox"
				name="smsOptIn"
				class="mt-1 h-4 w-4 rounded border-slate-300 text-eden-green focus:ring-eden-green"
			/>
			<span class="text-sm text-slate-700">
				I agree to receive SMS messages from Eden Health Club. Reply STOP at any time to opt out. Message &amp; data rates may apply.
			</span>
		</label>

		<label class="block">
			<span class="text-sm font-medium text-eden-navy">Anything you'd like us to know</span>
			<textarea
				name="message"
				rows="3"
				class="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-eden-green focus:outline-none focus:ring-1 focus:ring-eden-green"
			></textarea>
		</label>

		<!-- Honeypot — hidden from real users, attractive to bots -->
		<div class="hidden" aria-hidden="true">
			<label>
				Website
				<input type="text" name="website" tabindex="-1" autocomplete="off" />
			</label>
		</div>

		<button
			type="submit"
			class="w-full rounded-md bg-eden-green px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-eden-green/90 focus:outline-none focus:ring-2 focus:ring-eden-green focus:ring-offset-2"
		>
			Request a consult
		</button>

		<div
			data-lead-form-success
			hidden
			class="rounded-md border border-eden-green bg-eden-green/5 p-4 text-sm text-eden-navy"
		>
			Thanks. We received your information and will reach out within one business day.
		</div>

		<div
			data-lead-form-error
			hidden
			class="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-900"
		>
			Something went wrong. Please try again, or call us at <a href="tel:+17206057678" class="underline">720-605-7678</a>.
		</div>
	</form>
</section>

<script>
	// Progressive enhancement: form works without JS (browser submits and gets a 405 — that's fine for v1).
	// With JS, we capture UTM/gclid/referrer, POST as JSON, fire dataLayer events, show in-place success.

	import { trackLeadSubmit, trackLeadSubmitAttempt, trackLeadSubmitError } from "../../lib/tracking";

	function getUrlParam(name: string): string | null {
		const params = new URLSearchParams(window.location.search);
		return params.get(name);
	}

	function initLeadForm(form: HTMLFormElement) {
		const serviceSlug = form.dataset.serviceSlug || "";
		const suburbSlug = form.dataset.suburbSlug || null;
		const successEl = form.querySelector<HTMLElement>("[data-lead-form-success]");
		const errorEl = form.querySelector<HTMLElement>("[data-lead-form-error]");
		const submitBtn = form.querySelector<HTMLButtonElement>('button[type="submit"]');

		form.addEventListener("submit", async (e) => {
			e.preventDefault();
			if (successEl) successEl.hidden = true;
			if (errorEl) errorEl.hidden = true;
			if (submitBtn) submitBtn.disabled = true;

			trackLeadSubmitAttempt(serviceSlug, suburbSlug);

			const fd = new FormData(form);
			const payload = {
				firstName: (fd.get("firstName") as string) || null,
				lastName: (fd.get("lastName") as string) || null,
				phone: (fd.get("phone") as string) || "",
				email: (fd.get("email") as string) || "",
				smsOptIn: fd.get("smsOptIn") === "on",
				message: (fd.get("message") as string) || null,
				service: serviceSlug,
				suburb: suburbSlug,
				sourcePage: window.location.pathname,
				utmSource: getUrlParam("utm_source"),
				utmMedium: getUrlParam("utm_medium"),
				utmCampaign: getUrlParam("utm_campaign"),
				utmTerm: getUrlParam("utm_term"),
				utmContent: getUrlParam("utm_content"),
				gclid: getUrlParam("gclid"),
				referrer: document.referrer || null,
				submittedAt: new Date().toISOString(),
				website: (fd.get("website") as string) || "",
			};

			try {
				const res = await fetch("/api/lead", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(payload),
				});
				const data = await res.json();
				if (res.ok && data.success) {
					trackLeadSubmit(serviceSlug, suburbSlug, payload.smsOptIn);
					if (successEl) successEl.hidden = false;
					form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input, textarea").forEach((el) => {
						if (el.type !== "hidden") el.value = "";
						if (el.type === "checkbox") (el as HTMLInputElement).checked = false;
					});
				} else {
					trackLeadSubmitError(serviceSlug, suburbSlug, data.error || "unknown");
					if (errorEl) errorEl.hidden = false;
				}
			} catch {
				trackLeadSubmitError(serviceSlug, suburbSlug, "network");
				if (errorEl) errorEl.hidden = false;
			} finally {
				if (submitBtn) submitBtn.disabled = false;
			}
		});
	}

	document.querySelectorAll<HTMLFormElement>("[data-lead-form]").forEach(initLeadForm);
</script>
```

## 11. Component implementation contracts (Stage B reference)

For Stage B, build full implementations of these components. Use the LeadForm above as the depth + voice reference. All components are Astro server-rendered, Tailwind-styled, no client JS unless explicitly noted.

### Hero.astro

Props:

```
interface Props {
	variant: "service-hub" | "suburb-hub" | "combo";
	service?: Service;
	suburb?: Suburb;
}
```

Variant copy logic (defined inside the component, not duplicated in pages):

- service-hub: H1 = ${service.name} in Greenwood Village. Sub = service.longDescription.
- suburb-hub: H1 = Eden Health Club in ${suburb.name}. Sub = suburb.neighborhoodBlurb.
- combo: H1 = ${service.name} in ${suburb.name}. Sub = templated sentence weaving service.shortDescription with suburb.demographicHook.

Layout: centered, full-bleed background (white for v1; Phase 6 adds hero imagery), 4rem vertical padding, max-w-3xl content width.

### BenefitsList.astro

Props:

```
interface Props {
	benefits: string[]; // from service.benefits
	heading?: string;
}
```

Render as a <ul> of styled bullets. Each bullet: small green check icon (inline SVG, Tailwind sized) + benefit text in text-base text-slate-700. Heading default: "What this delivers".

### HowItWorks.astro

Props:

```
interface Props {
	steps: string[]; // from service.howItWorks
	heading?: string;
}
```

Render as a numbered ordered list with large step numbers in eden-green and step text in eden-navy. Heading default: "How it works".

### PricingCard.astro

Props:

```
interface Props {
	pricing: Service["pricing"];
	consultRequired: boolean;
	ctaText: string;
}
```

Renders the price (or "Consult required" if pricing.model === "consult-required"), the pricing.note, and a button. Button label = ctaText. Button does NOT navigate — it smooth-scrolls to the LeadForm anchor (#lead-form).

### FAQAccordion.astro

CSS-only via <details> + <summary> elements — no JS. Each FAQ item is a <details> with <summary> showing the question and a chevron, and the answer revealed when open. Styling: navy text, light slate borders.

Props:

```
interface Props {
	faqs: { question: string; answer: string }[];
	heading?: string;
}
```

Props: none — content is brand-constant.

Renders a horizontal bar of 3–4 trust signals lifted from Eden's existing positioning. Suggested content:

- "Licensed Experts. Advanced Credentials." (lift from brand)
- "Greenwood Village's wellness home"
- "5.0 stars on Google" (only include if you confirm rating; otherwise omit)
- "Memberships available"

Each item: small icon + text in eden-navy on white. Horizontally stacked on desktop, vertically stacked on mobile.

### LocalProximity.astro (combo + suburb-hub only)

Props:

```
interface Props {
	suburb: Suburb;
}
```

Renders a small geo-context block: ${suburb.driveTimeMinutes} minutes from our Greenwood Village clinic (or "Our home base" if drive time is 0), followed by Serving: ${suburb.zipsServed.join(", ")}, and a list of suburb.nearbyLandmarks as small chips.

### RelatedServices.astro

Props:

```
interface Props {
	services: Service[]; // resolved from current service's relatedServices slugs
}
```

Renders a horizontal scroll of 3–4 related service cards. Each card: service name, short description, link to that service's hub or combo page (preserving suburb context when on a combo page).

### CTAStrip.astro

A wrapper that arranges LeadForm + secondary phone link. Used twice per page (once after Hero, once at the bottom of the page).

Props:

```
interface Props {
	serviceSlug: string;
	suburbSlug: string | null;
	variant?: "primary" | "secondary";
}
```

variant="primary" (above the fold or near top): full LeadForm visible. variant="secondary" (bottom of page): smaller heading, same form. Both anchor at #lead-form so PricingCard's CTA scrolls here.

### Header.astro

Top navigation. Eden logotype on left (text mark for now — Phase 6 adds image). Phone number on right (tel: link, fires phone_click tracking event on click). On mobile, hamburger menu reveals (via <details> — no JS):

- Services (links to /service-hub pages)
- Locations (links to /locations/)
- Phone
- "Book a consult" button (smooth-scrolls to #lead-form)

### Footer.astro

Includes:

- Eden address: 5990 S University Blvd Greenwood Village, CO 80121
- Phone (tel: link)
- Service category links
- Suburb hub links (Greenwood Village + a few neighbors)
- "Privacy Policy" / "Terms" — link to placeholder routes for now (Phase 7 will provide real content or link out to main site)
- Copyright line: © 2026 Eden Wellness, LLC. All Rights Reserved.
- Required compliance disclaimer (small text, gray): "Eden Health Club services are provided through licensed healthcare providers. Treatment plans are individualized based on medical evaluation. Eden Wellness, LLC offers general health and wellness information but is not a substitute for professional medical advice."

### Breadcrumbs.astro

Props:

```
interface Props {
	items: { label: string; href: string | null }[]; // last item href = null (current page)
}
```

Renders as a small inline list near the top of every page below Header. Phase 4 will add BreadcrumbList JSON-LD using the same items array.

### Button.astro

Generic button + anchor styled component. Variants: primary (eden-green bg, white text), secondary (white bg, eden-navy border + text), ghost (transparent bg, eden-navy text). Sizes: sm, md (default), lg.

### FormField.astro

Wraps a labeled input with consistent Tailwind styling. Used by LeadForm internally. Props: label, name, type, required, autocomplete.

## 12. Page templates — composition rules

### src/pages/index.astro (homepage)

Replaces the coming-soon placeholder. Renders:

- Header
- Hero (variant: custom homepage — H1 "Your Sanctuary of Wellness," sub = the four-pillar paragraph, primary CTA button)
- Trust Bar
- A "Services" grid (4 cards — one per Eden pillar from edenhealthclubs.com: Functional Medicine, Beauty + Aesthetics, Wellness + Recovery, Fitness + Performance)
- CTA Strip (LeadForm with serviceSlug="general" — note: this is a sentinel value; /api/lead accepts any string for service)
- Footer

### src/pages/[service]/index.astro (service hub)

```
export async function getStaticPaths() {
  return services.map((service) => ({
    params: { service: service.slug },
    props: { service },
  }));
}
```

Renders:

- Header + Breadcrumbs (Home > Services > {service.name})
- Hero (variant: service-hub)
- CTAStrip (variant: primary, with LeadForm)
- BenefitsList
- HowItWorks
- PricingCard
- FAQAccordion
- RelatedServices
- CTAStrip (variant: secondary)
- Footer

### src/pages/locations/[suburb].astro (suburb hub)

```
export async function getStaticPaths() {
  return suburbs.map((suburb) => ({
    params: { suburb: suburb.slug },
    props: { suburb },
  }));
}
```

Renders:

- Header + Breadcrumbs (Home > Locations > {suburb.name})
- Hero (variant: suburb-hub)
- LocalProximity
- CTAStrip (variant: primary)
- A "Services we offer in {suburb.name}" grid using suburb.highlightedServices (resolved to full Service objects)
- FAQ block — can use suburb-generic FAQs (heard from real questions: "Do you serve my area?", "Where exactly is your clinic?", "Is parking easy?")
- CTAStrip (variant: secondary)
- Footer

### src/pages/[service]/[suburb].astro (combo)

```
export async function getStaticPaths() {
  return services.flatMap((service) =>
    suburbs.map((suburb) => ({
      params: { service: service.slug, suburb: suburb.slug },
      props: { service, suburb },
    }))
  );
}
```

Renders:

- Header + Breadcrumbs (Home > Services > {service.name} > {suburb.name})
- Hero (variant: combo)
- LocalProximity
- CTAStrip (variant: primary)
- BenefitsList
- HowItWorks
- PricingCard
- FAQAccordion
- RelatedServices
- CTAStrip (variant: secondary)
- Footer

## 13. Quality gates

A phase 3 commit is acceptable when:

- npm run build produces 182 pages (1 home + 13 service hubs + 12 suburb hubs + 156 combos) with zero warnings.
- Manual visual check of 5 sampled combo pages at 375px + 768px + 1280px viewports: layout intact, no console errors, no Tailwind class typos.
- Lead form end-to-end test: submit a test lead from a local npm run dev session with valid email/phone. Confirm GHL receives the payload with all hidden context fields (service_slug, suburb_slug, source_page, etc.) populated correctly.
- /api/lead honeypot test: submit a payload with website field populated. Confirm response is 200 success but GHL receives nothing.
- /api/lead validation tests: confirm 400s for missing email, missing phone, invalid email, invalid phone.
- Lighthouse mobile on sample combo page ≥85 across all four categories (Performance, SEO, Accessibility, Best Practices). Phase 7 tightens to ≥90/95/95/95.
- axe automated check on sample combo page: zero "critical" or "serious" violations.

## 14. Staged execution plan

### Stage A — scaffolding (Claude does itself in Claude Code)

Paste prompt:

```
Read ARCHITECTURE.md and PHASE_3_SPEC.md. Do not deviate from any ADR.

Execute Stage A of Phase 3 — scaffolding only. Do NOT build the combo page sample yet.

1. Install @astrojs/vercel: npm install --save @astrojs/vercel
2. Update astro.config.mjs to use output: 'hybrid' with the Vercel serverless adapter.
3. Create src/lib/urls.ts, src/lib/seo.ts, src/lib/tracking.ts exactly as the spec defines.
4. Create src/pages/api/lead.ts exactly as the spec defines. Confirm GHL_WEBHOOK_URL env var reference is correct.
5. Update src/pages/[service]/index.astro, src/pages/[service]/[suburb].astro, and src/pages/locations/[suburb].astro to populate getStaticPaths from src/data/index.ts. The page bodies can stay as simple placeholders for now ("Coming soon: {service} in {suburb}" etc) — components will be built in Stage B.
6. Run npm run build and confirm it now generates 182 pages instead of 1. Report the page count breakdown.
7. Do NOT touch components, do NOT build the combo sample. Stop here and tell me Stage A is done.
```

Verify Stage A: build report should show 1 + 13 + 12 + 156 = 182 pages generated.

### Stage B — canonical combo page sample (Claude does itself)

Paste prompt:

```
Stage A is approved. Execute Stage B: build the canonical /botox/greenwood-village/ combo page end-to-end. This is the quality-gate sample.

1. Implement ALL components listed in section 11 of PHASE_3_SPEC.md (Hero, BenefitsList, HowItWorks, PricingCard, FAQAccordion, TrustBar, LocalProximity, RelatedServices, LeadForm, CTAStrip, Header, Footer, Breadcrumbs, Button, FormField).

2. Update src/pages/[service]/[suburb].astro to render the full composition listed in section 12 of the spec (Header > Breadcrumbs > Hero > LocalProximity > CTAStrip primary > BenefitsList > HowItWorks > PricingCard > FAQAccordion > RelatedServices > CTAStrip secondary > Footer).

3. Do NOT yet touch the homepage, service-hub pages, or suburb-hub pages — they should still render their getStaticPaths-driven placeholder shells.

4. Run npm run build. Confirm /botox/greenwood-village/ renders the full page.

5. Run npm run dev. Open http://localhost:4321/botox/greenwood-village/ in your browser and visually verify the page composition end-to-end.

6. Report what you built and where things look off. Don't yet extend to other combos.
```

Then human review of /botox/greenwood-village/. Open it in browser, check:

- Hero copy reads naturally with service + suburb interpolation
- LeadForm renders with required-field markers, SMS opt-in checkbox, honeypot hidden
- Submit a test lead with your own email/phone. Confirm GHL receives it with full context.
- Mobile layout (browser dev tools, 375px viewport) is clean
- No console errors

If voice/UX is off, iterate with Claude Code until the sample is good. Don't move to Stage C until the sample feels right.

### Stage C — extend to all 182 pages (Codex)

```
/codex:rescue Stage B is approved. Extend the component implementations to cover all 182 page types.

Specifically:
1. The combo page template at src/pages/[service]/[suburb].astro is already complete from Stage B. Verify it renders cleanly for at least 3 other combos (try /microneedling/lone-tree/, /female-bhrt/centennial/, /iv-therapy/dtc/).
2. Build out src/pages/[service]/index.astro (service hub) per section 12 composition.
3. Build out src/pages/locations/[suburb].astro (suburb hub) per section 12 composition.
4. Rebuild src/pages/index.astro (homepage) per section 12 composition.
5. Confirm npm run build produces 182 pages with no errors.
6. Manually visually check (via npm run dev) at least 1 page of each type: 1 service hub, 1 suburb hub, 1 combo, and the homepage. Report layout issues found.

Match the depth and voice already established in the Stage B sample. Re-use components — do not duplicate logic in pages.
```

```
/codex:adversarial-review Review the full Phase 3 implementation. Look for:

1. Component prop typing — every prop interface should be exported, every page should pass the right typed props.
2. CSS/Tailwind issues — orphan classes, missing responsive prefixes, broken layout at 375px / 768px / 1280px.
3. Accessibility — landmarks (<main>, <nav>, <footer>) present on every page type; h1 exactly once per page; alt text on all images; focus rings visible.
4. Lead form security — honeypot present, validation order correct in /api/lead, GHL_WEBHOOK_URL handled gracefully when missing.
5. Tracking events — pushEvent calls in the right places, no errors when window.dataLayer is undefined.
6. URL canonicalization — every page emits a canonical that matches its actual URL.
7. SEO templating — title and meta description vary across all 182 pages (no two should be identical).

Flag with specific file, line, and proposed fix.
```

Fix anything flagged. Re-run build. Then commit:

```
git add astro.config.mjs package.json package-lock.json src/lib src/components src/pages
git commit -m "feat(phase-3): dynamic routes, component library, and lead form with /api/lead serverless function"
git push
```

Vercel deploys. Open https://landing.edenhealthclubs.com/botox/greenwood-village/ and confirm everything works in production.

## 15. After Phase 3

Reply to chat with "Phase 3 done" and the Phase 4 spec (SEO + structured data + sitemap) will follow.

Total remaining phases until MVP launch: Phase 4 (~2–3 hours of work) + Phase 7 abbreviated (~3–5 hours: 404 page, Lighthouse fixes, axe a11y pass, Search Console submission). Phases 5 (GTM) and 6 (imagery) can ship post-launch.
