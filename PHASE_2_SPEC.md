# Phase 2 Spec — Eden Health Club Local Pages Data Layer

**Repo:** `eden-local-pages` (Astro 5.18.1 \+ Tailwind 4.1.18, already scaffolded) **Deploy target:** `landing.edenhealthclubs.com` **Goal:** Build the data layer (`src/data/`) that Phase 3 will read to generate 181 pSEO pages.

---

## How to use this spec

Open a Claude Code session in your `eden-local-pages` repo and feed this whole file in as context. Then either:

- Let Claude execute it directly, or  
- Delegate the mechanical drafting (the 11 remaining service entries \+ 11 remaining suburb entries) to Codex via `/codex:rescue`. The canonical examples I've fully drafted here (Botox \+ Greenwood Village) are the style reference Codex should match exactly — same field order, same depth of copy, same voice.

Once both JSON files exist and the validator passes, Phase 2 is done.

---

## Brand voice rules (NON-NEGOTIABLE — read first)

Eden Health Club is **not a medspa** — it's a four-pillar wellness brand: **Functional Medicine, Beauty \+ Aesthetics, Wellness \+ Recovery, Fitness \+ Performance**. The home tagline is "Your Sanctuary of Wellness. Licensed Experts. Advanced Credentials. Unmatched Care." The outcome promise is "Look better, feel better, perform better."

**Do say:**

- "Eden Health Club" (singular, the brand)  
- "Members" or "clients" in commercial copy; "patients" only for medical procedure context  
- "Licensed experts," "advanced credentials," "trained injectors," "clinical team," "expert providers"  
- "Greenwood Village," "south Denver," "the Tech Center"  
- Outcome-led verbs: "smooth," "restore," "optimize," "balance," "renew"  
- The canonical brand authority phrasing, lifted verbatim from edenhealthclubs.com: "Your Sanctuary of Wellness." and "Licensed Experts. Advanced Credentials. Unmatched Care." These are safe to use anywhere clinical-authority copy is needed (hero, trust bar, suburb hooks, FAQs, etc.) and do not depend on any specific physician name.

**Don't say:**

- "NP-led medspa" — the user has explicitly rejected this framing  
- Any specific physician name in commercial copy (no "Dr. [Name]" references); avoid framing that implies control by a named physician — use "provider-led," "in-person," or "clinical team" instead
- **Prescription drug names of any kind** in landing copy until LegitScript certification is obtained. Specifically: semaglutide, tirzepatide, Sermorelin, TB-500, BPC-157; GLP-1 brand names Ozempic / Wegovy / Mounjaro / Zepbound; specific compounded product names like Bi-Est, Testosterone Cypionate, Hair Force One; and any specific compounded medication product or pharmacy product name. Use category and treatment-class language only ("GLP-1 therapy," "compounded peptide therapy," "compounded bioidentical hormones," "FDA-approved injectable testosterone preparations")  
- **"FDA-approved" claims** applied to any compounded medication (compounded bioidentical hormones, compounded GLP-1, compounded peptides) — frame as "compounded ... prescribed by licensed providers" instead  
- **Specific weight-loss outcome promises** ("lose X pounds in Y weeks") — use non-specific outcome language only  
- Generic medspa filler: "pampering," "indulgent," "lavish," "treat yourself"  
- "Med spa" or "medi-spa" as the primary noun for Eden  
- "Anti-aging" as a category claim (use specific outcomes instead)  
- Anything that reads like every other medspa SEO page on the internet

**Regulatory context (binding):** Eden is not currently LegitScript certified. Any prescription medication mention on a landing page that runs as a Google Ads destination will trigger automatic disapproval. Use category and treatment-class language only. Re-evaluate this rule when LegitScript certification is obtained.

**Tone:** Confident, clinical-credible, warm but not gushy. Adult. Performance-oriented. No emojis, no exclamation points except in CTA microcopy when warranted.

**Copy length targets per service:**

- `shortDescription`: 1–2 sentences, ≤180 chars (used as meta description)  
- `longDescription`: 1 paragraph, 50–80 words (hero body copy)  
- `benefits`: 4–5 bullets, each 8–14 words, outcome-led  
- `whoItsFor`: 1–2 sentences, names the actual candidate  
- `howItWorks`: 3–5 bullets, each one process step  
- `faqs`: 5–6 items, real questions people ask their injector, not boilerplate

