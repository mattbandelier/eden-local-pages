import { services } from "../data";
import { gbpPostUrl, gbpServiceUrl } from "../lib/campaign-urls";
import { comboUrl } from "../lib/urls";

export const prerender = true;

export function GET() {
	const links = services.map((service) => ({
		service: service.name,
		serviceSlug: service.slug,
		canonicalUrl: comboUrl(service.slug, "greenwood-village"),
		gbpServiceUrl: gbpServiceUrl(service.slug),
		gbpPostUrl: gbpPostUrl(service.slug),
		primaryKeyword: service.targetKeywords.primary,
		secondaryKeywords: service.targetKeywords.secondary,
	}));

	return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), links }, null, 2), {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
