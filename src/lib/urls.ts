const SITE_ORIGIN = "https://landing.edenhealthclubs.com";

function withTrailingSlash(path: string): string {
	if (path === "" || path === "/") return "/";
	return path.endsWith("/") ? path : `${path}/`;
}

export function canonicalUrl(path: string): string {
	return `${SITE_ORIGIN}${withTrailingSlash(path)}`;
}

export function homeUrl(): string {
	return canonicalUrl("/");
}

export function serviceHubUrl(serviceSlug: string): string {
	return canonicalUrl(`/${serviceSlug}`);
}

export function suburbHubUrl(suburbSlug: string): string {
	return canonicalUrl(`/locations/${suburbSlug}`);
}

export function comboUrl(serviceSlug: string, suburbSlug: string): string {
	return canonicalUrl(`/${serviceSlug}/${suburbSlug}`);
}

export const ORIGIN = SITE_ORIGIN;

export const serviceUrl = serviceHubUrl;
export const suburbUrl = suburbHubUrl;
