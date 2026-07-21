export type OrganicPeptideFaq = {
	question: string;
	answer: string;
};

export type OrganicPeptidePage = {
	slug: string;
	h1: string;
	title: string;
	description: string;
	indexable: boolean;
	heroImage: string;
	heroAlt: string;
	heroKicker: string;
	heroLead: string;
	answerTitle: string;
	answerBody: string;
	considerations: Array<{ title: string; body: string }>;
	regulatoryTitle: string;
	regulatoryBody: string;
	pricing?: {
		start: string;
		includes: string;
		ongoing: string;
		note: string;
	};
	faqs: OrganicPeptideFaq[];
};

export const organicPeptidePages: Record<string, OrganicPeptidePage> = {
	"peptide-injections-cost": {
		slug: "peptide-injections-cost",
		h1: "How Much Does Peptide Therapy Cost?",
		title: "How Much Does Peptide Therapy Cost? | Eden Health Club",
		description: "Peptide therapy at Eden starts at $299, including consultation, lab work, and the first month's vial as prescribed. See honest ongoing price ranges.",
		indexable: true,
		heroImage: "/assets/eden-health-club-office.webp",
		heroAlt: "Eden Health Club consultation room in Greenwood Village",
		heroKicker: "Peptide injections cost in Denver",
		heroLead: "At Eden, $299 to begin includes your consultation, lab work, and first month's vial as prescribed.",
		answerTitle: "What should you expect to pay for peptide therapy?",
		answerBody: "After the $299 start, ongoing pricing generally ranges from $149 to $399 per month with Elevate or $199 to $599 per month at retail. The actual amount depends on what, if anything, a licensed provider prescribes after reviewing your history and labs.",
		considerations: [
			{ title: "Your first visit", body: "The $299 start combines the consultation, lab work, and first month's vial as prescribed into one published starting price." },
			{ title: "Your ongoing range", body: "Ongoing pricing reflects whether you use member or retail pricing and the plan a provider considers appropriate." },
			{ title: "No molecule menu", body: "Eden publishes the range that answers the cost question without turning medical care into a shoppable product list." },
		],
		regulatoryTitle: "Does paying $299 guarantee peptide treatment?",
		regulatoryBody: "No. The starting price does not promise a particular peptide or guarantee that peptide therapy is appropriate. A licensed provider reviews clinical eligibility, and some people may be directed to a different care path.",
		pricing: {
			start: "$299 to begin",
			includes: "Includes consultation, lab work, and the first month's vial as prescribed.",
			ongoing: "$149-$399/month with Elevate or $199-$599/month retail.",
			note: "Ongoing cost depends on the provider-reviewed plan. Pricing is subject to change, and no specific prescription is guaranteed.",
		},
		faqs: [
			{ question: "How much does peptide therapy cost in Denver?", answer: "At Eden, peptide therapy starts at $299. That includes your consultation, lab work, and first month's vial as prescribed. Ongoing pricing generally ranges from $149 to $399 per month with Elevate or $199 to $599 per month at retail." },
			{ question: "Does the $299 really include the vial?", answer: "Yes. The $299 includes the first month's vial as prescribed, along with the consultation and lab work. It does not guarantee a particular peptide or that treatment will be prescribed." },
			{ question: "What affects the ongoing cost?", answer: "Ongoing cost depends on the provider-reviewed plan, member or retail pricing, and whether continued therapy remains appropriate. Eden confirms the price before you continue." },
			{ question: "Do you publish a per-peptide price list?", answer: "No. Eden publishes the honest starting price and ongoing range, but not a shoppable molecule menu. A licensed provider must determine whether any prescription is appropriate." },
			{ question: "Is a membership required?", answer: "No. Retail pricing is available. Elevate offers a lower ongoing range for members, but the right option depends on how you plan to use Eden's services." },
			{ question: "Where is Eden Health Club?", answer: "Eden Health Club is at 5990 S University Blvd in Greenwood Village, near Denver Tech Center and the south Denver metro." },
		],
	},
	"peptides-for-joint-pain": {
		slug: "peptides-for-joint-pain",
		h1: "Peptides for Joint Pain",
		title: "Peptides for Joint Pain | Evidence and Consultation | Eden",
		description: "A conservative guide to peptides for joint pain, investigational status, evidence limits, and provider consultation near Denver.",
		indexable: true,
		heroImage: "/assets/fitness-recovery.webp",
		heroAlt: "Recovery and wellness setting at Eden Health Club",
		heroKicker: "Evidence-first guidance near Denver",
		// {{CLINICAL_REVIEW}} Verify the investigational and FDA-status language before publishing.
		heroLead: "The peptides commonly discussed online for joint pain are investigational, and unapproved peptides should not be presented as proven or FDA-approved treatments.",
		answerTitle: "Do peptides work for joint pain?",
		// {{CLINICAL_REVIEW}} Verify the evidence summary and avoid implying efficacy for any compound.
		answerBody: "Evidence is limited and varies by compound. Online interest is not the same as established clinical benefit, so Eden starts with the cause of the pain, medical history, current treatment, and whether a conventional evaluation or referral is the safer next step.",
		considerations: [
			{ title: "Start with the joint problem", body: "A provider needs to understand location, duration, prior injuries, diagnosis, and current care before discussing any investigational option." },
			{ title: "Separate interest from evidence", body: "Testimonials and online discussion cannot establish safety, effectiveness, or suitability for an individual patient." },
			{ title: "Expect an eligibility decision", body: "A consultation may end with a different recommendation. Booking does not guarantee a prescription or access to a particular compound." },
		],
		regulatoryTitle: "What is the regulatory status of joint-pain peptides?",
		// {{CLINICAL_REVIEW}} FDA PCAC review is scheduled for July 23-24, 2026. Revalidate this copy after the meeting.
		regulatoryBody: "BPC-157, TB-500, and KPV are frequently discussed online in connection with joints and recovery. Eden does not describe them as proven or FDA-approved joint-pain treatments. Their regulatory and evidence status must be reviewed before any patient-specific discussion.",
		faqs: [
			{ question: "Do peptides work for joint pain?", answer: "There is not enough high-quality, compound-specific evidence to promise that an investigational peptide will improve joint pain. Results are not guaranteed, and a clinical evaluation should come first." },
			{ question: "Are these peptides FDA-approved for joint pain?", answer: "No. Eden does not present BPC-157, TB-500, or KPV as FDA-approved treatments for joint pain. Regulatory status and available evidence should be rechecked as federal review develops." },
			{ question: "Will a consultation guarantee a peptide prescription?", answer: "No. A consultation is an evaluation, not a promise of treatment. A provider may recommend standard care, further testing, referral, or another Eden service instead." },
			{ question: "What will the provider review?", answer: "The provider reviews your symptoms, history, current medications, prior evaluation, goals, and available evidence before discussing whether any next step is appropriate." },
			{ question: "Can peptides replace orthopedic or physical therapy care?", answer: "They should not be assumed to replace established evaluation or care. Eden may recommend that you continue with or seek an appropriate medical, orthopedic, or rehabilitation professional." },
			{ question: "Where can I discuss this near Denver?", answer: "Eden Health Club offers in-person consultations at 5990 S University Blvd in Greenwood Village, near DTC and the south Denver metro." },
		],
	},
	"peptide-therapy-denver": {
		slug: "peptide-therapy-denver",
		h1: "Peptide Therapy in Denver",
		title: "Peptide Therapy in Denver | Eden Health Club",
		description: "An in-person peptide therapy consultation in Greenwood Village for Denver-area adults seeking evidence-aware, provider-guided planning.",
		indexable: false,
		heroImage: "/assets/eden-health-club-reception.webp",
		heroAlt: "Eden Health Club reception in Greenwood Village",
		heroKicker: "Provider-guided care in Greenwood Village",
		heroLead: "Eden offers in-person consultations for Denver-area adults exploring peptide therapy, with clinical screening before any recommendation.",
		answerTitle: "What happens at a Denver peptide consultation?",
		answerBody: "A licensed provider reviews your goals, history, medications, relevant labs, and the limits of available evidence. The visit does not guarantee a prescription, a specific peptide, or that peptide therapy is the right path.",
		considerations: [
			{ title: "A local peptide clinic visit", body: "Meet in Greenwood Village rather than shopping from an unmonitored product menu." },
			{ title: "Sermorelin in Denver", body: "A provider can explain why a prescription request requires medical evaluation and why no medication is guaranteed." },
			{ title: "NAD+ therapy in Denver", body: "NAD+ is not a peptide. Eden can discuss NAD+ therapy and peptide therapy as separate services with different considerations." },
		],
		regulatoryTitle: "Are all peptides FDA-approved?",
		// {{CLINICAL_REVIEW}} Revalidate the regulatory explanation and any compound-specific language before indexing.
		regulatoryBody: "No. Approval and evidence are compound- and use-specific, and some substances discussed online are investigational or unapproved. Eden does not advertise an unapproved therapy as proven treatment and does not guarantee access to any compound.",
		faqs: [
			{ question: "Where is Eden's peptide clinic near Denver?", answer: "Eden Health Club is at 5990 S University Blvd in Greenwood Village, near Denver Tech Center and convenient to the south Denver metro." },
			{ question: "What happens before peptide therapy is considered?", answer: "A licensed provider reviews your health history, goals, medications, relevant labs, evidence limits, and clinical eligibility before discussing any recommendation." },
			{ question: "Can I request sermorelin in Denver?", answer: "You can ask about sermorelin during a consultation, but a request does not guarantee a prescription. A provider must determine whether any medication is appropriate." },
			{ question: "Is NAD+ therapy the same as peptide therapy?", answer: "No. NAD+ is a coenzyme, not a peptide. Eden may discuss NAD+ therapy and peptide therapy as separate wellness services with different clinical considerations." },
			{ question: "Does Eden guarantee peptide results?", answer: "No. Individual response varies, evidence differs by compound and use, and no specific outcome or prescription is guaranteed." },
			{ question: "How much does peptide therapy cost?", answer: "Eden publishes its starting price and honest ongoing range on the peptide injections cost page. A provider-reviewed plan determines the actual ongoing cost." },
		],
	},
};

export function getOrganicPeptidePage(slug: string): OrganicPeptidePage {
	const page = organicPeptidePages[slug];
	if (!page) throw new Error(`Unknown organic peptide page: ${slug}`);
	return page;
}
