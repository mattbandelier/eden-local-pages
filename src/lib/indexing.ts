export const indexableComboKeys = new Set([
	"diamondglow-facial/greenwood-village",
	"botox/greenwood-village",
	"lip-filler/greenwood-village",
	"iv-therapy/greenwood-village",
	"iv-therapy/littleton",
	"microneedling/greenwood-village",
	"dermal-fillers/greenwood-village",
	"medical-weight-loss/greenwood-village",
	"medical-weight-loss/denver",
	"bbl-photofacial/greenwood-village",
	"female-bhrt/greenwood-village",
	"female-bhrt/denver",
	"male-trt/greenwood-village",
	"male-trt/denver",
	"peptide-therapy/greenwood-village",
	"peptide-therapy/denver",
	"prf-hair-restoration/greenwood-village",
	"nad-iv-therapy/greenwood-village",
	"botox/centennial",
	"botox/denver",
	"bbl-photofacial/cherry-hills-village",
	"bbl-photofacial/littleton",
	"bbl-photofacial/south-aurora",
	"diamondglow-facial/highlands-ranch",
	"dermal-fillers/highlands-ranch",
	"medical-weight-loss/lone-tree",
	"nad-iv-therapy/lone-tree",
	"prf-hair-restoration/englewood",
	"prf-hair-restoration/lone-tree",
]);

export function comboKey(serviceSlug: string, suburbSlug: string): string {
	return `${serviceSlug}/${suburbSlug}`;
}

export function isIndexableCombo(serviceSlug: string, suburbSlug: string): boolean {
	return indexableComboKeys.has(comboKey(serviceSlug, suburbSlug));
}

export const indexableFitnessSlugs = new Set([
	"strength-training-greenwood-village",
	"personal-training-denver-tech-center",
	"semi-private-training-denver-tech-center",
	"body-composition-training-greenwood-village",
	"glp-1-strength-training-greenwood-village",
	"glp-1-fitness-membership-greenwood-village",
	"elevate-membership-greenwood-village",
	"group-fitness-classes-greenwood-village",
	"medical-weight-loss-fitness-greenwood-village",
	"red-light-therapy-denver",
	"fitness-performance-denver-tech-center",
	"perimenopause-fitness-greenwood-village",
	"body-recomposition-denver-tech-center",
	"performance-lab-greenwood-village",
	"performance-training-greenwood-village",
	"recovery-performance-greenwood-village",
	"executive-fitness-greenwood-village",
	"semi-private-personal-training-greenwood-village",
]);

export function isIndexableFitness(slug: string): boolean {
	return indexableFitnessSlugs.has(slug);
}
