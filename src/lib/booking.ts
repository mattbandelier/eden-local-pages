import { appendAttributionParams } from "./booking-attribution";

export const ZENOTI_CENTER_ID = "a1fda69e-77f9-4077-bb8a-3b06349b6af3";
export const ZENOTI_DEEP_LINK_BASE = `https://edenhealthclubs.zenoti.com/webstoreNew/${ZENOTI_CENTER_ID}`;
export const BOOKING_INTERSTITIAL_PATH = "/book/";

export type BookingRoute = {
	serviceSlug: string;
	serviceName: string;
	category: string;
	categoryId?: string;
	serviceId?: string;
	note?: string;
};

// Category IDs are deliberately kept separate from service IDs. Fill them in
// from Zenoti admin when category-level routing is verified; serviceId is the
// currently verified fallback for the public consultation paths.
export const BOOKING_ROUTES: Record<string, BookingRoute> = {
	botox: {
	serviceSlug: "botox",
	serviceName: "Botox",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	"dermal-fillers": {
	serviceSlug: "dermal-fillers",
	serviceName: "Dermal Fillers",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	"diamondglow-facial": {
	serviceSlug: "diamondglow-facial",
	serviceName: "DiamondGlow Facial",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	note: "DiamondGlow remains internal-only in Zenoti; route visitors to the in-office aesthetic consultation.",
	},
	"lip-filler": {
	serviceSlug: "lip-filler",
	serviceName: "Lip Filler",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	microneedling: {
	serviceSlug: "microneedling",
	serviceName: "Microneedling",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	"bbl-photofacial": {
	serviceSlug: "bbl-photofacial",
	serviceName: "BBL HEROic Photofacial",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	"prf-hair-restoration": {
	serviceSlug: "prf-hair-restoration",
	serviceName: "PRF Hair Restoration",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: undefined, // TODO: add the Zenoti Aesthetics CategoryId.
	},
	"medical-weight-loss": {
		serviceSlug: "medical-weight-loss",
		serviceName: "Medical Weight Loss",
		category: "Medical Weight Loss",
		serviceId: "0a0e47c6-8a0c-4abe-87eb-d189cfbe7dd5",
		categoryId: undefined, // TODO: add the Zenoti Medical Weight Loss CategoryId.
	},
	"female-bhrt": {
		serviceSlug: "female-bhrt",
		serviceName: "Female Hormone Care",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"male-trt": {
		serviceSlug: "male-trt",
		serviceName: "Men's Hormone Care",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"mens-hormone-optimization": {
		serviceSlug: "mens-hormone-optimization",
		serviceName: "Men's Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"menopause-hormone-therapy": {
		serviceSlug: "menopause-hormone-therapy",
		serviceName: "Menopause Hormone Therapy",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"hormone-therapy-cost": {
		serviceSlug: "hormone-therapy-cost",
		serviceName: "Hormone Therapy Consultation",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"hormone-optimization": {
		serviceSlug: "hormone-optimization",
		serviceName: "Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"womens-hormone-optimization": {
		serviceSlug: "womens-hormone-optimization",
		serviceName: "Women's Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
		categoryId: undefined, // TODO: add the Zenoti HRT CategoryId.
	},
	"peptide-therapy": {
		serviceSlug: "peptide-therapy",
		serviceName: "Peptide Therapy",
		category: "Peptide Therapy",
		serviceId: "9b57954f-0ce4-46bc-a175-51fc49cd8762",
		categoryId: undefined, // TODO: add the Zenoti Peptide Therapy CategoryId.
	},
	"iv-therapy": {
		serviceSlug: "iv-therapy",
		serviceName: "IV Therapy",
		category: "Wellness",
		categoryId: undefined, // TODO: add the Zenoti IV Therapy CategoryId.
		note: "No verified public IV consultation service ID is currently in the repo; this routes to the interstitial until confirmed.",
	},
	"nad-iv-therapy": {
		serviceSlug: "nad-iv-therapy",
		serviceName: "NAD+ Therapy",
		category: "Wellness",
		categoryId: undefined, // TODO: add the Zenoti NAD+ / Niagen CategoryId.
		note: "No verified public NAD+ consultation service ID is currently in the repo; this routes to the interstitial until confirmed.",
	},
	fitness: {
		serviceSlug: "fitness",
		serviceName: "Fitness Consultation",
		category: "Fitness",
		serviceId: "09dae419-488d-4f7a-807a-8694f2f439f6",
		categoryId: undefined, // TODO: add the Zenoti Fitness CategoryId.
	},
};

export function getBookingRoute(serviceSlug: string): BookingRoute | undefined {
	return BOOKING_ROUTES[serviceSlug];
}

export function bookingUrlForService(serviceSlug: string): string {
	const route = getBookingRoute(serviceSlug);
	if (!route) return `${BOOKING_INTERSTITIAL_PATH}?service=${encodeURIComponent(serviceSlug)}`;

	if (route.categoryId) {
		return `${ZENOTI_DEEP_LINK_BASE}?CategoryId=${encodeURIComponent(route.categoryId)}`;
	}

	if (route.serviceId) {
		return `${ZENOTI_DEEP_LINK_BASE}?serviceid=${encodeURIComponent(route.serviceId)}`;
	}

	return `${BOOKING_INTERSTITIAL_PATH}?service=${encodeURIComponent(serviceSlug)}`;
}

export function trackedBookingUrl(serviceSlug: string): string {
	const route = getBookingRoute(serviceSlug);
	const href = bookingUrlForService(serviceSlug);
	if (!route) return href;

	const url = new URL(href, "https://landing.edenhealthclubs.com");
	url.searchParams.set("utm_source", "edenhealthclubs.com");
	url.searchParams.set("utm_medium", "referral");
	url.searchParams.set("utm_campaign", "consult_booking");
	url.searchParams.set("utm_content", `${serviceSlug}_service_page`);
	return `${url.pathname}${url.search}`.startsWith("/book/") ? `${url.pathname}${url.search}` : url.toString();
}

export function enrichBookingHref(href: string): string {
	if (typeof window === "undefined") return href;
	return appendAttributionParams(href);
}
