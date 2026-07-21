declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
		edenAnalyticsBlocked?: boolean;
		fbq?: (...args: unknown[]) => void;
		gtag?: (...args: unknown[]) => void;
	}
}

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
	if (typeof window === "undefined") return;
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...params });
}

export function trackLeadSubmitAttempt(serviceSlug: string, suburbSlug: string | null): void {
	pushEvent("lead_submit_attempt", leadParams(serviceSlug, suburbSlug));
}

export function trackLeadSubmit(serviceSlug: string, suburbSlug: string | null, smsOptIn: boolean): void {
	const params = {
		...leadParams(serviceSlug, suburbSlug),
		sms_opt_in: smsOptIn,
	};

	// GTM's published conversion trigger listens for the legacy lead_submit event.
	pushEvent("lead_submit", params);
	pushEvent("consult_request", params);
	pushEvent("lead_form_success", params);
	if (!window.edenAnalyticsBlocked && typeof window.fbq === "function") {
		window.fbq("track", "Lead");
	}
}

export function trackLeadSubmitError(serviceSlug: string, suburbSlug: string | null, errorType: string): void {
	pushEvent("lead_submit_error", {
		...leadParams(serviceSlug, suburbSlug),
		error_type: errorType,
	});
}

export function trackPhoneClick(phoneNumber: string): void {
	pushEvent("phone_click", { phone_number: phoneNumber, page_path: window.location.pathname });
}

type BookingClick = {
	serviceSlug: string;
	serviceName: string;
	category: string;
	destination: string;
};

export function trackBookingClick(booking: BookingClick): void {
	if (typeof window === "undefined") return;

	const eventId = typeof crypto?.randomUUID === "function"
		? crypto.randomUUID()
		: `booking-${Date.now()}-${Math.random().toString(36).slice(2)}`;
	const params = {
		service_slug: booking.serviceSlug,
		service_name: booking.serviceName,
		service_category: booking.category,
		page_path: window.location.pathname,
		destination: booking.destination,
		event_id: eventId,
	};

	pushEvent("booking_click", params);
	pushEvent("google_ads_booking_conversion", params);

	const googleAdsSendTo = import.meta.env.PUBLIC_GOOGLE_ADS_BOOKING_SEND_TO;
	if (googleAdsSendTo && typeof window.gtag === "function") {
		window.gtag("event", "conversion", {
			send_to: googleAdsSendTo,
			transaction_id: eventId,
			event_callback: () => undefined,
		});
	}

	if (!window.edenAnalyticsBlocked && typeof window.fbq === "function") {
		window.fbq("trackCustom", "BookingClick", {
			service_slug: booking.serviceSlug,
			service_name: booking.serviceName,
			service_category: booking.category,
			page_path: window.location.pathname,
		}, { eventID: eventId });
	}

	void fetch("/api/booking-event/", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			eventId,
			serviceSlug: booking.serviceSlug,
			serviceName: booking.serviceName,
			category: booking.category,
			sourceUrl: `${window.location.origin}${window.location.pathname}`,
			fbp: readCookie("_fbp"),
			fbc: readCookie("_fbc"),
		}),
		keepalive: true,
	}).catch(() => undefined);
}

function readCookie(name: string): string | null {
	const prefix = `${name}=`;
	const value = document.cookie.split(";").map((item) => item.trim()).find((item) => item.startsWith(prefix));
	return value ? decodeURIComponent(value.slice(prefix.length)) : null;
}

function leadParams(serviceSlug: string, suburbSlug: string | null): Record<string, unknown> {
	return {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		page_path: typeof window !== "undefined" ? window.location.pathname : null,
		lead_category: leadCategory(serviceSlug),
	};
}

function leadCategory(serviceSlug: string): string {
	if (serviceSlug.includes("membership")) return "membership";
	if (serviceSlug.includes("hormone") || serviceSlug.includes("bhrt") || serviceSlug.includes("trt")) return "hormones";
	if (serviceSlug.includes("fitness") || serviceSlug.includes("training") || serviceSlug.includes("performance")) return "fitness";
	if (serviceSlug.includes("botox") || serviceSlug.includes("filler") || serviceSlug.includes("facial") || serviceSlug.includes("microneedling") || serviceSlug.includes("bbl")) return "aesthetics";
	return "wellness";
}
