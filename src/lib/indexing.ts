export const indexableComboKeys = new Set([
	"diamondglow-facial/greenwood-village",
	"botox/greenwood-village",
	"lip-filler/greenwood-village",
	"iv-therapy/littleton",
	"microneedling/greenwood-village",
	"dermal-fillers/greenwood-village",
	"medical-weight-loss/greenwood-village",
	"bbl-photofacial/greenwood-village",
	"female-bhrt/greenwood-village",
	"male-trt/greenwood-village",
	"peptide-therapy/greenwood-village",
	"prf-hair-restoration/greenwood-village",
	"nad-iv-therapy/greenwood-village",
	"botox/centennial",
	"botox/denver",
]);

export function comboKey(serviceSlug: string, suburbSlug: string): string {
	return `${serviceSlug}/${suburbSlug}`;
}

export function isIndexableCombo(serviceSlug: string, suburbSlug: string): boolean {
	return indexableComboKeys.has(comboKey(serviceSlug, suburbSlug));
}
