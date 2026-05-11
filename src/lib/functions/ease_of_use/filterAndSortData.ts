type TFilterAndSortOptions = {
	filterKey?: string;
	filtersIn?: string[];
	filtersOut?: string[];
};

export function filterAndSortData(
	data: Record<string, any>,
	sortBy: string,
	{ filterKey = '', filtersIn = [], filtersOut = [] }: TFilterAndSortOptions = {}
) {
	let sortFunction: (a: Record<string, any>, b: Record<string, any>) => number;
	if (sortBy === 'date') {
		sortFunction = (a, b) => {
			const compare = (x?: string, y?: string) => {
				if (!x && !y) return 0; // treat as equal
				if (!x) return 1; // Push `x` to the end
				if (!y) return -1; // Push `y` to the end
				return x.localeCompare(y); // Compare normally if both are defined
			};

			// First compare by `from`, then by `to` if needed
			return compare(a[sortBy]?.from, b[sortBy]?.from) || compare(a[sortBy]?.to, b[sortBy]?.to);
		};
	} else {
		// Sort alphabetically by sortBy
		sortFunction = (a, b) => {
			// a[sortBy]?.localeCompare(b[sortBy]) || 0;
			const aName = a[sortBy];
			const bName = b[sortBy];

			// Handle undefined values
			if (!aName && !bName) return 0; // Treat both as equal
			if (!aName) return 1; // Push `a` to the end
			if (!bName) return -1; // Push `b` to the end

			return aName.localeCompare(bName); // Compare normally if both are defined
		};
	}

	// Filter and sort data
	return Object.entries(data)
		.map(([key, entry]) => ({ key, ...(entry as object) }) as Record<string, string>) // Include the key in each value
		.filter((entry) =>
			filtersIn?.length
				? filtersIn.some((filter) => entry[filterKey].trim().split(/,\s+/).includes(filter))
				: true
		)
		.filter((entry) =>
			filtersOut?.length
				? !filtersOut.some((filter) => entry[filterKey].trim().split(/,\s+/).includes(filter))
				: true
		)
		.sort((a, b) => sortFunction(a, b));
}
