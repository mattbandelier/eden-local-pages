export type PaidAdFaq = {
	question: string;
	answer: string;
};

export type PaidAdPage = {
	slug: string;
	h1: string;
	keyword: string;
	title: string;
	description: string;
	serviceSlug: string;
	serviceName: string;
	serviceCategory: string;
	heroImage: string;
	heroAlt: string;
	subhead: string;
	audienceTitle: string;
	audienceIntro: string;
	audience: Array<{ title: string; body: string }>;
	pricingTitle: string;
	pricingBody: string;
	pricingNote: string;
	faqs: PaidAdFaq[];
};

export const paidAdPages: Record<string, PaidAdPage> = {
	"dermal-fillers-denver": {
		slug: "dermal-fillers-denver",
		h1: "Dermal Fillers in Denver",
		keyword: "dermal fillers denver",
		title: "Dermal Fillers in Denver | Eden Health Club",
		description: "Book a dermal filler consultation near Denver for Juv\u00e9derm, lip volume, and cheek volume with Eden's licensed aesthetic providers.",
		serviceSlug: "dermal-fillers",
		serviceName: "Dermal Fillers",
		serviceCategory: "Aesthetics",
		heroImage: "/assets/eden-health-club-office.webp",
		heroAlt: "Eden Health Club treatment room in Greenwood Village",
		subhead: "A personalized consultation for Juv\u00e9derm, lip volume, and cheek volume in Greenwood Village, serving the Denver metro.",
		audienceTitle: "Is dermal filler right for your goals?",
		// {{CLINICAL_REVIEW}} Confirm conservative description of potential cosmetic uses.
		audienceIntro: "Dermal fillers may be considered for adults looking to address volume, shape, or facial balance without surgery. Your provider will assess anatomy, medical history, and expectations before recommending treatment.",
		audience: [
			{ title: "Lip volume and shape", body: "Discuss subtle definition, proportion, and a result that still looks like you." },
			{ title: "Cheek volume", body: "Review whether cheek support fits your facial structure and aesthetic goals." },
			{ title: "Facial balance", body: "Build a measured plan based on your features rather than a one-size-fits-all package." },
		],
		pricingTitle: "Transparent filler planning",
		pricingBody: "Your consult determines product choice, amount, and a clear treatment quote before anything begins.",
		pricingNote: "Final pricing varies by product and treatment plan. No treatment is required after the consultation.",
		faqs: [
			{ question: "What dermal fillers does Eden offer?", answer: "Eden's aesthetic team consults on Juv\u00e9derm and filler options for areas such as the lips and cheeks. Product and amount depend on your anatomy and goals." },
			{ question: "How much do dermal fillers cost in Denver?", answer: "Cost depends on the product and amount recommended. Eden provides a specific quote during your consultation before treatment." },
			{ question: "How long does a filler appointment take?", answer: "Timing varies by treatment area and plan. Your provider will explain the expected appointment length and aftercare during the consultation." },
			{ question: "Where is Eden located?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, near DTC and convenient to the south Denver metro." },
		],
	},
	"kybella-denver": {
		slug: "kybella-denver",
		h1: "Kybella in Denver",
		keyword: "kybella denver",
		title: "Kybella in Denver | Eden Health Club",
		description: "Book a Kybella consultation near Denver for submental fullness with Eden's licensed aesthetic providers in Greenwood Village.",
		serviceSlug: "kybella",
		serviceName: "Kybella",
		serviceCategory: "Aesthetics",
		heroImage: "/assets/eden-health-club-office.webp",
		heroAlt: "Private aesthetic consultation room at Eden Health Club",
		subhead: "A licensed-provider consultation for non-surgical double-chin treatment in Greenwood Village, serving the Denver metro.",
		audienceTitle: "A focused consult for submental fullness",
		// {{CLINICAL_REVIEW}} Confirm FDA-status wording and suitability language before launch.
		audienceIntro: "Kybella is an FDA-approved injectable for eligible adults with moderate to severe fat below the chin. A consultation is required to review candidacy, alternatives, and the possibility of multiple sessions.",
		audience: [
			{ title: "Under-chin fullness", body: "Discuss whether the area and amount of fullness fit Kybella's indicated use." },
			{ title: "Non-surgical preference", body: "Compare an injectable approach with other options and expected downtime." },
			{ title: "Realistic planning", body: "Review the number of sessions that may be appropriate for your individual plan." },
		],
		pricingTitle: "Know the plan before treatment",
		pricingBody: "Your provider will explain the recommended number of vials and sessions, then provide a clear quote.",
		pricingNote: "Pricing varies by treatment plan. Consultation does not require treatment.",
		faqs: [
			{ question: "What is Kybella used for?", answer: "Kybella is an FDA-approved prescription injectable for eligible adults with moderate to severe submental fat, commonly called fullness under the chin." },
			{ question: "How many Kybella treatments will I need?", answer: "The number of sessions varies. A licensed provider must evaluate the area and explain a personalized schedule before treatment." },
			{ question: "What should I expect after Kybella?", answer: "Swelling and other temporary reactions can occur. Your provider will review common risks, aftercare, and when to contact the clinic." },
			{ question: "Where can I book Kybella near DTC?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, near Denver Tech Center and the south Denver metro." },
		],
	},
	"chemical-peels-denver": {
		slug: "chemical-peels-denver",
		h1: "Chemical Peels in Denver",
		keyword: "chemical peels denver",
		title: "Chemical Peels in Denver | Eden Health Club",
		description: "Book a medical-grade chemical peel consultation for tone and texture concerns at Eden Health Club in Greenwood Village near Denver.",
		serviceSlug: "chemical-peels",
		serviceName: "Chemical Peels",
		serviceCategory: "Aesthetics",
		heroImage: "/assets/eden-health-club-reception.webp",
		heroAlt: "Eden Health Club reception in Greenwood Village",
		subhead: "Medical-grade peel options selected for your skin, schedule, and goals in Greenwood Village near Denver.",
		audienceTitle: "A peel selected for your skin",
		// {{CLINICAL_REVIEW}} Confirm tone and texture benefit language before launch.
		audienceIntro: "Chemical peels may help improve the appearance of uneven tone and texture. A provider first evaluates your skin, current products, sensitivity, and downtime preferences.",
		audience: [
			{ title: "Uneven-looking tone", body: "Discuss visible discoloration and whether a peel is suitable for your skin." },
			{ title: "Texture concerns", body: "Review medical-grade options and realistic expectations for surface texture." },
			{ title: "Planned downtime", body: "Choose an approach that accounts for your skin history and schedule." },
		],
		pricingTitle: "The right peel, clearly priced",
		pricingBody: "Your consultation identifies the appropriate peel and confirms the total price before treatment.",
		pricingNote: "Price and downtime vary by peel. Your provider will review both before you decide.",
		faqs: [
			{ question: "What makes a chemical peel medical-grade?", answer: "Medical-grade peels use professional formulations selected and applied by trained providers. The appropriate option depends on your skin and goals." },
			{ question: "Can a chemical peel help tone and texture?", answer: "Some peels may improve the appearance of uneven tone and texture. Results and suitability vary, so an in-person skin assessment comes first." },
			{ question: "How much downtime should I expect?", answer: "Downtime varies by peel depth and individual response. Your provider will explain likely peeling, aftercare, and sun precautions before treatment." },
			{ question: "Where is Eden's Denver-area med spa?", answer: "Eden is in Greenwood Village at 5990 S University Blvd, close to DTC and the south Denver metro." },
		],
	},
	"bbl-laser-denver": {
		slug: "bbl-laser-denver",
		h1: "BBL & Sciton Laser in Denver",
		keyword: "bbl laser denver",
		title: "BBL & Sciton Laser in Denver | Eden Health Club",
		description: "Book a BBL, MOXI, or Sciton laser consultation for pigment and redness concerns in Greenwood Village near Denver.",
		serviceSlug: "bbl-photofacial",
		serviceName: "BBL & Sciton Laser",
		serviceCategory: "Aesthetics",
		heroImage: "/assets/eden-health-club-office.webp",
		heroAlt: "Eden Health Club medical aesthetics treatment room",
		subhead: "Compare BBL photofacial and MOXI options for pigment, redness, and skin-quality goals near Denver Tech Center.",
		audienceTitle: "Match the technology to the concern",
		// {{CLINICAL_REVIEW}} Confirm photofacial, pigment, redness, and texture benefit language.
		audienceIntro: "BBL and MOXI use different light and laser approaches. A consultation helps determine whether either option is appropriate for visible pigment, redness, or texture concerns.",
		audience: [
			{ title: "Visible pigment", body: "Review the type of discoloration and whether BBL or MOXI may be appropriate." },
			{ title: "Redness concerns", body: "Discuss skin history, triggers, and realistic treatment expectations." },
			{ title: "Texture and maintenance", body: "Build a plan around your goals, downtime tolerance, and skin-care routine." },
		],
		pricingTitle: "Consult first, then price the plan",
		pricingBody: "Area, device, and number of sessions affect pricing. Eden confirms the recommended plan and quote before treatment.",
		pricingNote: "Not every skin type or condition is appropriate for every device. A provider assessment is required.",
		faqs: [
			{ question: "What is the difference between BBL and MOXI?", answer: "BBL uses broad-spectrum light, while MOXI is a fractional laser. Your provider will recommend an option only after assessing your skin and goals." },
			{ question: "Can BBL address pigment and redness?", answer: "BBL may be considered for certain visible pigment and redness concerns. Suitability and response vary by skin and condition." },
			{ question: "How many Sciton treatments will I need?", answer: "Treatment count varies by concern, device, and response. Eden provides a personalized plan after an in-person assessment." },
			{ question: "Where is Eden located?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, near DTC and south Denver." },
		],
	},
	"hair-restoration-denver": {
		slug: "hair-restoration-denver",
		h1: "Hair Loss Treatment in Denver",
		keyword: "hair loss treatment denver",
		title: "Hair Loss Treatment in Denver | Eden Health Club",
		description: "Book a private hair loss consultation in Greenwood Village to discuss provider-guided regenerative options and candidacy.",
		serviceSlug: "hair-restoration",
		serviceName: "Hair Loss Treatment",
		serviceCategory: "Aesthetics",
		heroImage: "/assets/hair-consult-clinic-hero.jpg",
		heroAlt: "Hair restoration consultation at Eden Health Club",
		subhead: "A private, provider-guided consultation to discuss hair changes, candidacy, and regenerative options near Denver.",
		audienceTitle: "Start with the cause, not a package",
		// {{CLINICAL_REVIEW}} Regenerative treatment language requires clinical and Google Ads policy approval before launch.
		audienceIntro: "Hair changes can have different causes. Eden begins with an assessment and discusses available options only when clinically appropriate and consistent with current advertising policy.",
		audience: [
			{ title: "Early thinning", body: "Discuss the pattern, timeline, and whether further medical evaluation is appropriate." },
			{ title: "Treatment options", body: "Review candidacy, evidence, limitations, and alternatives before choosing a service." },
			{ title: "A documented plan", body: "Set realistic expectations and a follow-up schedule based on the provider assessment." },
		],
		pricingTitle: "Assessment before treatment pricing",
		pricingBody: "Your provider reviews candidacy and explains the recommended service, session plan, and complete quote.",
		pricingNote: "No outcome is guaranteed. Some causes of hair loss may require referral or a different care path.",
		faqs: [
			{ question: "What happens at a hair loss consultation?", answer: "A provider reviews your history, pattern of hair change, goals, and whether additional evaluation is needed before discussing options." },
			{ question: "What hair treatment options does Eden offer?", answer: "Available options depend on the provider assessment, candidacy, evidence, and current clinical and advertising requirements. The consultation identifies the appropriate next step." },
			{ question: "Are hair restoration results guaranteed?", answer: "No. Response varies, and the appropriate approach depends on the cause and individual factors. Your provider will discuss realistic expectations." },
			{ question: "Where is the clinic?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, convenient to DTC and the south Denver metro." },
		],
	},
	"trt-denver": {
		slug: "trt-denver",
		h1: "TRT in Denver",
		keyword: "trt denver",
		title: "TRT in Denver | Draft | Eden Health Club",
		description: "Draft, disabled page for a physician-led testosterone therapy consultation in Greenwood Village near Denver.",
		serviceSlug: "male-trt",
		serviceName: "TRT",
		serviceCategory: "Wellness / HRT",
		heroImage: "/assets/mens-hormone-optimization.webp",
		heroAlt: "Men's health consultation at Eden Health Club",
		subhead: "A physician-led consultation for men to review symptoms, health history, labs, and whether testosterone therapy is appropriate.",
		audienceTitle: "Evaluation comes before treatment",
		// {{CLINICAL_REVIEW}} DRAFT/DISABLED: verify all symptom, lab, diagnosis, and treatment language before policy review.
		audienceIntro: "Testosterone therapy is not appropriate for everyone. Eden starts with medical history, symptoms, examination as indicated, and laboratory testing before any treatment decision.",
		audience: [
			{ title: "Symptom review", body: "Discuss concerns with a clinician without assuming testosterone is the cause." },
			{ title: "Appropriate lab work", body: "Review relevant testing and the need to confirm findings before considering therapy." },
			{ title: "Ongoing monitoring", body: "Understand follow-up, risks, alternatives, and the monitoring required for an individual plan." },
		],
		pricingTitle: "Consult and labs before a treatment quote",
		pricingBody: "Eden will explain evaluation costs, required testing, and any proposed plan before treatment begins.",
		pricingNote: "Prescription treatment requires a clinician's evaluation and is never guaranteed after consultation.",
		faqs: [
			{ question: "What is required before TRT?", answer: "A qualified clinician must review symptoms, medical history, relevant examination findings, and appropriate laboratory testing before deciding whether TRT is indicated." },
			{ question: "Does a consultation guarantee a prescription?", answer: "No. A prescription is offered only when a clinician determines it is medically appropriate after evaluation." },
			{ question: "Does TRT require follow-up?", answer: "Yes. When prescribed, testosterone therapy requires ongoing clinical monitoring. The schedule depends on the individual plan." },
			{ question: "Where is Eden located?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, near Denver Tech Center." },
		],
	},
	"bhrt-denver": {
		slug: "bhrt-denver",
		h1: "BHRT in Denver",
		keyword: "bhrt denver",
		title: "BHRT in Denver | Draft | Eden Health Club",
		description: "Draft, disabled page for a physician-led bioidentical hormone therapy consultation for women near Denver.",
		serviceSlug: "female-bhrt",
		serviceName: "BHRT",
		serviceCategory: "Wellness / HRT",
		heroImage: "/assets/fitness-recovery.webp",
		heroAlt: "Women's wellness consultation setting at Eden Health Club",
		subhead: "A physician-led consultation for women to review symptoms, history, labs, and whether bioidentical hormone therapy is appropriate.",
		audienceTitle: "A medical evaluation, not a preset protocol",
		// {{CLINICAL_REVIEW}} DRAFT/DISABLED: verify all symptom, menopause, efficacy, and safety language before policy review.
		audienceIntro: "Bioidentical hormone therapy is not appropriate for everyone. Eden begins with a clinical evaluation and shared decision-making before recommending any prescription treatment.",
		audience: [
			{ title: "Individual symptom review", body: "Discuss timing, severity, health history, and other possible contributors with a clinician." },
			{ title: "Testing when indicated", body: "Review which labs or other evaluations are clinically relevant to the decision." },
			{ title: "Risks and monitoring", body: "Understand alternatives, potential risks, follow-up, and the limits of treatment." },
		],
		pricingTitle: "Build the plan after evaluation",
		pricingBody: "Evaluation, testing, medication, and follow-up needs vary. Eden provides a clear quote for the proposed plan.",
		pricingNote: "A consultation does not guarantee a prescription. Treatment decisions are individualized.",
		faqs: [
			{ question: "What does BHRT mean?", answer: "BHRT commonly refers to bioidentical hormone replacement therapy. A clinician must determine whether any hormone treatment is appropriate for an individual patient." },
			{ question: "What happens before BHRT is prescribed?", answer: "A clinician reviews symptoms, medical and family history, risks, current medications, and testing when indicated before discussing treatment." },
			{ question: "Is BHRT right for every woman?", answer: "No. Benefits, risks, alternatives, and contraindications differ by person. A medical consultation is required." },
			{ question: "Where is Eden located?", answer: "Eden is at 5990 S University Blvd in Greenwood Village, near DTC and the south Denver metro." },
		],
	},
};

export function getPaidAdPage(slug: string): PaidAdPage {
	const page = paidAdPages[slug];
	if (!page) throw new Error(`Unknown paid ad page: ${slug}`);
	return page;
}