---

## Files to create

```
src/
├── data/
│   ├── types.ts          ← TypeScript interfaces
│   ├── services.json     ← 13 service entries
│   ├── suburbs.json      ← 12 suburb entries
│   └── index.ts          ← Loader + build-time validator
└── pages/
    └── index.astro       ← Update homepage line (see section at end)
```

---

## `src/data/types.ts` — write exactly this

```ts
// src/data/types.ts
// Type definitions for the Eden Health Club local pages data layer.
// Imported by src/data/index.ts and any component that consumes the data.

export type ServiceCategory =
	| "injectables"
	| "skin"
	| "hair"
	| "hrt"
	| "functional-medicine"
	| "recovery"
	| "fitness";

export type PricingModel =
	| "per-unit"
	| "per-syringe"
	| "per-treatment"
	| "package"
	| "subscription"
	| "consult-required";

export type SchemaServiceType =
	| "MedicalProcedure"
	| "MedicalTherapy"
	| "Service";

export interface TreatmentDetails {
	duration: string; // e.g. "10–15 minutes"
	downtime: string; // e.g. "None" or "1–2 days"
	painLevel: string; // e.g. "Minimal" / "Moderate"
	resultsTiming: string; // e.g. "Visible in 3–5 days, full at 14 days"
	sessionsRecommended: string; // e.g. "Every 3–4 months"
}

export interface Pricing {
	startingAt?: number; // USD
	model: PricingModel;
	note?: string;
}

export interface FAQ {
	question: string;
	answer: string;
}

export interface TargetKeywords {
	primary: string;
	secondary: string[]; // 3–5 items
}

export interface Service {
	// Identity
	slug: string; // kebab-case URL segment
	name: string; // display name in body copy
	nameVariants: string[]; // other ways people refer to it
	category: ServiceCategory;

	// Hero
	shortDescription: string; // ≤180 chars, used as meta description
	longDescription: string; // 50–80 words, hero paragraph

	// Body
	benefits: string[]; // 4–5 outcome bullets
	whoItsFor: string; // 1–2 sentences
	howItWorks: string[]; // 3–5 process steps

	// Treatment specifics
	treatmentDetails: TreatmentDetails;

	// Commercial
	pricing: Pricing;
	ctaText: string;
	consultRequired: boolean;

	// EAT / SEO
	contraindications: string[];
	faqs: FAQ[]; // ≥5 items
	schemaType: SchemaServiceType;
	targetKeywords: TargetKeywords;

	// Cross-linking
	relatedServices: string[]; // service slugs
	internalPageUrl: string; // canonical on edenhealthclubs.com
}

export interface Suburb {
	// Identity
	slug: string;
	name: string;
	nameVariants: string[]; // e.g. ["DTC"] for "Denver Tech Center"

	// Geography
	county: string;
	state: "CO";
	primaryZip: string;
	zipsServed: string[];
	driveTimeMinutes: number; // from 5990 S University Blvd, Greenwood Village
	nearbyLandmarks: string[];

	// Copy
	neighborhoodBlurb: string; // 1–2 sentences unique to this suburb
	demographicHook: string; // 1 sentence, subtle positioning

	// SEO
	localKeywords: string[]; // 4–6 phrases like "cherry hills medspa"

	// Optional service spotlight on this suburb's hub page
	highlightedServices?: string[]; // service slugs
}
```

---

## `src/data/services.json` — canonical example to match exactly

This is the **complete Botox entry**. Match this depth, voice, and structure for the other 12 services. Do not abbreviate.

