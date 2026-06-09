import type { FAQ, Service, Suburb } from "../data/types";

const CLINIC_ADDRESS = "5990 S University Blvd, Greenwood Village, CO 80121";

export function localizedServiceFaqs(service: Service, suburb: Suburb): FAQ[] {
	const locationPhrase =
		suburb.slug === "greenwood-village"
			? "in Greenwood Village"
			: `near ${suburb.name}`;
	const travelAnswer =
		suburb.driveTimeMinutes === 0
			? `Yes. Eden Health Club is located in Greenwood Village at ${CLINIC_ADDRESS}.`
			: `Yes. Eden Health Club serves ${suburb.name} from its Greenwood Village clinic, about ${suburb.driveTimeMinutes} minutes away.`;

	return [
		{
			question: `Does Eden Health Club offer ${service.name} ${locationPhrase}?`,
			answer: `${travelAnswer} Clients can request ${service.name} through this page or call 720-605-7678.`,
		},
		{
			question: `Can I book a ${service.name} consult from ${suburb.name}?`,
			answer: `Yes. Share your contact details and Eden's team will follow up about fit, timing, and the right next step for ${service.name}.`,
		},
		{
			question: `Is Eden Health Club close to ${suburb.name}?`,
			answer:
				suburb.driveTimeMinutes === 0
					? `Yes. Eden Health Club is in Greenwood Village near DTC, Cherry Hills Village, Centennial, and South Denver.`
					: `Yes. Eden Health Club is a convenient option for ${suburb.name} clients looking for medical spa, wellness, recovery, and performance services in the south Denver area.`,
		},
	];
}

export function combinedFaqs(service: Service, suburb?: Suburb): FAQ[] {
	return suburb ? [...localizedServiceFaqs(service, suburb), ...service.faqs] : service.faqs;
}
