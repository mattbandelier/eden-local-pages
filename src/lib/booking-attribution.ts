const ATTRIBUTION_KEYS = [
	"_gl",
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

export function appendAttributionParams(href: string): string {
	if (typeof window === "undefined") return href;

	const destination = new URL(href, window.location.origin);
	const current = new URLSearchParams(window.location.search);
	for (const key of ATTRIBUTION_KEYS) {
		const value = current.get(key);
		if (value) destination.searchParams.set(key, value);
	}
	return destination.toString();
}
