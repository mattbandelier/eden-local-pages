export interface AttributionSnapshot {
	firstTouch: Record<string, string | null>;
	lastTouch: Record<string, string | null>;
}

const ATTRIBUTION_KEYS = [
	"utm_source",
	"utm_medium",
	"utm_campaign",
	"utm_term",
	"utm_content",
	"gclid",
	"gbraid",
	"wbraid",
	"fbclid",
] as const;

const FIRST_TOUCH_KEY = "eden_first_touch";
const LAST_TOUCH_KEY = "eden_last_touch";

type AttributionKey = (typeof ATTRIBUTION_KEYS)[number] | "landing_page" | "referrer" | "captured_at";

function readStoredAttribution(key: string): Record<string, string | null> {
	try {
		const value = window.localStorage.getItem(key);
		if (!value) return {};
		const parsed = JSON.parse(value) as Record<string, string | null>;
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}

function writeStoredAttribution(key: string, value: Record<string, string | null>): void {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		// Storage can be unavailable in private browsing or restricted contexts.
	}
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

	touch.landing_page = window.location.pathname;
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
