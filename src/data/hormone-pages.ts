export type HormonePageKind = "paid" | "authority";

export type HormonePage = {
	slug: string;
	kind: HormonePageKind;
	title: string;
	description: string;
	eyebrow: string;
	h1: string;
	subhead: string;
	primaryCta: string;
	secondaryCta: string;
	serviceSlug: string;
	formHeading: string;
	formSubheading: string;
	panelLabel: string;
	panelItems: string[];
	trust: string[];
	takeaways: string[];
	experienceTitle: string;
	experienceIntro: string;
	experiences: string[];
	blueprintIntro: string;
	whyEden: Array<{ title: string; body: string }>;
	authoritySections: Array<{ eyebrow: string; title: string; answer: string; body: string; bullets?: string[] }>;
	faqs: Array<{ question: string; answer: string }>;
	offerLine?: string;
};

const blueprintIntro =
	"The Eden Blueprint is a provider-built loop: test the baseline, build the plan, connect it to training and recovery, track what changes, then optimize with follow-up instead of leaving you to guess.";

const whyEden = [
	{
		title: "Provider-led",
		body: "Your plan starts with a clinician reviewing your goals, history, bloodwork, and fit before recommendations are made.",
	},
	{
		title: "Built on your data",
		body: "The consult is organized around a baseline panel and the real-world changes you want to understand.",
	},
	{
		title: "We close the loop",
		body: "Eden connects medical guidance with training, recovery, body composition, and follow-up under one roof.",
	},
];

