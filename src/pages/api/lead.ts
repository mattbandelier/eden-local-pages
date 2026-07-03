import type { APIRoute } from "astro";

export const prerender = false;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const GHL_CUSTOM_FIELD_IDS = {
	gaClientId: "W2uCfvAUkIwckXY7kQXD",
	sourcePage: "6z1DrlIUeDmxQN2O9U9z",
	submittedAt: "Kt4ab0lpAI0V6UAvslmG",
	firstTouch: "Fs0uASQxNz2FZQVWaBQt",
	lastTouch: "4IlL6u5aftgbWsczNE6L",
	utmSource: "DAHeUI19xwn271AXFrXz",
	utmMedium: "W2D8gwz3vZriHdTtUnNo",
	utmCampaign: "B5SFqADmrKNS5kFzEMI8",
	utmTerm: "PWtgiHfhEStgRnGE1guX",
	utmContent: "ympG9zecCaqi8jGET05D",
	gclid: "SCdvQuymKXAniOcWxxmW",
	gbraid: "n4cxQWLMuSWgKDiVt4lY",
	wbraid: "PkdeczvbdVMUyFKuJxBq",
} as const;

interface LeadRequestBody {
	firstName?: unknown;
	lastName?: unknown;
	phone?: unknown;
	email?: unknown;
	smsOptIn?: unknown;
	message?: unknown;
	service?: unknown;
	suburb?: unknown;
	sourcePage?: unknown;
	utmSource?: unknown;
	utmMedium?: unknown;
	utmCampaign?: unknown;
	utmTerm?: unknown;
	utmContent?: unknown;
	gclid?: unknown;
	gbraid?: unknown;
	wbraid?: unknown;
	gaClientId?: unknown;
	referrer?: unknown;
	firstTouch?: unknown;
	lastTouch?: unknown;
	website?: unknown;
}

interface LeadPayload {
	firstName: string | null;
	lastName: string | null;
	phone: string;
	email: string;
	smsOptIn: boolean;
	message: string | null;
	service: string | null;
	suburb: string | null;
	sourcePage: string | null;
	utmSource: string | null;
	utmMedium: string | null;
	utmCampaign: string | null;
	utmTerm: string | null;
	utmContent: string | null;
	gclid: string | null;
	gbraid: string | null;
	wbraid: string | null;
	gaClientId: string | null;
	referrer: string | null;
	firstTouch: Record<string, string | null> | null;
	lastTouch: Record<string, string | null> | null;
	submittedAt: string;
}

function stringOrNull(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed.length ? trimmed : null;
}

function normalizePhone(value: unknown): string | null {
	if (typeof value !== "string") return null;
	const digits = value.replace(/\D/g, "");
	if (digits.length === 10) return `+1${digits}`;
	if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
	return null;
}

function isValidEmail(value: unknown): value is string {
	return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function attributionOrNull(value: unknown): Record<string, string | null> | null {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;

	return Object.entries(value as Record<string, unknown>).reduce(
		(acc, [key, entry]) => {
			if (typeof entry === "string") acc[key] = entry.trim() || null;
			if (entry === null) acc[key] = null;
			return acc;
		},
		{} as Record<string, string | null>,
	);
}

function getClientIp(request: Request, clientAddress?: string): string {
	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	return forwardedFor || clientAddress || "unknown";
}

function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const current = rateLimit.get(ip);

	if (!current || current.resetAt <= now) {
		rateLimit.set(ip, { count: 1, resetAt: now + WINDOW_MS });
		return false;
	}

	current.count += 1;
	return current.count > MAX_REQUESTS_PER_WINDOW;
}

function jsonResponse(body: unknown, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json" },
	});
}

function compactJson(value: Record<string, string | null> | null): string | null {
	if (!value || !Object.keys(value).length) return null;
	return JSON.stringify(value);
}

function customField(id: string, value: string | null): { id: string; field_value: string } | null {
	if (!value) return null;
	return { id, field_value: value };
}

function optionalCustomField(id: string | undefined, value: string | null): { id: string; field_value: string } | null {
	if (!id) return null;
	return customField(id, value);
}

async function postLeadWebhook(webhookUrl: string | undefined, payload: LeadPayload): Promise<boolean> {
	if (!webhookUrl) return false;
	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	});

	return response.ok;
}

