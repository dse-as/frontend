export function updateSearchParams(
	searchParams: URLSearchParams,
	keyValuePair: Record<string, string | null | undefined>
) {
	// This function updates (or deletes) searchParams and directly returns searchParams.toString()
	// This is useful for usage in anchor-tags.

	Object.entries(keyValuePair).forEach(([key, value]) => {
		if (value) searchParams.set(key, value);
		else searchParams.delete(key);
	});
	return searchParams.toString();
}
