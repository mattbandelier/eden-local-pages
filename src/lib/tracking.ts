declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
		gtag?: (...args: unknown[]) => void;
	}
}

const ADS_LEAD_CONVERSION_SEND_TO = "AW-17041568244/GJA8CIb8xLgcEPTjhr4_";

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
	if (typeof window === "undefined") return;
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...params });
}

function pushGoogleEvent(event: string, params: Record<string, unknown> = {}): void {
	if (typeof window === "undefined" || typeof window.gtag !== "function") return;
	window.gtag("event", event, params);
}

export function trackLeadSubmitAttempt(serviceSlug: string, suburbSlug: string | null): void {
	const params = { service_slug: serviceSlug, suburb_slug: suburbSlug };
	pushEvent("lead_submit_attempt", params);
	pushGoogleEvent("lead_submit_attempt", params);
}

export function trackLeadSubmit(serviceSlug: string, suburbSlug: string | null, smsOptIn: boolean): void {
	const params = {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		sms_opt_in: smsOptIn,
	};
	pushEvent("lead_submit", params);
	pushGoogleEvent("lead_submit", params);
	pushGoogleEvent("conversion", { send_to: ADS_LEAD_CONVERSION_SEND_TO });
}

export function trackLeadSubmitError(serviceSlug: string, suburbSlug: string | null, errorType: string): void {
	const params = {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		error_type: errorType,
	};
	pushEvent("lead_submit_error", params);
	pushGoogleEvent("lead_submit_error", params);
}

export function trackPhoneClick(phoneNumber: string): void {
	const params = { phone_number: phoneNumber, page_path: window.location.pathname };
	pushEvent("phone_click", params);
	pushGoogleEvent("phone_click", params);
}
