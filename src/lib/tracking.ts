declare global {
	interface Window {
		dataLayer?: Array<Record<string, unknown>>;
		edenAnalyticsBlocked?: boolean;
		fbq?: (...args: unknown[]) => void;
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
	const params = {
		service_slug: serviceSlug,
		suburb_slug: suburbSlug,
		sms_opt_in: smsOptIn,
	};

	// GTM's published conversion trigger listens for the legacy lead_submit event.
	pushEvent("lead_submit", params);
	pushEvent("lead_form_success", params);
	if (!window.edenAnalyticsBlocked && typeof window.fbq === "function") {
		window.fbq("track", "Lead");
	}
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
