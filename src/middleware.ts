import { defineMiddleware } from "astro:middleware";

// The booking subdomain is a branded root-domain entry point to the same
// deployed app. Keep the main site routes unchanged while making /book the
// first screen on book.edenhealthclubs.com.
export const onRequest = defineMiddleware(({ request, rewrite }, next) => {
	const url = new URL(request.url);
	const hostname = url.hostname.toLowerCase();

	if (hostname === "book.edenhealthclubs.com" && (url.pathname === "/" || url.pathname === "")) {
		return rewrite(new URL(`/book/${url.search}`, request.url));
	}

	return next();
});
