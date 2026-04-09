export function findKeyBySlug(dict: Object, secondary: string | undefined): string | null {
	for (const key of Object.keys(dict)) {
		if (dict[key][secondary]) {
			return key; // Return the corresponding first-order key
		}
	}
	return null; // Return null if not found
}
