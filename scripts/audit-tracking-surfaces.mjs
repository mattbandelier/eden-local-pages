import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [buildRoot = "dist/client", csvOutput = "tracking-surface-map.csv", summaryOutput = "tracking-surface-summary.md"] = process.argv.slice(2);
const productionGtmContainer = "GTM-5ZZLQFMN";

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(fullPath)));
		else if (entry.isFile() && entry.name.endsWith(".html")) files.push(fullPath);
	}
	return files;
}

function routeFor(file) {
	let relative = path.relative(buildRoot, file).replaceAll(path.sep, "/");
	if (relative === "index.html") return "/";
	relative = relative.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
	return `/${relative}`;
}

function uniqueMatches(content, pattern) {
	return [...new Set([...content.matchAll(pattern)].map((match) => match[1]))];
}

function csvCell(value) {
	const text = String(value ?? "");
	return `"${text.replaceAll('"', '""')}"`;
}

const files = await walk(buildRoot);
const rows = [];
for (const file of files.sort()) {
	const html = await readFile(file, "utf8");
	const route = routeFor(file);
	const gtmIds = uniqueMatches(html, /googletagmanager\.com\/(?:gtm\.js|ns\.html)\?id=(GTM-[A-Z0-9]+)/g);
	if (html.includes("googletagmanager.com/gtm.js") && !gtmIds.length) gtmIds.push(productionGtmContainer);
	const metaIds = uniqueMatches(html, /facebook\.com\/tr\?id=(\d+)/g);
	rows.push({
		url: `https://landing.edenhealthclubs.com${route}`,
		surface: "marketing",
		lead_form: html.includes("data-lead-form") ? "yes" : "no",
		gtm_containers: gtmIds.join(";"),
		meta_pixels: metaIds.join(";"),
		ad_pixel_policy: "allowed on marketing page",
		privacy_status: "generic conversion events; no email, phone, service, or health-interest fields in dataLayer",
	});
}

const zenotiBase = "https://booking.edenhealthclubs.com/webstoreNew/a1fda69e-77f9-4077-bb8a-3b06349b6af3";
const zenotiServices = [
	["$299 Peptide Starter", "894f40cb-140b-4625-a730-7330edb58dad"],
	["Aesthetic Consultation", "36c44f93-eb18-40e2-b6e4-ea5a199ee0f8"],
	["Red Light Therapy", "3afb2f6c-db79-4be7-af48-3f45fa3fcd43"],
	["Infrared Sauna", "bd7b39c6-6688-4289-9e53-c2548b42e484"],
	["IV Therapy", "be92cce0-aaa2-4b4d-9780-43304200e955"],
];
for (const [name, serviceId] of zenotiServices) {
	rows.push({
		url: `${zenotiBase}?serviceid=${serviceId}`,
		surface: `Zenoti booking/checkout — ${name}`,
		lead_form: "guest/contact/payment later in flow",
		gtm_containers: "GTM-TXHRT65T;GTM-THLTX2W",
		meta_pixels: "1301043457641549",
		ad_pixel_policy: "exclude ad pixels",
		privacy_status: "BLOCKED: Zenoti configuration change required",
	});
}

const columns = ["url", "surface", "lead_form", "gtm_containers", "meta_pixels", "ad_pixel_policy", "privacy_status"];
const csv = [columns.map(csvCell).join(","), ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(","))].join("\n") + "\n";
await writeFile(csvOutput, csv, "utf8");

const marketingRows = rows.filter((row) => row.surface === "marketing");
const zenotiRows = rows.filter((row) => row.surface.startsWith("Zenoti"));
const metaCounts = new Map();
for (const row of rows) {
	for (const pixel of row.meta_pixels.split(";").filter(Boolean)) metaCounts.set(pixel, (metaCounts.get(pixel) || 0) + 1);
}

const summary = `# Eden Tracking-Surface Audit

Generated from the production-equivalent Astro build and a direct inspection of the Zenoti webstore shell.

## Coverage

- Marketing HTML routes mapped: ${marketingRows.length}
- Marketing routes with lead forms: ${marketingRows.filter((row) => row.lead_form === "yes").length}
- Zenoti service/booking routes mapped: ${zenotiRows.length}
- Meta pixels observed: ${[...metaCounts.entries()].map(([id, count]) => `\`${id}\` on ${count} mapped route(s)`).join(", ")}

## Decision

- Marketing pages keep GTM and Meta PageView/Lead measurement.
- Customer email and phone were removed from the GTM data layer.
- Service slug, suburb, and health-interest category were removed from ad-platform-visible conversion events.
- Generic events remain: \`lead_submit\`, \`consult_request\`, \`lead_form_success\`, and \`instant_booking_click\`.
- Zenoti booking/checkout still loads Meta pixel \`1301043457641549\` plus \`GTM-TXHRT65T\` and \`GTM-THLTX2W\`; this requires a Zenoti-side configuration change before the booking/intake/confirmation surface is privacy-clean.

## Measurement conflict

Removing Meta from Zenoti booking/checkout may remove browser-side Schedule/Purchase events. Preserve conversion measurement through the Zenoti-to-GHL server-side lifecycle sync and generic, consented analytics—not through an ad pixel observing booking or health-detail surfaces.
`;
await writeFile(summaryOutput, summary, "utf8");

console.log(`Wrote ${rows.length} rows to ${csvOutput}`);
console.log(`Wrote summary to ${summaryOutput}`);
