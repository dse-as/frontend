export function updateSearchParams(
	searchParams: URLSearchParams,
	keyValue: Record<string, string | null | undefined>
) {
	// This function updates (or deletes) searchParams and directly returns searchParams.toString()
	// This is useful for usage in anchor-tags.
	//! Probably, this could be replaced with https://runed.dev/docs/utilities/use-search-params

	Object.entries(keyValue).forEach(([key, value]) => {
		if (value) searchParams.set(key, value);
		else searchParams.delete(key);
	});
	return searchParams.toString();
}
