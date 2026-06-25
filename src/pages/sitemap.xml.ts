import { services, suburbs } from "../data";
import { fitnessPages } from "../data/fitness-pages";
import { isIndexableCombo, isIndexableFitness } from "../lib/indexing";
import { canonicalUrl, comboUrl, homeUrl, serviceHubUrl, suburbHubUrl } from "../lib/urls";

export const prerender = true;

const today = new Date().toISOString().slice(0, 10);

const urls = [
	{ loc: homeUrl(), priority: "1.0", changefreq: "weekly" },
	{ loc: canonicalUrl("/medical-spa-denver"), priority: "0.95", changefreq: "weekly" },
	...services.map((service) => ({
		loc: serviceHubUrl(service.slug),
		priority: "0.9",
		changefreq: "weekly",
	})),
	...suburbs.map((suburb) => ({
		loc: suburbHubUrl(suburb.slug),
		priority: suburb.slug === "greenwood-village" ? "0.9" : "0.7",
		changefreq: "monthly",
	})),
	...fitnessPages
		.filter((page) => isIndexableFitness(page.slug))
		.map((page) => ({
			loc: canonicalUrl(`/${page.slug}`),
			priority: "0.85",
			changefreq: "weekly",
		})),
	...services.flatMap((service) =>
		suburbs
			.filter((suburb) => isIndexableCombo(service.slug, suburb.slug))
			.map((suburb) => ({
				loc: comboUrl(service.slug, suburb.slug),
				priority: suburb.slug === "greenwood-village" ? "0.9" : "0.8",
				changefreq: "weekly",
			})),
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
		<loc>${escapeXml(url.loc)}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>${url.changefreq}</changefreq>
		<priority>${url.priority}</priority>
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