```json
[
  {
    "slug": "botox",
    "name": "Botox",
    "nameVariants": ["Botox", "Botox Cosmetic", "wrinkle relaxer", "neuromodulator", "tox", "neurotoxin"],
    "category": "injectables",
    "shortDescription": "FDA-approved wrinkle relaxer that smooths fine lines and prevents new ones. Results in 7–14 days, no downtime.",
    "longDescription": "Botox is the most-studied neuromodulator on the market. At Eden Health Club, our licensed injectors use it to soften expression lines on the forehead, between the brows, and around the eyes — keeping your face mobile and natural while smoothing the lines that age you. We treat the muscle, not the symptom, so you walk out looking refreshed, not frozen.",
    "benefits": [
      "Smooths forehead lines, frown lines, and crow's feet",
      "Prevents new lines from forming over time",
      "Results in 7–14 days, lasts 3–4 months",
      "No downtime — same-day return to work or workout",
      "Also treats hyperhidrosis and TMJ-related jaw tension"
    ],
    "whoItsFor": "Anyone bothered by expression lines that linger when their face is at rest. Excellent first injectable for clients in their late 20s through 50s who want a natural, refreshed result.",
    "howItWorks": [
      "Quick in-office consult with one of our injectors — usually paired with treatment.",
      "We map the muscle groups creating your lines.",
      "Treatment takes 10–15 minutes with insulin-sized needles. Minimal discomfort.",
      "Results begin in 3–5 days, peak at 14 days, and last 3–4 months."
    ],
    "treatmentDetails": {
      "duration": "10–15 minutes",
      "downtime": "None",
      "painLevel": "Minimal",
      "resultsTiming": "Visible in 3–5 days, full result at 14 days",
      "sessionsRecommended": "Every 3–4 months"
    },
    "pricing": {
      "startingAt": 14,
      "model": "per-unit",
      "note": "Pricing per unit. Most upper-face treatments use 20–50 units. Daxxify and Dysport also available."
    },
    "ctaText": "Book a Botox Consult",
    "consultRequired": false,
    "contraindications": [
      "Pregnancy or breastfeeding",
      "Active skin infection in the treatment area",
      "Known allergy to botulinum toxin or its components",
      "Certain neuromuscular disorders (consult your provider)"
    ],
    "faqs": [
      {
        "question": "How much Botox will I need?",
        "answer": "Most first-time treatments use 20–40 units across the upper face. Your injector will recommend a specific dose during your visit based on your muscle activity and goals."
      },
      {
        "question": "How long does Botox last?",
        "answer": "Typically 3–4 months. With consistent treatment, many clients find their muscles become less reactive over time and treatments last longer."
      },
      {
        "question": "Will Botox make me look frozen?",
        "answer": "Not when it's dosed correctly. Eden injectors aim for a natural, refreshed result where your face still moves and expresses normally — just without deep lines at rest."
      },
      {
        "question": "What's the difference between Botox, Dysport, and Daxxify?",
        "answer": "All three are FDA-approved neuromodulators. Botox is the most established. Dysport often shows results 1–2 days sooner. Daxxify can last up to 6 months for some clients. Your injector will recommend the right product for your goals."
      },
      {
        "question": "Is there any downtime?",
        "answer": "None. You can return to work, workouts, and social plans the same day. We do recommend avoiding lying flat or vigorous exercise for 4 hours post-treatment."
      },
      {
        "question": "How much does Botox cost at Eden Health Club?",
        "answer": "Pricing starts at $14 per unit. Most upper-face treatments range from $280–$700 depending on units used. We're transparent on pricing before any treatment."
      }
    ],
    "schemaType": "MedicalProcedure",
    "targetKeywords": {
      "primary": "botox greenwood village",
      "secondary": ["botox near me", "best botox denver", "wrinkle relaxer greenwood village", "botox cost", "botox injector dtc"]
    },
    "relatedServices": ["dermal-fillers", "lip-filler", "microneedling", "diamondglow-facial"],
    "internalPageUrl": "https://edenhealthclubs.com/injectables/botox-wrinkle-relaxers/"
  }
]
```

### Remaining 12 services Codex must draft using the Botox entry as template

For each, the slug \+ `internalPageUrl` are fixed below. Codex drafts everything else following the Botox depth, voice rules above, and the spreadsheet data (uploaded in the conversation as `Service_Centers_Cleaned_for_GHL_2.xlsx`).

