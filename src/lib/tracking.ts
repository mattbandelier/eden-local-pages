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

export function trackInstantBookingClick(placement: string): void {
	pushEvent("instant_booking_click", {
		destination: "zenoti",
		placement,
		page_path: typeof window !== "undefined" ? window.location.pathname : null,
	});
}

function leadParams(serviceSlug: string, suburbSlug: string | null): Record<string, unknown> {
	// Keep ad-platform-visible events generic. The lead payload sent to Eden can
	// retain routing context, but GTM/Meta should not receive service interest or
	// location fields that could reveal a visitor's health-related intent.
	void serviceSlug;
	void suburbSlug;
	return {
		page_path: typeof window !== "undefined" ? window.location.pathname : null,
		form_context: "marketing_lead",
	};
}
