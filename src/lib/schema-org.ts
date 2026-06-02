import type { Service, Suburb } from "../data/types";
import { comboUrl, homeUrl, ORIGIN, serviceHubUrl, suburbHubUrl } from "./urls";

export type JsonLd = Record<string, unknown>;

export interface BreadcrumbItem {
	label: string;
	href: string | null;
}

const BUSINESS_NAME = "Eden Health Club";
const BUSINESS_PHONE = "+17206057678";
const BUSINESS_ADDRESS = {
	"@type": "PostalAddress",
	streetAddress: "5990 S University Blvd",
	addressLocality: "Greenwood Village",
	addressRegion: "CO",
	postalCode: "80121",
	addressCountry: "US",
};

function pageId(url: string, fragment: string): string {
	return `${url}#${fragment}`;
}

function cityAreaServed(suburb: Suburb): JsonLd {
	return {
		"@type": "City",
		name: suburb.name,
		addressRegion: suburb.state,
		postalCode: suburb.primaryZip,
	};
}

export function organizationJsonLd(): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": pageId(homeUrl(), "organization"),
		name: BUSINESS_NAME,
		url: homeUrl(),
		telephone: BUSINESS_PHONE,
		address: BUSINESS_ADDRESS,
	};
}

export function localBusinessJsonLd(suburb?: Suburb, url = homeUrl()): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"@id": pageId(url, "local-business"),
		name: BUSINESS_NAME,
		url: homeUrl(),
		telephone: BUSINESS_PHONE,
		address: BUSINESS_ADDRESS,
		priceRange: "$$",
		areaServed: suburb ? cityAreaServed(suburb) : "Greenwood Village, CO",
	};
}

export function medicalBusinessJsonLd(url: string, suburb?: Suburb): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "MedicalBusiness",
		"@id": pageId(url, "medical-business"),
		name: BUSINESS_NAME,
		url,
		telephone: BUSINESS_PHONE,
		address: BUSINESS_ADDRESS,
		priceRange: "$$",
		medicalSpecialty: ["FunctionalMedicine", "Dermatology", "PhysicalTherapy"],
		areaServed: suburb ? cityAreaServed(suburb) : "Greenwood Village, CO",
	};
}

export function serviceJsonLd(service: Service, url: string, suburb?: Suburb): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": service.schemaType,
		"@id": pageId(url, "service"),
		name: service.name,
		description: service.shortDescription,
		url,
		provider: {
			"@id": pageId(url, "medical-business"),
			"@type": "MedicalBusiness",
			name: BUSINESS_NAME,
		},
		areaServed: suburb ? cityAreaServed(suburb) : "Greenwood Village, CO",
	};
}

export function faqPageJsonLd(service: Service, url: string): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": pageId(url, "faq"),
		mainEntity: service.faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: faq.answer,
			},
		})),
	};
}

export function breadcrumbJsonLd(items: BreadcrumbItem[], currentUrl: string): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.label,
			item: item.href ?? currentUrl,
		})),
	};
}

export function homepageJsonLd(): JsonLd[] {
	return [organizationJsonLd(), localBusinessJsonLd()];
}

export function serviceHubJsonLd(service: Service, breadcrumbs: BreadcrumbItem[]): JsonLd[] {
	const url = serviceHubUrl(service.slug);
	return [
		medicalBusinessJsonLd(url),
		serviceJsonLd(service, url),
		breadcrumbJsonLd(breadcrumbs, url),
	];
}

export function suburbHubJsonLd(suburb: Suburb, breadcrumbs: BreadcrumbItem[]): JsonLd[] {
	const url = suburbHubUrl(suburb.slug);
	return [localBusinessJsonLd(suburb, url), breadcrumbJsonLd(breadcrumbs, url)];
}

export function comboJsonLd(
	service: Service,
	suburb: Suburb,
	breadcrumbs: BreadcrumbItem[],
): JsonLd[] {
	const url = comboUrl(service.slug, suburb.slug);
	return [
		medicalBusinessJsonLd(url, suburb),
		serviceJsonLd(service, url, suburb),
		localBusinessJsonLd(suburb, url),
		faqPageJsonLd(service, url),
		breadcrumbJsonLd(breadcrumbs, url),
	];
}

export const siteOrigin = ORIGIN;
