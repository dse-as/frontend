export function findKeyBySlug(
	dict: Record<string, Record<string, unknown>>,
	secondary: string | undefined
): string | null {
	if (!secondary) return null;
	for (const key of Object.keys(dict)) {
		if (dict[key]?.[secondary]) {
			return key; // Return the corresponding first-order key
		}
	}
	return null; // Return null if not found
}