async function upsertGhlContact(payload: LeadPayload): Promise<boolean> {
	const token = import.meta.env.GHL_PRIVATE_INTEGRATION_TOKEN;
	const locationId = import.meta.env.GHL_LOCATION_ID;
	if (!token || !locationId) return false;

	const customFields = [
		customField(GHL_CUSTOM_FIELD_IDS.gaClientId, payload.gaClientId),
		customField(GHL_CUSTOM_FIELD_IDS.sourcePage, payload.sourcePage),
		customField(GHL_CUSTOM_FIELD_IDS.submittedAt, payload.submittedAt),
		customField(GHL_CUSTOM_FIELD_IDS.firstTouch, compactJson(payload.firstTouch)),
		customField(GHL_CUSTOM_FIELD_IDS.lastTouch, compactJson(payload.lastTouch)),
		customField(GHL_CUSTOM_FIELD_IDS.utmSource, payload.utmSource),
		customField(GHL_CUSTOM_FIELD_IDS.utmMedium, payload.utmMedium),
		customField(GHL_CUSTOM_FIELD_IDS.utmCampaign, payload.utmCampaign),
		customField(GHL_CUSTOM_FIELD_IDS.utmTerm, payload.utmTerm),
		customField(GHL_CUSTOM_FIELD_IDS.utmContent, payload.utmContent),
		customField(GHL_CUSTOM_FIELD_IDS.gclid, payload.gclid),
		customField(GHL_CUSTOM_FIELD_IDS.gbraid, payload.gbraid),
		customField(GHL_CUSTOM_FIELD_IDS.wbraid, payload.wbraid),
		optionalCustomField(import.meta.env.GHL_FIELD_SERVICE_SLUG, payload.service),
		optionalCustomField(import.meta.env.GHL_FIELD_SUBURB_SLUG, payload.suburb),
		optionalCustomField(import.meta.env.GHL_FIELD_LEAD_MESSAGE, payload.message),
	].filter((field): field is { id: string; field_value: string } => Boolean(field));

	const response = await fetch("https://services.leadconnectorhq.com/contacts/upsert", {
		method: "POST",
		headers: {
			accept: "application/json",
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
			version: "2021-07-28",
		},
		body: JSON.stringify({
			locationId,
			firstName: payload.firstName ?? undefined,
			lastName: payload.lastName ?? undefined,
			email: payload.email,
			phone: payload.phone,
			source: payload.utmSource || "Eden local landing page",
			customFields,
		}),
	});

	return response.ok;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
	const webhookUrl = import.meta.env.GHL_WEBHOOK_URL;

	const ip = getClientIp(request, clientAddress);
	if (isRateLimited(ip)) {
		return jsonResponse({ success: false, error: "Too many lead submissions." }, 429);
	}

	let body: LeadRequestBody;
	try {
		body = (await request.json()) as LeadRequestBody;
	} catch {
		return jsonResponse({ success: false, error: "Invalid JSON payload." }, 400);
	}

	if (stringOrNull(body.website)) {
		return jsonResponse({ success: true }, 200);
	}

	const phone = normalizePhone(body.phone);
	if (!phone) {
		return jsonResponse({ success: false, error: "A valid phone number is required." }, 400);
	}

	if (!isValidEmail(body.email)) {
		return jsonResponse({ success: false, error: "A valid email address is required." }, 400);
	}

	const payload: LeadPayload = {
		firstName: stringOrNull(body.firstName),
		lastName: stringOrNull(body.lastName),
		phone,
		email: body.email.trim(),
		smsOptIn: body.smsOptIn === true,
		message: stringOrNull(body.message),
		service: stringOrNull(body.service),
		suburb: stringOrNull(body.suburb),
		sourcePage: stringOrNull(body.sourcePage),
		utmSource: stringOrNull(body.utmSource),
		utmMedium: stringOrNull(body.utmMedium),
		utmCampaign: stringOrNull(body.utmCampaign),
		utmTerm: stringOrNull(body.utmTerm),
		utmContent: stringOrNull(body.utmContent),
		gclid: stringOrNull(body.gclid),
		gbraid: stringOrNull(body.gbraid),
		wbraid: stringOrNull(body.wbraid),
		gaClientId: stringOrNull(body.gaClientId),
		referrer: stringOrNull(body.referrer),
		firstTouch: attributionOrNull(body.firstTouch),
		lastTouch: attributionOrNull(body.lastTouch),
		submittedAt: new Date().toISOString(),
	};

	const [webhookOk, directGhlOk] = await Promise.all([postLeadWebhook(webhookUrl, payload), upsertGhlContact(payload)]);
	if (!webhookOk && !directGhlOk) {
		return jsonResponse({ success: false, error: "Lead delivery failed." }, 502);
	}

	return jsonResponse({ success: true }, 200);
};