export const hormonePages: HormonePage[] = [
	{
		slug: "mens-hormone-optimization",
		kind: "paid",
		title: "Men's Hormone Optimization Denver | Low T Consult | Eden",
		description:
			"Provider-led men's hormone optimization, low T, and TRT consults near Denver and Greenwood Village. Start with labs, goals, and an Eden Blueprint plan.",
		eyebrow: "Men's hormone optimization · Denver / DTC",
		h1: "Men's hormone optimization near Denver and DTC.",
		subhead:
			"Start with a provider-led consult for energy, strength, recovery, focus, body composition, low T questions, and whether a lab-backed plan is the right fit.",
		primaryCta: "Book your consultation",
		secondaryCta: "See how it works",
		serviceSlug: "mens-hormone-optimization",
		formHeading: "Book a men's hormone consult",
		formSubheading: "Share your goals and Eden will follow up about fit, baseline labs, timing, and next steps.",
		panelLabel: "Baseline review",
		panelItems: ["Hormone markers", "Metabolic markers", "Thyroid + vitamins", "Training + recovery goals"],
		trust: ["60 min consult", "Lab-backed", "Provider-led", "Greenwood Village"],
		takeaways: [
			"Eden's men's hormone consult starts with bloodwork and provider review, not a one-size-fits-all product.",
			"The Eden Blueprint connects medical guidance with training, recovery, and follow-up.",
			"Men near Denver, DTC, and Greenwood Village can start with a consult before deciding whether TRT or another plan is appropriate.",
		],
		experienceTitle: "Does this sound familiar?",
		experienceIntro:
			"These are experience patterns men often bring into a consult. Eden keeps the conversation grounded in goals, labs, and provider judgment.",
		experiences: [
			"Afternoon energy drops that make the day feel harder than it should.",
			"Training feels less productive, or recovery takes longer than expected.",
			"Focus, drive, mood, or motivation feels less steady than it used to.",
			"Sleep, body composition, and performance feel harder to manage together.",
		],
		blueprintIntro,
		whyEden,
		authoritySections: [
			{
				eyebrow: "Direct answer",
				title: "What happens at a men's hormone consult?",
				answer:
					"A men's hormone optimization consult at Eden reviews your goals, health history, low T questions, bloodwork needs, training routine, recovery, and follow-up path before any plan is recommended.",
				body:
					"The consult is designed to clarify fit. Your provider can discuss what to test, how results are reviewed, and how Eden connects medical guidance with training and recovery.",
			},
			{
				eyebrow: "Local fit",
				title: "Why Denver men choose Eden for this conversation.",
				answer:
					"Eden is located in Greenwood Village near DTC, giving Denver-area men a local place to discuss hormones, performance, fitness, recovery, and body composition in one setting.",
				body:
					"That matters because the answer is rarely just a lab value. The plan should account for sleep, strength, stress, nutrition, recovery, and what the client can actually sustain.",
			},
		],
		faqs: [
			{
				question: "Do I need labs before the consult?",
				answer:
					"Eden can explain which baseline labs may be appropriate during the consult process. The goal is to review data before building a personalized plan.",
			},
			{
				question: "Is this a low T or TRT clinic near Denver?",
				answer:
					"Eden offers provider-led men's hormone optimization consults near Denver and DTC. The consult can review low T questions, symptoms, labs, safety considerations, and whether TRT discussion is appropriate.",
			},
			{
				question: "How soon will I feel different?",
				answer:
					"Timing varies by person, baseline labs, goals, and the plan recommended by the provider. Eden avoids fixed promises and focuses on follow-up, tracking, and adjustments when appropriate.",
			},
			{
				question: "Is this only about medication?",
				answer:
					"No. Eden's model connects provider guidance with training, recovery, body composition, and lifestyle context so the plan is broader than a single product.",
			},
			{
				question: "Is Eden close to Denver Tech Center?",
				answer:
					"Yes. Eden Health Club is in Greenwood Village on S University Blvd, minutes from DTC and convenient for South Denver, Cherry Hills, Centennial, and Littleton.",
			},
		],
		offerLine: "$47 new-guest consult and baseline review offer. Easy to edit or remove.",
	},
	{
		slug: "menopause-hormone-therapy",
		kind: "paid",
		title: "Menopause Hormone Therapy Denver | Perimenopause Consult | Eden",
		description:
			"Provider-led menopause and perimenopause hormone therapy consults near Denver. Review symptoms, labs, options, safety, and an Eden Blueprint plan.",
		eyebrow: "Menopause hormone therapy · Denver / DTC",
		h1: "Menopause hormone therapy consults near Denver.",
		subhead:
			"Provider-led care through perimenopause, menopause, and beyond, built around your symptoms, story, bloodwork, safety review, and next right step.",
		primaryCta: "Book your consultation",
		secondaryCta: "See the process",
		serviceSlug: "menopause-hormone-therapy",
		formHeading: "Book a menopause consult",
		formSubheading: "Share what has changed and Eden will follow up about fit, labs, and timing.",
		panelLabel: "Consult focus",
		panelItems: ["Sleep + temperature changes", "Mood + focus patterns", "Energy + recovery", "Labs + provider review"],
		trust: ["Provider-led", "Lab-informed", "Not a shrug", "Near DTC"],
		takeaways: [
			"Eden helps women discuss perimenopause and menopause changes with a provider, not a generic intake form.",
			"The consult can include lab planning, health history, options, and follow-up expectations.",
			"Eden's advantage is connecting hormone care with fitness, recovery, body composition, and whole-person support.",
		],
		experienceTitle: "You are not imagining the shift.",
		experienceIntro:
			"Many women arrive after being told everything looks normal while their daily experience clearly feels different.",
		experiences: [
			"Sleep feels lighter, interrupted, or less restorative.",
			"Energy, mood, temperature, and focus feel less predictable.",
			"Body composition and recovery feel harder to manage.",
			"You want a real plan instead of being told to wait it out.",
		],
		blueprintIntro,
		whyEden,
		authoritySections: [
			{
				eyebrow: "Direct answer",
				title: "What does Eden review during a menopause consult?",
				answer:
					"Eden reviews your menopause or perimenopause experience, health history, timing, labs, goals, symptoms, and available options so a provider can personalize next steps instead of relying on a generic plan.",
				body:
					"The consult is meant to slow the process down in the right way. You can discuss what has changed, what you have tried, what needs to be tested, and how follow-up would work.",
			},
			{
				eyebrow: "Validation",
				title: "What if your labs look normal but you do not feel normal?",
				answer:
					"When labs look normal but daily life feels different, Eden uses the consult to connect your story, patterns, health history, and provider review before recommending a path.",
				body:
					"That does not mean every person needs the same intervention. It means your experience deserves a more complete conversation, especially when sleep, energy, temperature, focus, and recovery are changing together.",
			},
		],
		faqs: [
			{
				question: "Is hormone care safe during menopause?",
				answer:
					"Safety depends on your health history, risk factors, labs, and the plan being considered. Eden's provider reviews fit before making individualized recommendations.",
			},
			{
				question: "Is this for perimenopause too?",
				answer:
					"Yes. Eden's menopause hormone therapy consult can also be a starting point for perimenopause questions around sleep, temperature changes, mood, focus, energy, cycle changes, labs, and options.",
			},
			{
				question: "Do you offer bioidentical options?",
				answer:
					"Eden can discuss available options during a provider consult. Recommendations depend on labs, goals, history, and clinical fit.",
			},
			{
				question: "Can I start with just a consult?",
				answer:
					"Yes. The consult is the starting point. It helps clarify what to test, what options may fit, and whether Eden is the right place to continue.",
			},
			{
				question: "Where is Eden located?",
				answer:
					"Eden is located at 5990 S University Blvd in Greenwood Village, serving Denver, DTC, Cherry Hills, Centennial, Littleton, and the south metro.",
			},
		],
		offerLine: "$47 new-guest consult and baseline review offer. Easy to edit or remove.",
	},
	{
		slug: "hormone-therapy-cost",
		kind: "authority",
		title: "Hormone Therapy Cost Denver | Eden Health Club",
		description:
			"Understand hormone therapy cost in Denver: consults, labs, follow-up, memberships, and why the right plan matters.",
		eyebrow: "Performance medicine · Denver",
		h1: "What hormone therapy actually costs in Denver.",
		subhead:
			"An honest, no-games guide to consults, baseline labs, follow-up, and why the real question is the plan behind the price.",
		primaryCta: "Book a consult",
		secondaryCta: "See cost drivers",
		serviceSlug: "hormone-therapy-cost",
		formHeading: "Ask about hormone consult pricing",
		formSubheading: "Share what you are researching and Eden will follow up with the right next step.",
		panelLabel: "Cost drivers",
		panelItems: ["Consult + baseline review", "Lab panel scope", "Provider plan", "Follow-up cadence"],
		trust: ["Transparent start", "Labs matter", "Provider review", "No product-first pitch"],
		takeaways: [
			"Hormone care costs depend on the consult, lab scope, provider plan, follow-up cadence, and whether ongoing support is needed.",
			"Cheap care can become expensive when testing, monitoring, and follow-up are unclear.",
			"Eden starts with a consult and baseline review so clients understand fit before committing to a longer plan.",
		],
		experienceTitle: "The real cost question is not only monthly price.",
		experienceIntro:
			"Price matters. So does what the price includes, who reviews your labs, how often follow-up happens, and whether the plan connects to your life.",
		experiences: [
			"Consult and baseline panel scope.",
			"Follow-up labs and provider review.",
			"Plan adjustments when goals, labs, or tolerance change.",
			"Training, recovery, and body composition support when relevant.",
		],
		blueprintIntro,
		whyEden,
		authoritySections: [
			{
				eyebrow: "Direct answer",
				title: "How much does hormone therapy cost in Denver?",
				answer:
					"Hormone therapy cost in Denver varies by consult, lab testing, follow-up, plan complexity, and ongoing support. Eden starts with a low-friction consult and baseline review before a longer plan is recommended.",
				body:
					"Exact pricing depends on what the provider needs to review and whether ongoing care is appropriate. The more useful comparison is not just the advertised monthly number, but whether labs, follow-up, and plan adjustments are included or clearly explained.",
				bullets: [
					"Consult and baseline review",
					"Lab panel scope and retesting needs",
					"Provider time and plan complexity",
					"Membership or ongoing support model",
				],
			},
			{
				eyebrow: "Buyer guide",
				title: "Why cheap hormone care can cost more.",
				answer:
					"Cheap hormone care can cost more when the plan lacks adequate lab review, provider relationship, follow-up, or whole-person support for training, sleep, recovery, and body composition.",
				body:
					"Eden's model is built to avoid the treat-and-forget pattern. Data is where they stop. It is where Eden starts.",
			},
			{
				eyebrow: "Eden model",
				title: "What is included in the Eden Blueprint?",
				answer:
					"The Eden Blueprint connects testing, provider recommendations, training, tracking, and optimization so hormone care is part of a larger performance medicine plan.",
				body:
					"That is the difference between shopping a product and choosing a care model. The consult helps clarify whether Eden's model is the right fit before you commit to next steps.",
			},
		],
		faqs: [
			{
				question: "Is hormone therapy covered by insurance?",
				answer:
					"Coverage varies by plan, labs, provider requirements, and the structure of care. Eden can explain the consult process and what payment structure applies before you move forward.",
			},
			{
				question: "What is included in the consult?",
				answer:
					"The consult reviews your goals, history, current concerns, baseline testing needs, and whether a provider-led plan may be appropriate.",
			},
			{
				question: "Can I start with just a consult?",
				answer:
					"Yes. The consult is designed as a first step so you can understand fit, labs, and next steps before committing to ongoing care.",
			},
			{
				question: "Why not just choose the cheapest option?",
				answer:
					"With hormone care, price should be compared alongside lab review, provider access, follow-up, safety screening, and plan adjustments. The cheapest option is not always the clearest plan.",
			},
		],
		offerLine: "$47 new-guest consult and baseline review offer. Easy to edit or remove.",
	},
	{
		slug: "hormone-optimization",
		kind: "authority",
		title: "Hormone Optimization Denver | Performance Medicine | Eden",
		description:
			"Learn Eden's hormone optimization model near Denver: provider-led care, baseline labs, training, tracking, follow-up, and performance medicine support.",
		eyebrow: "Hormone optimization · Performance medicine",
		h1: "Hormone optimization near Denver, the Eden way.",
		subhead:
			"Look. Feel. Perform. Eden uses provider-led, lab-informed care as part of a larger system for training, recovery, and long-term follow-up.",
		primaryCta: "Book a consult",
		secondaryCta: "Explore the Blueprint",
		serviceSlug: "hormone-optimization",
		formHeading: "Start with a hormone consult",
		formSubheading: "Share what you want to understand and Eden will help route the right first step.",
		panelLabel: "Eden Blueprint",
		panelItems: ["Test", "Treat", "Train", "Track", "Optimize"],
		trust: ["Performance Medicine", "Lab-informed", "Training connected", "Follow-up built in"],
		takeaways: [
			"Hormone optimization at Eden is a system, not a single-product pitch.",
			"The Eden Blueprint connects labs, provider review, training, tracking, and optimization.",
			"Dedicated paths exist for men's hormone consults and menopause/perimenopause consults.",
		],
		experienceTitle: "A whole-system conversation.",
		experienceIntro:
			"Hormone conversations are stronger when they include sleep, energy, training, recovery, mood, body composition, and what the client can realistically sustain.",
		experiences: [
			"You want provider review before choosing a plan.",
			"You want labs interpreted in the context of daily life.",
			"You want fitness and recovery connected instead of separate.",
			"You want a plan that can be tracked and adjusted.",
		],
		blueprintIntro,
		whyEden,
		authoritySections: [
			{
				eyebrow: "Direct answer",
				title: "What is hormone optimization?",
				answer:
					"Hormone optimization is a provider-led process that uses labs, health history, goals, follow-up, and lifestyle context to decide whether a personalized hormone plan is appropriate.",
				body:
					"At Eden, hormone optimization sits inside Performance Medicine. That means the conversation can include training, recovery, sleep, body composition, and medical wellness rather than focusing only on a single prescription.",
			},
			{
				eyebrow: "How it works",
				title: "Why is training part of Eden's hormone model?",
				answer:
					"Training is part of Eden's model because strength, recovery, body composition, and performance goals influence how clients experience progress and what support they need.",
				body:
					"Many clinics stop at data. Eden starts there, then connects the plan to the body you are trying to build and the life you are trying to live.",
			},
			{
				eyebrow: "Choose your path",
				title: "Should you start with men's or women's hormone care?",
				answer:
					"Men can start with the men's hormone optimization page, while women in perimenopause or menopause can start with the menopause-specific consult page.",
				body:
					"General hormone optimization is the hub. The dedicated pages help route the consult around the most relevant life stage, questions, and provider review.",
				bullets: ["Men's hormone optimization", "Menopause and perimenopause consults", "Women's hormone optimization"],
			},
		],
		faqs: [
			{
				question: "Is hormone optimization a product or a care model?",
				answer:
					"At Eden, it is a care model. The consult starts with goals, history, labs, and provider review before a personalized plan is considered.",
			},
			{
				question: "What makes Eden different from a clinic that only reviews labs?",
				answer:
					"Eden connects lab-informed provider care with training, recovery, body composition, and follow-up inside one Greenwood Village facility.",
			},
			{
				question: "Can I use this page if I am not sure where to start?",
				answer:
					"Yes. If you are unsure whether to start with men's care, menopause care, women's hormone optimization, or general performance medicine, the consult can help route the next step.",
			},
			{
				question: "Does Eden serve Denver?",
				answer:
					"Yes. Eden is located in Greenwood Village near DTC and serves Denver, Cherry Hills, Centennial, Littleton, Lone Tree, and the south metro.",
			},
		],
	},
	{
		slug: "womens-hormone-optimization",
		kind: "paid",
		title: "Women's Hormone Optimization Denver | Lab-Guided Consult | Eden",
		description:
			"Provider-led women's hormone optimization consults near Denver. Discuss energy, sleep, focus, mood, body composition, labs, and an Eden Blueprint plan.",
		eyebrow: "Women's hormone optimization · Denver / DTC",
		h1: "Women's hormone optimization near Denver and DTC.",
		subhead:
			"Start with a provider-led consult that connects your experience, bloodwork, lifestyle, and goals before a personalized path is considered.",
		primaryCta: "Book your consultation",
		secondaryCta: "See how Eden works",
		serviceSlug: "womens-hormone-optimization",
		formHeading: "Book a women's hormone consult",
		formSubheading: "Share what has changed and Eden will follow up about labs, fit, and next steps.",
		panelLabel: "Provider review",
		panelItems: ["Energy + sleep", "Focus + mood", "Cycle/life-stage context", "Labs + goals"],
		trust: ["Provider-led", "Lab-informed", "Whole-person plan", "Greenwood Village"],
		takeaways: [
			"Women's hormone optimization at Eden starts with a consult, history, labs, and provider review.",
			"The page is broader than menopause care and can route women toward the most relevant next step.",
			"Eden connects hormone care with fitness, recovery, body composition, and wellness support.",
		],
		experienceTitle: "When several things change at once.",
		experienceIntro:
			"Women often seek help when sleep, focus, energy, mood, recovery, and body composition start feeling connected.",
		experiences: [
			"Energy and focus feel harder to count on.",
			"Sleep, mood, or temperature patterns are changing.",
			"Training recovery and body composition feel less predictable.",
			"You want a provider-led plan rather than piecing together guesses.",
		],
		blueprintIntro,
		whyEden,
		authoritySections: [
			{
				eyebrow: "Direct answer",
				title: "What is women's hormone optimization at Eden?",
				answer:
					"Women's hormone optimization at Eden is a provider-led consult process that reviews your experience, labs, health history, goals, and life-stage context before recommending next steps.",
				body:
					"Some women need a menopause-specific path. Others need a broader conversation around energy, sleep, focus, recovery, cycle context, body composition, or performance goals.",
			},
			{
				eyebrow: "Route the care",
				title: "When should you choose the menopause page instead?",
				answer:
					"Choose the menopause and perimenopause page if your main questions are tied to that life stage, changing cycles, temperature shifts, sleep disruption, or feeling dismissed during the transition.",
				body:
					"The women's hormone optimization page is broader. The menopause page is more specific and may be the better starting point for women in that transition.",
			},
		],
		faqs: [
			{
				question: "Is this only for menopause?",
				answer:
					"No. This page is broader than menopause. Eden also has a dedicated menopause and perimenopause consult page for women who want that specific path.",
			},
			{
				question: "What does the consult cover?",
				answer:
					"The consult can cover your goals, history, sleep, energy, focus, mood, recovery, labs, and whether an Eden plan is appropriate.",
			},
			{
				question: "Will I need bloodwork?",
				answer:
					"Bloodwork is often part of understanding the baseline. Eden can explain what testing may be appropriate during the consult process.",
			},
			{
				question: "Can Eden connect this with fitness or recovery?",
				answer:
					"Yes. Eden's facility includes fitness, recovery, wellness, and medical services, which allows the plan to connect beyond the consult room when appropriate.",
			},
		],
		offerLine: "$47 new-guest consult and baseline review offer. Easy to edit or remove.",
	},
];

export function getHormonePage(slug: string): HormonePage | undefined {
	return hormonePages.find((page) => page.slug === slug);
}
