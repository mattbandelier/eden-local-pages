import type { APIRoute } from "astro";

export const prerender = false;

type BookingEventPayload = {
	eventId?: string;
	serviceSlug?: string;
	serviceName?: string;
	category?: string;
	sourceUrl?: string;
	fbp?: string | null;
	fbc?: string | null;
};

export const POST: APIRoute = async ({ request }) => {
	const payload = await request.json().catch(() => null) as BookingEventPayload | null;
	if (!isValidPayload(payload)) {
		return json({ accepted: false }, 400);
	}

	const pixelId = import.meta.env.META_PIXEL_ID || import.meta.env.PUBLIC_META_PIXEL_ID;
	const accessToken = import.meta.env.META_CAPI_ACCESS_TOKEN;
	if (!pixelId || !accessToken) {
		return json({ accepted: true, forwarded: false }, 202);
	}

	const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
	const userData = compact({
		client_ip_address: forwardedFor,
		client_user_agent: request.headers.get("user-agent"),
		fbp: payload.fbp,
		fbc: payload.fbc,
	});
	const graphVersion = import.meta.env.META_CAPI_VERSION || "v23.0";
	const response = await fetch(`https://graph.facebook.com/${graphVersion}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			data: [{
				event_name: "BookingClick",
				event_time: Math.floor(Date.now() / 1000),
				event_id: payload.eventId,
				action_source: "website",
				event_source_url: payload.sourceUrl,
				user_data: userData,
				custom_data: {
					service_slug: payload.serviceSlug,
					service_name: payload.serviceName,
					service_category: payload.category,
				},
			}],
		}),
	});

	return response.ok
		? json({ accepted: true, forwarded: true }, 200)
		: json({ accepted: true, forwarded: false }, 502);
};

function isValidPayload(payload: BookingEventPayload | null): payload is Required<Pick<BookingEventPayload, "eventId" | "serviceSlug" | "serviceName" | "category" | "sourceUrl">> & BookingEventPayload {
	if (!payload?.eventId || !payload.serviceSlug || !payload.serviceName || !payload.category || !payload.sourceUrl) return false;
	if (payload.eventId.length > 128 || payload.serviceSlug.length > 80 || payload.serviceName.length > 120 || payload.category.length > 80) return false;
	try {
		const sourceUrl = new URL(payload.sourceUrl);
		const allowedHosts = new Set(["landing.edenhealthclubs.com", "edenhealthclubs.com", "www.edenhealthclubs.com", "localhost", "127.0.0.1"]);
		return allowedHosts.has(sourceUrl.hostname) && (sourceUrl.protocol === "https:" || sourceUrl.hostname === "localhost" || sourceUrl.hostname === "127.0.0.1");
	} catch {
		return false;
	}
}

function compact(input: Record<string, string | null | undefined>): Record<string, string> {
	return Object.fromEntries(Object.entries(input).filter((entry): entry is [string, string] => Boolean(entry[1])));
}

function json(body: Record<string, boolean>, status: number): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "content-type": "application/json", "cache-control": "no-store" },
	});
}
