// These routes are used only by the reviewed website banners. Existing ad routes stay separate.
export const WEBSITE_FOLLOWUP_CONSENT_VERSION = "eden-website-hair-iv-2026-11-10";
export const WEBSITE_FOLLOWUP_CONSENT_TEXT = "I agree to receive follow-up emails, marketing texts and phone calls from Eden Health Club about this inquiry, including through automated technology, at the contact details I provide. Consent is optional and is not a condition of purchase. Message frequency varies; message and data rates may apply. Reply STOP to opt out of texts or HELP for help. Unsubscribe from emails at any time.";

export const WEBSITE_FOLLOWUP_ROUTES = {
	website_hair_consult_v1: { service: "hair-loss-consult", path: "/hair-loss-consult/greenwood-village", label: "Hair Restoration", workflowId: "f23ade4d-6bda-435d-bbeb-acf98bc72f7e" },
	website_iv_visit_v1: { service: "iv-therapy", path: "/lp/iv-therapy-denver", label: "IV Therapy", workflowId: "c33dd82d-4b1a-4909-bf87-27924a179e73" },
} as const;

export function websiteFollowupRoute(payload: { workflowKey?: string | null; service?: string | null; sourcePage?: string | null }) {
	const key = payload.workflowKey || "";
	if (!Object.hasOwn(WEBSITE_FOLLOWUP_ROUTES, key)) return null;
	const route = WEBSITE_FOLLOWUP_ROUTES[key as keyof typeof WEBSITE_FOLLOWUP_ROUTES];
	let path = "";
	try { path = new URL(payload.sourcePage || "", "https://landing.edenhealthclubs.com").pathname.replace(/\/$/, ""); } catch { return null; }
	return payload.service === route.service && path === route.path ? route : null;
}

export function isWebsiteFollowupKey(key?: string | null) {
	return Boolean(key?.startsWith("website_hair_") || key?.startsWith("website_iv_"));
}

export function websiteFollowupDecision(payload: { followupConsent?: boolean; consentVersion?: string | null }, contact: any, enabled: boolean) {
	if (!enabled) return "not_activated";
	if (payload.followupConsent !== true || payload.consentVersion !== WEBSITE_FOLLOWUP_CONSENT_VERSION) return "no_consent";
	if (!contact?.id || typeof contact.dnd !== "boolean") return "dnd_unverified";
	if (contact.dnd) return "opted_out";
	for (const [channel, value] of Object.entries(contact.dndSettings || {})) {
		if (["sms", "call", "email"].includes(channel.toLowerCase()) && (value as any)?.status && (value as any).status !== "inactive") return "opted_out";
	}
	const tags = (contact.tags || []).map((tag: string) => tag.toLowerCase());
	if (tags.some((tag: string) => ["im-booked", "booked appointment"].includes(tag))) return "already_booked";
	return "enroll";
}
