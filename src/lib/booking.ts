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

// Category IDs were verified from the live Zenoti webstore category tabs on
// 2026-07-17. serviceId remains as a fallback for routes that need a specific
// consultation rather than a category landing.
export const BOOKING_ROUTES: Record<string, BookingRoute> = {
	botox: {
	serviceSlug: "botox",
	serviceName: "Botox",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"dermal-fillers": {
	serviceSlug: "dermal-fillers",
	serviceName: "Dermal Fillers",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	kybella: {
		serviceSlug: "kybella",
		serviceName: "Kybella",
		category: "Aesthetics",
		categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"chemical-peels": {
		serviceSlug: "chemical-peels",
		serviceName: "Chemical Peels",
		category: "Aesthetics",
		categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"diamondglow-facial": {
	serviceSlug: "diamondglow-facial",
	serviceName: "DiamondGlow Facial",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	note: "DiamondGlow remains internal-only in Zenoti; route visitors to the in-office aesthetic consultation.",
	},
	"lip-filler": {
	serviceSlug: "lip-filler",
	serviceName: "Lip Filler",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	microneedling: {
	serviceSlug: "microneedling",
	serviceName: "Microneedling",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"bbl-photofacial": {
	serviceSlug: "bbl-photofacial",
	serviceName: "BBL HEROic Photofacial",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"prf-hair-restoration": {
	serviceSlug: "prf-hair-restoration",
	serviceName: "PRF Hair Restoration",
	category: "Aesthetics",
	serviceId: "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8",
	categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"hair-restoration": {
		serviceSlug: "hair-restoration",
		serviceName: "Hair Restoration Consultation",
		category: "Aesthetics",
		categoryId: "a9c8d747-23e2-48d0-be6e-cb5035f28119",
	},
	"medical-weight-loss": {
		serviceSlug: "medical-weight-loss",
		serviceName: "Medical Weight Loss",
		category: "Medical Weight Loss",
		serviceId: "0a0e47c6-8a0c-4abe-87eb-d189cfbe7dd5",
	categoryId: "acf1793f-ec03-493a-a64a-47b43c8356a9",
	},
	"female-bhrt": {
		serviceSlug: "female-bhrt",
		serviceName: "Female Hormone Care",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"male-trt": {
		serviceSlug: "male-trt",
		serviceName: "Men's Hormone Care",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"mens-hormone-optimization": {
		serviceSlug: "mens-hormone-optimization",
		serviceName: "Men's Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"menopause-hormone-therapy": {
		serviceSlug: "menopause-hormone-therapy",
		serviceName: "Menopause Hormone Therapy",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"hormone-therapy-cost": {
		serviceSlug: "hormone-therapy-cost",
		serviceName: "Hormone Therapy Consultation",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"hormone-optimization": {
		serviceSlug: "hormone-optimization",
		serviceName: "Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"womens-hormone-optimization": {
		serviceSlug: "womens-hormone-optimization",
		serviceName: "Women's Hormone Optimization",
		category: "Wellness / HRT",
		serviceId: "e6dab53c-810b-454d-9935-d9df45174d44",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	},
	"peptide-therapy": {
		serviceSlug: "peptide-therapy",
		serviceName: "Peptide Therapy",
		category: "Peptide Therapy",
		serviceId: "9b57954f-0ce4-46bc-a175-51fc49cd8762",
	categoryId: "6b5ed79c-9e80-4d55-8754-cc764ff27003",
	},
	"iv-therapy": {
		serviceSlug: "iv-therapy",
		serviceName: "IV Therapy",
		category: "Wellness",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	note: "Routes to the public Wellness category, where visitors can choose the appropriate IV option.",
	},
	"nad-iv-therapy": {
		serviceSlug: "nad-iv-therapy",
		serviceName: "NAD+ Therapy",
		category: "Wellness",
	categoryId: "8e453ae4-b52e-47f8-9847-387cdb875a9e",
	note: "Zenoti renders NAD+ & Niagen as a custom tab without its own CategoryId; route to Wellness and let visitors choose the NAD+ / Niagen tab.",
	},
	fitness: {
		serviceSlug: "fitness",
		serviceName: "Fitness Consultation",
		category: "Fitness",
		serviceId: "09dae419-488d-4f7a-807a-8694f2f439f6",
		categoryId: "443d8251-1411-4b7a-9d2a-6ad642137d91",
	},
	recovery: {
		serviceSlug: "recovery",
		serviceName: "Recovery Services",
		category: "Recovery Services",
		categoryId: "741f5f51-643d-4a38-953b-646ef331efda",
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
