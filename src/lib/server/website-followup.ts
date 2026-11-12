import { websiteFollowupRoute, websiteFollowupDecision, WEBSITE_FOLLOWUP_CONSENT_TEXT, WEBSITE_FOLLOWUP_CONSENT_VERSION } from "../website-followup.ts";

// The contact has already been captured. Never clear DND or fall back into a shared sales sequence.
export async function routeWebsiteFollowup({ token, contactId, payload, enabled, assignedTo, fetcher = fetch }: {
	token: string; contactId: string; payload: any; enabled: boolean; assignedTo?: string; fetcher?: typeof fetch;
}) {
	const route = websiteFollowupRoute(payload);
	if (!route) return false;
	const headers = { authorization: `Bearer ${token}`, "content-type": "application/json", version: "v3" };
	const root = `https://services.leadconnectorhq.com/contacts/${contactId}`;
	let contact = null;
	try {
		const res = await fetcher(root, { headers });
		if (res.ok) contact = (await res.json()).contact;
	} catch { /* A read failure must never authorize automated outreach. */ }
	let decision = websiteFollowupDecision(payload, contact, enabled);
	const evidence = {
		schema: "eden_website_followup_consent_v1", service: route.label, workflow_id: route.workflowId,
		consent: payload.followupConsent === true, consent_version: payload.consentVersion,
		disclosure: WEBSITE_FOLLOWUP_CONSENT_TEXT, expected_version: WEBSITE_FOLLOWUP_CONSENT_VERSION,
		submitted_at: payload.submittedAt, source_page: payload.sourcePage, event_id: payload.attributionEventId,
		decision, message: payload.message, utm_source: payload.utmSource, utm_campaign: payload.utmCampaign,
	};
	const note = await fetcher(`${root}/notes`, { method: "POST", headers, body: JSON.stringify({ title: `Website ${route.label} inquiry and consent`, body: JSON.stringify(evidence), ...(assignedTo ? { userId: assignedTo } : {}) }) });
	if (!note.ok) return false;
	if (decision === "enroll") {
		const enrollment = await fetcher(`${root}/workflow/${route.workflowId}`, { method: "POST", headers: { ...headers, version: "2021-07-28" } });
		const body = await enrollment.json().catch(() => null);
		if (enrollment.ok && body?.succeeded !== false) return true;
		decision = "enrollment_failed";
	}
	// A declined checkbox or existing opt-out still creates a visible lead for staff review.
	const task = await fetcher(`${root}/tasks`, {
		method: "POST", headers,
		body: JSON.stringify({ title: `Website ${route.label} inquiry — review`, body: `Automated follow-up held: ${decision}. Review the inquiry and consent note before choosing a permitted reply channel. Do not override opt-outs. Source: ${payload.sourcePage}`, dueDate: payload.submittedAt, completed: false, ...(assignedTo ? { assignedTo } : {}) }),
	});
	return task.ok;
}
