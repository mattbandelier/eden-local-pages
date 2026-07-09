export interface AttributionSnapshot {
	firstTouch: Record<string, string | null>;
	lastTouch: Record<string, string | null>;
}

const ATTRIBUTION_KEYS = [
	"gad_source",
	"gad_campaignid",
	"gad_adgroupid",
	"gad_keywordid",
	"gclsrc",
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"gclid",
	"gbraid",
	"wbraid",
	"fbclid",
	"msclkid",
] as const;

const FIRST_TOUCH_KEY = "eden_first_touch";
const LAST_TOUCH_KEY = "eden_last_touch";
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

type AttributionKey = (typeof ATTRIBUTION_KEYS)[number] | "landing_page" | "landing_path" | "referrer" | "captured_at";

function isFresh(touch: Record<string, string | null>): boolean {
	const capturedAt = touch.captured_at;
	if (!capturedAt) return true;
	const capturedTime = Date.parse(capturedAt);
	if (!Number.isFinite(capturedTime)) return true;
	return Date.now() - capturedTime <= ATTRIBUTION_TTL_MS;
}

function readCookie(name: string): string | null {
	const encodedName = `${encodeURIComponent(name)}=`;
	const match = document.cookie
		.split(";")
		.map((part) => part.trim())
		.find((part) => part.startsWith(encodedName));
	return match ? decodeURIComponent(match.slice(encodedName.length)) : null;
}

function writeCookie(name: string, value: string): void {
	const secure = window.location.protocol === "https:" ? "; Secure" : "";
	document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Max-Age=${Math.floor(
		ATTRIBUTION_TTL_MS / 1000,
	)}; Path=/; SameSite=Lax${secure}`;
}

function readStoredAttribution(key: string): Record<string, string | null> {
	try {
		const value = window.localStorage.getItem(key);
		if (value) {
			const parsed = JSON.parse(value) as Record<string, string | null>;
			if (parsed && typeof parsed === "object" && isFresh(parsed)) return parsed;
		}
	} catch {
		// Storage can be unavailable in private browsing or restricted contexts.
	}

	try {
		const cookieValue = readCookie(key);
		if (!cookieValue) return {};
		const parsed = JSON.parse(cookieValue) as Record<string, string | null>;
		if (parsed && typeof parsed === "object" && isFresh(parsed)) return parsed;
	} catch {
		return {};
	}

	return {};
}

function writeStoredAttribution(key: string, value: Record<string, string | null>): void {
	const serialized = JSON.stringify(value);

	try {
		window.localStorage.setItem(key, serialized);
	} catch {
		// Storage can be unavailable in private browsing or restricted contexts.
	}

	try {
		writeCookie(key, serialized);
	} catch {
		// Cookies can be blocked; localStorage still covers the common case.
	}
}

function currentPage(): string {
	return `${window.location.origin}${window.location.pathname}${window.location.search}${window.location.hash}`;
}

function captureCurrentTouch(): Record<AttributionKey, string | null> {
	const params = new URLSearchParams(window.location.search);
	const touch = ATTRIBUTION_KEYS.reduce(
		(acc, key) => {
			acc[key] = params.get(key);
			return acc;
		},
		{} as Record<AttributionKey, string | null>,
	);

	touch.landing_page = currentPage();
	touch.landing_path = window.location.pathname;
	touch.referrer = document.referrer || null;
	touch.captured_at = new Date().toISOString();
	return touch;
}

function hasCampaignSignal(touch: Record<string, string | null>): boolean {
	return ATTRIBUTION_KEYS.some((key) => Boolean(touch[key]));
}

export function initAttribution(): AttributionSnapshot {
	if (typeof window === "undefined") return { firstTouch: {}, lastTouch: {} };

	const currentTouch = captureCurrentTouch();
	const firstTouch = readStoredAttribution(FIRST_TOUCH_KEY);
	const shouldCapture = hasCampaignSignal(currentTouch) || !firstTouch.landing_page;

	if (shouldCapture && !firstTouch.landing_page) {
		writeStoredAttribution(FIRST_TOUCH_KEY, currentTouch);
	}

	if (shouldCapture) {
		writeStoredAttribution(LAST_TOUCH_KEY, currentTouch);
	}

	return getAttribution();
}

export function getAttribution(): AttributionSnapshot {
	if (typeof window === "undefined") return { firstTouch: {}, lastTouch: {} };

	return {
		firstTouch: readStoredAttribution(FIRST_TOUCH_KEY),
		lastTouch: readStoredAttribution(LAST_TOUCH_KEY),
	};
}
