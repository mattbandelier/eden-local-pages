import type { FAQ, Service, Suburb } from "../data/types";

const CLINIC_ADDRESS = "5990 S University Blvd, Greenwood Village, CO 80121";

const serviceIntentFaqs: Record<string, FAQ[]> = {
	botox: [
		{
			question: "How much does Botox cost at Eden Health Club?",
			answer:
				"Botox pricing starts at $14 per unit. Most upper-face treatments use 20-50 units, but your injector will recommend the exact dose before treatment.",
		},
		{
			question: "Do I need a consultation before Botox?",
			answer:
				"Most Botox visits include a focused injector consultation before treatment. Eden's licensed aesthetic team reviews your goals, facial movement, dosing, and fit before moving forward.",
		},
	],
	"dermal-fillers": [
		{
			question: "Does Eden offer dermal fillers in Greenwood Village?",
			answer:
				"Yes. Eden offers dermal filler consultations and treatments for lips, cheeks, chin, jawline, folds, and facial balancing when appropriate. Pricing starts at $650 per syringe.",
		},
		{
			question: "Can Eden help me choose between Botox and filler?",
			answer:
				"Yes. Eden's injectors can help you decide whether wrinkle relaxer, filler, skin treatment, or a staged plan best fits your anatomy, goals, and comfort level.",
		},
	],
	"lip-filler": [
		{
			question: "Can I get natural-looking lip filler at Eden?",
			answer:
				"Yes. Eden offers lip filler focused on shape, hydration, border support, and proportion. The goal is a balanced result that fits your facial features, not an overdone look.",
		},
		{
			question: "How much does lip filler cost at Eden Health Club?",
			answer:
				"Lip filler starts at $650 per syringe. Your injector will recommend the product and amount before treatment so pricing is clear before you decide.",
		},
	],
	"medical-weight-loss": [
		{
			question: "Does Eden offer medical weight loss?",
			answer:
				"Yes. Eden offers provider-guided medical weight loss with health history review, required bloodwork, and individualized treatment options for eligible clients.",
		},
		{
			question: "Is bloodwork required for medical weight loss?",
			answer:
				"Yes. Bloodwork is required so the provider can review metabolic markers, safety considerations, and whether medication support is clinically appropriate.",
		},
	],
	"female-bhrt": [
		{
			question: "Does Eden offer female BHRT?",
			answer:
				"Yes. Eden offers female hormone optimization consultations with lab review and provider-guided treatment planning. BHRT consultation is $100, bloodwork is required, and pellet placement starts at $375 when appropriate.",
		},
		{
			question: "Do I need labs before female hormone therapy?",
			answer:
				"Yes. Bloodwork is required before treatment so your provider can evaluate hormone markers, safety considerations, and whether BHRT is appropriate.",
		},
	],
	"male-trt": [
		{
			question: "Does Eden offer TRT for men?",
			answer:
				"Yes. Eden offers men's testosterone and hormone optimization consultations with required lab review and provider-guided treatment planning. Pellet placement starts at $500 when appropriate.",
		},
		{
			question: "Do I need labs before starting TRT?",
			answer:
				"Yes. Bloodwork is required before TRT so your provider can evaluate testosterone levels, blood counts, prostate markers when appropriate, and overall safety.",
		},
	],
	"peptide-therapy": [
		{
			question: "Does Eden offer peptide therapy?",
			answer:
				"Yes. Eden offers provider-led peptide therapy consultations for eligible wellness, recovery, skin, and performance goals. Baseline labs and medical review are required before a protocol is considered.",
		},
		{
			question: "Who is a good candidate for peptide therapy?",
			answer:
				"A good candidate wants monitored support for recovery, sleep, performance, body composition, or skin quality and is willing to complete medical screening and lab review before starting.",
		},
	],
	"diamondglow-facial": [
		{
			question: "Does Eden offer DiamondGlow facials?",
			answer:
				"Yes. Eden offers SkinMedica DiamondGlow facials that exfoliate, extract, and infuse targeted serums. The 60-minute DiamondGlow facial is $225.",
		},
	],
	microneedling: [
		{
			question: "Does Eden offer microneedling?",
			answer:
				"Yes. Eden offers microneedling for texture, pores, fine lines, dullness, and mild acne-scar concerns. Full-face and neck microneedling starts at $375.",
		},
	],
	"bbl-photofacial": [
		{
			question: "What does BBL HEROic photofacial treat?",
			answer:
				"BBL HEROic may treat visible sun damage, redness, brown spots, uneven tone, and select acne concerns using customizable broadband light. Your provider will confirm whether it fits your skin type and goals.",
		},
	],
	"prf-hair-restoration": [
		{
			question: "Does Eden offer PRF hair restoration?",
			answer:
				"Yes. Eden offers PRF hair restoration consultations and scalp treatments for eligible clients with thinning hair concerns. PRF hair restoration is $900 per session, and a series is commonly recommended.",
		},
	],
	"iv-therapy": [
		{
			question: "Does Eden offer IV therapy?",
			answer:
				"Yes. Eden offers monitored IV therapy for hydration, recovery, energy, immunity, glow, relief, and performance support. Default IV therapy pricing is $195 per session.",
		},
	],
	"nad-iv-therapy": [
		{
			question: "Does Eden offer NAD+ IV therapy?",
			answer:
				"Yes. Eden offers NAD+ IV and injection-based options when appropriate. NAD+ IV pricing starts at $275, with final pricing based on dose, route, and visit length.",
		},
	],
};

export function localizedServiceFaqs(service: Service, suburb: Suburb): FAQ[] {
	const wellnessServiceSlugs = new Set(["medical-weight-loss", "female-bhrt", "male-trt", "peptide-therapy", "iv-therapy", "nad-iv-therapy"]);
	const isWellnessService = wellnessServiceSlugs.has(service.slug);
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
					: isWellnessService
						? `Yes. Eden Health Club is a convenient option for ${suburb.name} clients looking for provider-guided wellness, hormones, peptides, weight-management support, recovery, and performance services in the south Denver area.`
						: `Yes. Eden Health Club is a convenient option for ${suburb.name} clients looking for medical spa, wellness, recovery, and performance services in the south Denver area.`,
		},
	];
}

function dedupeFaqs(faqs: FAQ[]): FAQ[] {
	const seen = new Set<string>();
	return faqs.filter((faq) => {
		const key = faq.question.trim().toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export function combinedFaqs(service: Service, suburb?: Suburb): FAQ[] {
	const intentFaqs = serviceIntentFaqs[service.slug] ?? [];
	return suburb
		? dedupeFaqs([...localizedServiceFaqs(service, suburb), ...intentFaqs, ...service.faqs])
		: dedupeFaqs([...intentFaqs, ...service.faqs]);
}
