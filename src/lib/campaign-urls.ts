import { comboUrl, serviceHubUrl } from "./urls";

export interface CampaignUrlOptions {
	source: string;
	medium: string;
	campaign: string;
	content?: string;
	term?: string;
}

export function withCampaignParams(url: string, options: CampaignUrlOptions): string {
	const trackedUrl = new URL(url);
	trackedUrl.searchParams.set("utm_source", options.source);
	trackedUrl.searchParams.set("utm_medium", options.medium);
	trackedUrl.searchParams.set("utm_campaign", options.campaign);

	if (options.content) trackedUrl.searchParams.set("utm_content", options.content);
	if (options.term) trackedUrl.searchParams.set("utm_term", options.term);

	return trackedUrl.toString();
}

export function gbpPostUrl(serviceSlug: string, suburbSlug = "greenwood-village", content?: string): string {
	return withCampaignParams(comboUrl(serviceSlug, suburbSlug), {
		source: "gbp",
		medium: "post",
		campaign: "local-seo",
		content: content ?? serviceSlug,
	});
}

export function gbpServiceUrl(serviceSlug: string, suburbSlug = "greenwood-village"): string {
	return withCampaignParams(comboUrl(serviceSlug, suburbSlug), {
		source: "gbp",
		medium: "organic",
		campaign: "profile_services",
		content: serviceSlug,
	});
}

export function googleAdsFinalUrl(serviceSlug: string, suburbSlug?: string): string {
	const baseUrl = suburbSlug ? comboUrl(serviceSlug, suburbSlug) : serviceHubUrl(serviceSlug);
	return withCampaignParams(baseUrl, {
		source: "google",
		medium: "cpc",
		campaign: "{{campaignid}}",
		term: "{{keyword}}",
		content: "{{creative}}",
	});
}
