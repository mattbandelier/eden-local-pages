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
