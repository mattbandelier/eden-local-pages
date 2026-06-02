import type { APIRoute } from "astro";

export const prerender = false;

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

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
	referrer?: unknown;
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
	referrer: string | null;
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

export const POST: APIRoute = async ({ request, clientAddress }) => {
	const webhookUrl = import.meta.env.GHL_WEBHOOK_URL;

	if (!webhookUrl) {
		return jsonResponse({ success: false, error: "Lead webhook is not configured." }, 500);
	}

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
		referrer: stringOrNull(body.referrer),
		submittedAt: new Date().toISOString(),
	};

	const response = await fetch(webhookUrl, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok) {
		return jsonResponse({ success: false, error: "Lead webhook request failed." }, 502);
	}

	return jsonResponse({ success: true }, 200);
};
