import { services, suburbs } from "../data";
import { comboUrl, homeUrl, serviceHubUrl, suburbHubUrl } from "../lib/urls";

export const prerender = true;

const urls = [
	homeUrl(),
	...services.map((service) => serviceHubUrl(service.slug)),
	...suburbs.map((suburb) => suburbHubUrl(suburb.slug)),
	...services.flatMap((service) =>
		suburbs.map((suburb) => comboUrl(service.slug, suburb.slug)),
	),
];

function escapeXml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");
}

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `	<url>
		<loc>${escapeXml(url)}</loc>
	</url>`,
	)
	.join("\n")}
</urlset>
`;

	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
