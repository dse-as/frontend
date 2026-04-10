// Normalize the input string
export function normalizeChars(input) {
	if (!input) return input;
	return input
		.normalize('NFD') // Decomposes combined characters into base characters and diacritics
		.replace(/[\u0300-\u036f]/g, ''); // Remove diacritical marks
	// .replace(/[^A-Za-z]/g, ''); // Remove non-alphabetic characters
}
