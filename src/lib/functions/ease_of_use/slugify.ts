export function slugify(string, include = { slash: false }) {
    // Custom replacements
    if (include.slash) {
        string = string.replace(/[\/]+/g, '_'); // Replace slashes with underscores
    }

    // Final polish
    const slug = string
        .toLowerCase()                  // Convert to lowercase
        .trim()                         // Remove whitespace from both sides
        .replace(/[^\w\s]+/g, '')       // Remove all non-word and non-whitespace characters
        .replace(/[\s_]+/g, '_')        // Replace spaces and multiple underscores with a single underscore
        .replace(/__+/g, '_');          // Replace multiple underscores with a single one

    return slug;
}
