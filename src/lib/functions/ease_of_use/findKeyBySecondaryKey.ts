export function findKeyBySecondaryKey(
	dict: Record<string, Record<string, any>>,
	secondary: string | undefined
): string | null {
	if (!secondary) return null; // Return null if no secondary key given
	for (const key of Object.keys(dict)) {
		if (dict[key]?.[secondary]) {
			return key; // Return the corresponding first-order key
		}
	}
	return null; // Return null if not found
}
