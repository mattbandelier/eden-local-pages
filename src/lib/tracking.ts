declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
	}
}

export function pushEvent(event: string, params: Record<string, unknown> = {}): void {
	if (typeof window === "undefined") return;
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({ event, ...params });
}

export function trackLeadSubmitAttempt(serviceSlug: string, suburbSlug: string | null): void {
	pushEvent("lead_submit_attempt", { service_slug: serviceSlug, suburb_slug: suburbSlug });
}

export function trackLeadSubmit(serviceSlug: string, suburbSlug: string | null, smsOptIn: boolean): void {
	pushEvent("lead_submit", {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		sms_opt_in: smsOptIn,
	});
}

export function trackLeadSubmitError(serviceSlug: string, suburbSlug: string | null, errorType: string): void {
	pushEvent("lead_submit_error", {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		error_type: errorType,
	});
}

export function trackPhoneClick(phoneNumber: string): void {
	pushEvent("phone_click", { phone_number: phoneNumber, page_path: window.location.pathname });
}
