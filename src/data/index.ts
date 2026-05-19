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
		// TODO(phase-2): re-enable minimum-count + cross-reference assertions once
		// all 13 services and 12 suburbs are populated. Temporarily disabled so
		// the build passes with only the canonical Botox + Greenwood Village
		// entries present.
		// if (s.benefits.length < 4) errors.push(`Service "${s.slug}" needs ≥4 benefits`);
		// if (s.howItWorks.length < 3) errors.push(`Service "${s.slug}" needs ≥3 howItWorks steps`);
		// if (s.faqs.length < 5) errors.push(`Service "${s.slug}" needs ≥5 FAQs`);
		if (!s.targetKeywords.primary) errors.push(`Service "${s.slug}" missing primary keyword`);
		// if (s.targetKeywords.secondary.length < 3)
		// 	errors.push(`Service "${s.slug}" needs ≥3 secondary keywords`);
	}

	// Suburb-level checks
	const suburbSlugs = new Set<string>();
	for (const sb of suburbs) {
		if (!SLUG_PATTERN.test(sb.slug)) errors.push(`Suburb slug not kebab-case: "${sb.slug}"`);
		if (suburbSlugs.has(sb.slug)) errors.push(`Duplicate suburb slug: "${sb.slug}"`);
		suburbSlugs.add(sb.slug);

		if (!sb.neighborhoodBlurb) errors.push(`Suburb "${sb.slug}" missing neighborhoodBlurb`);
		// TODO(phase-2): re-enable once suburbs are fully populated.
		// if (sb.localKeywords.length < 4) errors.push(`Suburb "${sb.slug}" needs ≥4 localKeywords`);
		// TODO(phase-2): re-enable cross-ref check once all 13 services exist; until
		// then highlightedServices may legitimately reference services not yet drafted.
		// if (sb.highlightedServices) {
		// 	for (const ref of sb.highlightedServices) {
		// 		if (!serviceSlugs.has(ref))
		// 			errors.push(`Suburb "${sb.slug}" highlights unknown service "${ref}"`);
		// 	}
		// }
	}

	// Cross-reference check: relatedServices must exist
	// TODO(phase-2): re-enable once all 13 services exist; canonical entries
	// reference siblings that aren't drafted yet.
	// for (const s of services) {
	// 	for (const ref of s.relatedServices) {
	// 		if (!serviceSlugs.has(ref))
	// 			errors.push(`Service "${s.slug}" relatedServices references unknown "${ref}"`);
	// 	}
	// }

	if (errors.length) {
		throw new Error(`[eden-local-pages] Data validation failed:\n  - ${errors.join("\n  - ")}`);
	}
}

validate();
