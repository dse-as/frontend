// Normalize the input string
export function normalizeChars(input: string | null | undefined): string {
	if (!input) return '';
	return input
		.normalize('NFD') // Decomposes combined characters into base characters and diacritics
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
		.replace(/[^A-Za-z0-9?]/g, ''); // Remove non-alphanumeric characters except "?"
}
