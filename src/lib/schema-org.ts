import type { FAQ, Service, Suburb } from "../data/types";
import { combinedFaqs } from "./local-faqs";
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
const BUSINESS_SAME_AS = [
	"https://www.facebook.com/edenhealthclubs",
	"https://www.instagram.com/edenhealthclubs",
	"https://www.tiktok.com/@edenhealthclubs",
];
const BUSINESS_GEO = {
	"@type": "GeoCoordinates",
	latitude: 39.6088,
	longitude: -104.9583,
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
		sameAs: BUSINESS_SAME_AS,
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
		geo: BUSINESS_GEO,
		hasMap: "https://www.google.com/maps/search/?api=1&query=Eden%20Health%20Club%205990%20S%20University%20Blvd%20Greenwood%20Village%20CO%2080121",
		image: `${ORIGIN}/og-default.svg`,
		priceRange: "$$",
		sameAs: BUSINESS_SAME_AS,
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
		geo: BUSINESS_GEO,
		hasMap: "https://www.google.com/maps/search/?api=1&query=Eden%20Health%20Club%205990%20S%20University%20Blvd%20Greenwood%20Village%20CO%2080121",
		priceRange: "$$",
		medicalSpecialty: ["FunctionalMedicine", "Dermatology", "PhysicalTherapy"],
		areaServed: suburb ? cityAreaServed(suburb) : "Greenwood Village, CO",
		sameAs: BUSINESS_SAME_AS,
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
		serviceType: service.name,
		category: service.category,
		provider: {
			"@id": pageId(url, "medical-business"),
			"@type": "MedicalBusiness",
			name: BUSINESS_NAME,
		},
		areaServed: suburb ? cityAreaServed(suburb) : "Greenwood Village, CO",
		offers: {
			"@type": "Offer",
			url,
			availability: "https://schema.org/InStock",
			priceCurrency: "USD",
			price: service.pricing.startingAt ?? undefined,
			description: service.pricing.note ?? service.shortDescription,
		},
	};
}

export function faqPageJsonLd(service: Service, url: string, faqs: FAQ[] = service.faqs): JsonLd {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"@id": pageId(url, "faq"),
		mainEntity: faqs.map((faq) => ({
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
	const faqs = combinedFaqs(service, suburb);
	return [
		medicalBusinessJsonLd(url, suburb),
		serviceJsonLd(service, url, suburb),
		localBusinessJsonLd(suburb, url),
		faqPageJsonLd(service, url, faqs),
		breadcrumbJsonLd(breadcrumbs, url),
	];
}

export const siteOrigin = ORIGIN;