| slug | name | category | internalPageUrl |
| :---- | :---- | :---- | :---- |
| `dermal-fillers` | Dermal Fillers | injectables | [https://edenhealthclubs.com/injectables/dermal-fillers/](https://edenhealthclubs.com/injectables/dermal-fillers/) |
| `lip-filler` | Lip Filler | injectables | [https://edenhealthclubs.com/injectables/dermal-fillers/](https://edenhealthclubs.com/injectables/dermal-fillers/) |
| `microneedling` | Microneedling | skin | [https://edenhealthclubs.com/skin-rejuvenation/microneedling/](https://edenhealthclubs.com/skin-rejuvenation/microneedling/) |
| `bbl-photofacial` | BBL HEROic Photofacial | skin | [https://edenhealthclubs.com/skin-rejuvenation/bbl-heroic-photofacial/](https://edenhealthclubs.com/skin-rejuvenation/bbl-heroic-photofacial/) |
| `diamondglow-facial` | DiamondGlow Facial | skin | [https://edenhealthclubs.com/skin-rejuvenation/diamond-glow-facials/](https://edenhealthclubs.com/skin-rejuvenation/diamond-glow-facials/) |
| `female-bhrt` | Female Bioidentical Hormone Replacement Therapy | hrt | [https://edenhealthclubs.com/hormone-replacement-therapy/female-bhrt-wellness/](https://edenhealthclubs.com/hormone-replacement-therapy/female-bhrt-wellness/) |
| `male-trt` | Male Testosterone Replacement Therapy | hrt | [https://edenhealthclubs.com/hormone-replacement-therapy/male-trt-wellness/](https://edenhealthclubs.com/hormone-replacement-therapy/male-trt-wellness/) |
| `medical-weight-loss` | Medical Weight Loss | functional-medicine | [https://edenhealthclubs.com/functional-medicine/medical-weight-loss/](https://edenhealthclubs.com/functional-medicine/medical-weight-loss/) |
| `peptide-therapy` | Peptide Therapy | functional-medicine | [https://edenhealthclubs.com/functional-medicine/peptide-injections/](https://edenhealthclubs.com/functional-medicine/peptide-injections/) |
| `prf-hair-restoration` | PRF Hair Restoration | hair | [https://edenhealthclubs.com/hair-restoration/hair-restoration-with-prf/](https://edenhealthclubs.com/hair-restoration/hair-restoration-with-prf/) |
| `iv-therapy` | IV Therapy | recovery | [https://edenhealthclubs.com/wellness-recovery/iv-therapy/](https://edenhealthclubs.com/wellness-recovery/iv-therapy/) |
| `nad-iv-therapy` | NAD+ IV Therapy | recovery | [https://edenhealthclubs.com/wellness-recovery/iv-therapy/](https://edenhealthclubs.com/wellness-recovery/iv-therapy/) |

**Drafting notes per service (use these as reality anchors):**

- **dermal-fillers** — umbrella for Juvederm (Ultra/Volbella/Vollure/Voluma/Volux), Restylane (Contour/Defyne/Kysse/Lyft/Refyne), RHA (2/3/4/Redensity). Pricing: $650–$850 per syringe. `schemaType: MedicalProcedure`. Pricing model `per-syringe`.  
- **lip-filler** — call out Juvederm Volbella, Kysse, Skinvive as specific products. Pricing $650/syringe. Emphasize natural-looking, hydration, and the difference between lip "filler" and lip "enhancement."  
- **microneedling** — Eden offers Microneedling Full Face \+ Neck, with chest/hand add-ons. Position alongside PRP Elevation (PRP-enhanced microneedling) as an upgrade. `schemaType: MedicalProcedure`. Pricing model `per-treatment`.  
- **bbl-photofacial** — Sciton BBL HEROic specifically. Treats pigmentation, redness, sun damage, and acne (BBL Forever Clear). Pricing range $400–$1,100 depending on area. Mention that BBL+Moxi combo is available as an upgrade. `schemaType: MedicalProcedure`.  
- **diamondglow-facial** — SkinMedica DiamondGlow with five Pro-Infusion serum options (Anti-Aging/TNS, Antioxidant/Vitamin C, Brightening/Even & Correct, Clarifying/Pore Purifying, Hydrating/HA5). 60-minute treatment, $225. NOT Hydrafacial — important distinction. `schemaType: MedicalProcedure`.  
- **female-bhrt** — Bioidentical hormone replacement using subcutaneous pellets (testosterone, estrogen) or compounded creams/troches/tablets. Initial pellet placement $375, lasts 3–4 months. Bloodwork required first. Mention BHRT consultation ($100). `schemaType: MedicalTherapy`. Pricing model `package`.  
- **male-trt** — Testosterone replacement therapy using subcutaneous pellets (modified dosing $500 / 3–4 months, full dosing $700 / 5–6 months), FDA-approved injectable testosterone preparations, or compounded preparations. Bloodwork required. Mention BHRT consultation ($100). `schemaType: MedicalTherapy`. Pricing model `package`. *Specific compounded product names removed per LegitScript compliance — see Don't say list.*  
- **medical-weight-loss** — Medically supervised weight loss program offering GLP-1 therapy and other provider-prescribed weight loss medications through licensed compounding pharmacies when clinically indicated. Telehealth and in-office both supported. Bloodwork required. Adjunct medications may apply. `schemaType: MedicalTherapy`. Pricing model `consult-required`. Consult required. *Specific drug names and per-medication pricing removed per LegitScript compliance — see Don't say list.*  
- **peptide-therapy** — Compounded peptide therapy, growth hormone secretagogue therapy, topical GHK-Cu (Eden Tighten cream line), plus NAD+ at-home injection training. Baseline Peptide Panel (CBC, CMP, IGF-1) required ($75) and repeated every 6 months. $100 consult required. `schemaType: MedicalTherapy`. Pricing model `consult-required`. *Specific peptide product names removed per LegitScript compliance — see Don't say list.*  
- **prf-hair-restoration** — Platelet-Rich Fibrin scalp injections drawn from your own blood. $900/session, recommended series of 3\. Mention Exosomes Hair Restoration as upgrade ($1,200/session). Prescription adjuncts available — specific product names removed per LegitScript compliance (see Don't say list). `schemaType: MedicalProcedure`. Pricing model `per-treatment`.  
- **iv-therapy** — Eden Signature, Energize, Glow, Immunity, Recovery, Relief, Restore IV mixtures. $195/session for 75-min infusion. Position as recovery \+ performance, not just hangover cure. `schemaType: MedicalTherapy`. Pricing model `per-treatment`.  
- **nad-iv-therapy** — NAD+ IV at 250mg or 500mg, plus IM injections at 50/75/100/125/150mg and at-home injection training. Position around longevity, cognition, and cellular energy. Mention Niagen as the NR alternative. `schemaType: MedicalTherapy`. Pricing model `per-treatment`.

---

## `src/data/suburbs.json` — canonical example to match exactly

Complete Greenwood Village entry:

```json
[
  {
    "slug": "greenwood-village",
    "name": "Greenwood Village",
    "nameVariants": ["Greenwood Village", "GV"],
    "county": "Arapahoe County",
    "state": "CO",
    "primaryZip": "80121",
    "zipsServed": ["80111", "80121"],
    "driveTimeMinutes": 0,
    "nearbyLandmarks": ["Fiddler's Green Amphitheatre", "Denver Tech Center", "Cherry Creek State Park", "Park Meadows Mall"],
    "neighborhoodBlurb": "Greenwood Village is Eden's home. Our flagship clinic sits on S University Blvd, minutes from Fiddler's Green, the Tech Center, and Cherry Creek State Park. Most of our members live or work within a 10-minute drive.",
    "demographicHook": "Greenwood Village's go-to home for aesthetics, hormone optimization, and recovery.",
    "localKeywords": [
      "greenwood village medspa",
      "greenwood village botox",
      "medical spa greenwood village",
      "wellness center greenwood village",
      "aesthetics greenwood village 80121"
    ],
    "highlightedServices": ["botox", "female-bhrt", "diamondglow-facial", "iv-therapy"]
  }
]
```

### Remaining 11 suburbs Codex must draft

For each, slug \+ name \+ county are fixed; Codex fills in the rest using local knowledge. Drive times below are approximate from 5990 S University Blvd, Greenwood Village, CO 80121\.

| slug | name | county | primaryZip | driveTimeMinutes |
| :---- | :---- | :---- | :---- | :---- |
| `cherry-hills-village` | Cherry Hills Village | Arapahoe | 80113 | 5 |
| `englewood` | Englewood | Arapahoe | 80113 | 10 |
| `centennial` | Centennial | Arapahoe | 80112 | 10 |
| `lone-tree` | Lone Tree | Douglas | 80124 | 12 |
| `highlands-ranch` | Highlands Ranch | Douglas | 80129 | 15 |
| `littleton` | Littleton | Arapahoe / Jefferson | 80120 | 15 |
| `dtc` | Denver Tech Center | Denver / Arapahoe | 80237 | 5 |
| `parker` | Parker | Douglas | 80134 | 20 |
| `denver` | Denver | Denver | 80202 | 20 |
| `castle-rock` | Castle Rock | Douglas | 80108 | 25 |
| `south-aurora` | South Aurora | Arapahoe | 80016 | 18 |

**Drafting notes per suburb (use these as reality anchors):**

- **cherry-hills-village** — Affluent, low-density, mature professionals. Cherry Hills Country Club nearby. Use `nameVariants: ["Cherry Hills", "CHV"]`.  
- **englewood** — Mix of older neighborhoods and young families; Swedish Hospital and Craig Hospital are landmarks; busy commercial along S Broadway.  
- **centennial** — Family-heavy suburb, lots of dual-income households; Streets at SouthGlenn is the lifestyle hub; close to South Suburban Park.  
- **lone-tree** — Park Meadows Mall, Lone Tree Arts Center, RidgeGate community. Younger professional crowd. Strong household income.  
- **highlands-ranch** — Master-planned, large families; Shea Stadium / Highlands Ranch Town Center area; long-time Eden referral base.  
- **littleton** — Mix of historic downtown Littleton (Main Street vibe) and newer subdivisions; Aspen Grove shopping; Hudson Gardens.  
- **dtc** — Office park density (Charles Schwab, Comcast HQ area); use `nameVariants: ["DTC", "Denver Tech Center", "Tech Center"]`. Lunch-hour appointments are popular.  
- **parker** — Growing exurb, Mainstreet entertainment district, family-oriented, slightly longer drive offset by no traffic on E-470.  
- **denver** — Broad — focus on south Denver neighborhoods that orbit our location: Wash Park, Cherry Creek, University. Mention proximity but don't try to compete for Denver-wide search; we target the south side.  
- **castle-rock** — Outlets at Castle Rock, Philip S. Miller Park, fast-growing Douglas County corridor; further drive but high household income justifies inclusion.  
- **south-aurora** — 80016 / Southlands corridor; mention proximity to Buckley AFB and the Southlands shopping district.

---

## `src/data/index.ts` — loader \+ build-time validator

```ts
// src/data/index.ts
// Loads services + suburbs JSON, validates structure at import time so the
// Astro build fails loudly when data is missing or inconsistent.

import servicesData from "./services.json";
import suburbsData from "./suburbs.json";
import type { Service, Suburb } from "./types";

export const services: readonly Service[] = servicesData as Service[];
export const suburbs: readonly Suburb[] = suburbsData as Suburb[];

export function getService(slug: string): Service | undefined {
	return services.find((s) => s.slug === slug);
}

export function getSuburb(slug: string): Suburb | undefined {
	return suburbs.find((s) => s.slug === slug);
}

export function allServiceSlugs(): string[] {
	return services.map((s) => s.slug);
}

export function allSuburbSlugs(): string[] {
	return suburbs.map((s) => s.slug);
}

// --- Validation ---
// Runs at module load time. Throws if data is misconfigured so the build fails.

const SLUG_PATTERN = /^[a-z][a-z0-9-]*[a-z0-9]$/;

function validate(): void {
	const errors: string[] = [];

	// Service-level checks
	const serviceSlugs = new Set<string>();
	for (const s of services) {
		if (!SLUG_PATTERN.test(s.slug)) errors.push(`Service slug not kebab-case: "${s.slug}"`);
		if (serviceSlugs.has(s.slug)) errors.push(`Duplicate service slug: "${s.slug}"`);
		serviceSlugs.add(s.slug);

		if (!s.name) errors.push(`Service "${s.slug}" missing name`);
		if (!s.shortDescription || s.shortDescription.length > 180)
			errors.push(`Service "${s.slug}" shortDescription must be 1–180 chars`);
		if (!s.longDescription) errors.push(`Service "${s.slug}" missing longDescription`);
		if (s.benefits.length < 4) errors.push(`Service "${s.slug}" needs ≥4 benefits`);
		if (s.howItWorks.length < 3) errors.push(`Service "${s.slug}" needs ≥3 howItWorks steps`);
		if (s.faqs.length < 5) errors.push(`Service "${s.slug}" needs ≥5 FAQs`);
		if (!s.targetKeywords.primary) errors.push(`Service "${s.slug}" missing primary keyword`);
		if (s.targetKeywords.secondary.length < 3)
			errors.push(`Service "${s.slug}" needs ≥3 secondary keywords`);
	}

	// Suburb-level checks
	const suburbSlugs = new Set<string>();
	for (const sb of suburbs) {
		if (!SLUG_PATTERN.test(sb.slug)) errors.push(`Suburb slug not kebab-case: "${sb.slug}"`);
		if (suburbSlugs.has(sb.slug)) errors.push(`Duplicate suburb slug: "${sb.slug}"`);
		suburbSlugs.add(sb.slug);

		if (!sb.neighborhoodBlurb) errors.push(`Suburb "${sb.slug}" missing neighborhoodBlurb`);
		if (sb.localKeywords.length < 4) errors.push(`Suburb "${sb.slug}" needs ≥4 localKeywords`);
		if (sb.highlightedServices) {
			for (const ref of sb.highlightedServices) {
				if (!serviceSlugs.has(ref))
					errors.push(`Suburb "${sb.slug}" highlights unknown service "${ref}"`);
			}
		}
	}

	// Cross-reference check: relatedServices must exist
	for (const s of services) {
		for (const ref of s.relatedServices) {
			if (!serviceSlugs.has(ref))
				errors.push(`Service "${s.slug}" relatedServices references unknown "${ref}"`);
		}
	}

	if (errors.length) {
		throw new Error(`[eden-local-pages] Data validation failed:\n  - ${errors.join("\n  - ")}`);
	}
}

validate();
```

---

## Homepage update — apply this small change too

Update `src/pages/index.astro` so the placeholder line matches the brand voice. Replace the current `<BaseLayout>` block's `description` prop and the `<p>` inside the main with this exact copy:

- **title:** `Eden Health Club — Coming Soon`  
- **description:** `Functional medicine, aesthetics, recovery, and fitness, under one roof in Greenwood Village.`  
- **h1:** `Eden Health Club — coming soon.`  
- **paragraph:** `Functional medicine, aesthetics, recovery, and fitness, under one roof in Greenwood Village.`

Everything else in that file stays the same.

---

## Acceptance criteria — when Phase 2 is done

1. `src/data/types.ts` exists and matches the spec exactly.  
2. `src/data/services.json` contains all 13 entries, each at the same depth as the Botox entry.  
3. `src/data/suburbs.json` contains all 12 entries, each at the same depth as the Greenwood Village entry.  
4. `src/data/index.ts` exists, exports `services`, `suburbs`, `getService`, `getSuburb`, `allServiceSlugs`, `allSuburbSlugs`, and runs the validator at import.  
5. Homepage line is updated per the section above.  
6. `npm run build` succeeds. The validator runs during build (because something will import `index.ts` even though Phase 3 hasn't wired up the dynamic routes yet — easiest way to force this is to add `import "../data";` to the top frontmatter of `src/pages/index.astro` temporarily, then remove it in Phase 3).  
7. Commit message: `feat(data): Phase 2 — services + suburbs data layer with validator`

---

## Suggested workflow

1. Open this repo in Claude Code.  
     
2. Paste this entire spec as your first message.  
     
3. Have Claude write `types.ts`, `index.ts`, the homepage edit, and the Botox \+ Greenwood Village entries itself (the high-judgment work).  
     
4. For the remaining 12 services \+ 11 suburbs, run `/codex:rescue` with this prompt:  
     
   Draft the remaining 12 service entries and 11 suburb entries in `src/data/services.json` and `src/data/suburbs.json`, following exactly the depth, voice, and structure of the Botox and Greenwood Village entries already present. Use the "Drafting notes" tables in `PHASE_2_SPEC.md` as reality anchors. The Eden spreadsheet (services \+ pricing) is in the conversation context. Do not deviate from the voice rules in the spec. Match the JSON key order from the canonical example so diffs stay readable.  
     
5. Once Codex returns, run `/codex:adversarial-review` against the new entries to catch voice violations or boilerplate-y phrasing before commit.  
     
6. `npm run build` to confirm the validator passes.  
     
7. Commit \+ push.

---

## When you're done, come back and we'll do Phase 3

Phase 3 wires `getStaticPaths` to actually generate the 181 pages, builds the component library (Hero, TrustBar, FAQ, CTA, Footer), and adds sitemap \+ robots.txt. Nothing in Phase 3 can be planned without Phase 2 data, so this is the gate.  
