export function slugify(string, include = { slash: false }) {
	const specialChars = {
		':': '_',
		ä: 'ae',
		ö: 'oe',
		ü: 'ue',
		Ä: 'Ae',
		Ö: 'Oe',
		Ü: 'Ue',
		é: 'e',
		è: 'e',
		ë: 'e',
		ß: 'ss',
		ç: 'c',
	};

	// Custom replacements
	if (include.slash) {
		string = string.replace(/[\/]+/g, '_'); // Replace slashes with underscores
	}

	// Replace special characters
	let modifiedString = string
		.split('')
		.map((char) => {
			return specialChars[char] || char; // Use the mapped value or the original character
		})
		.join('');

	// Final polish
	const slug = modifiedString
		.trim() // Remove whitespace from both sides
		.replace(/[^\w\s?]+/g, '') // Remove all non-word and non-whitespace characters (but keep "?")
		.replace(/[\s_]+/g, '_') // Replace spaces and multiple underscores with a single underscore
		.replace(/__+/g, '_'); // Replace multiple underscores with a single one

	return slug;
}
