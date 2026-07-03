import type { Service, Suburb } from "../data/types";

const CLINIC_LOCATION = "Greenwood Village";
const SEO_SERVICE_NAMES: Record<string, string> = {
	"female-bhrt": "Women's Hormones",
	"male-trt": "Men's TRT",
	"bbl-photofacial": "BBL Photofacial",
	"nad-iv-therapy": "NAD IV Therapy",
	"prf-hair-restoration": "PRF Hair Restoration",
};

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
		description: `${suburb.name} clients use Eden Health Club in Greenwood Village for aesthetics, hormones, recovery, functional medicine, and fitness near DTC.`.slice(0, 165),
	};
}

export function comboMeta(service: Service, suburb: Suburb): PageMeta {
	const serviceArea =
		suburb.driveTimeMinutes === 0
			? "Available at our Greenwood Village clinic."
			: `Serving ${suburb.name}, ${suburb.driveTimeMinutes} minutes from our Greenwood Village clinic.`;
	const serviceName = SEO_SERVICE_NAMES[service.slug] ?? service.name;

	return {
		title: `${serviceName} in ${suburb.name}, CO | Eden Health Club`,
		description: `${service.shortDescription} ${serviceArea}`.slice(0, 180),
	};
}

export const homepageSeo = homepageMeta;
export const serviceSeo = serviceHubMeta;
export const suburbSeo = suburbHubMeta;
export const comboSeo = comboMeta;
