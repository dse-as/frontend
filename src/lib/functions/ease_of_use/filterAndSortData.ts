type TFilterAndSortOptions = {
	filterKey?: string;
	filtersIn?: string[];
	filtersOut?: string[];
};

export function filterAndSortData(
	data: Record<string, any>,
	sortBy: string,
	{ filterKey = '', filtersIn = [], filtersOut = [] }: TFilterAndSortOptions = {}
): [string, typeof data][] {
	// Define the sort function
	let sortFunction: (a: [string, any], b: [string, any]) => number;

	if (sortBy === 'date') {
		// Sort chronologically by date
		sortFunction = (a, b) => {
			// Destructure to get the actual data objects
			const [, entryA] = a;
			const [, entryB] = b;

			const compare = (x?: string, y?: string) => {
				if (!x && !y) return 0;
				if (!x) return 1;
				if (!y) return -1;
				return x.localeCompare(y);
			};

			// Access .from and .to on the entry objects
			// Assuming the structure is { from: string, to: string } inside the entry
			const valAFrom = entryA[sortBy]?.from as string;
			const valBFrom = entryB[sortBy]?.from as string;
			const valATo = entryA[sortBy]?.to as string;
			const valBTo = entryB[sortBy]?.to as string;

			return compare(valAFrom, valBFrom) || compare(valATo, valBTo);
		};
	} else {
		// Sort alphabetically by sortBy
		sortFunction = (a, b) => {
			const [, entryA] = a;
			const [, entryB] = b;

			const aVal = entryA[sortBy];
			const bVal = entryB[sortBy];

			// Handle undefined values
			if (!aVal && !bVal) return 0;
			if (!aVal) return 1;
			if (!bVal) return -1;

			// Ensure we are comparing strings
			return String(aVal).localeCompare(String(bVal));
		};
	}

	// Filter and sort data
	return Object.entries(data)
		.map(([key, entry]) => [key, entry] as [string, typeof data])
		.filter(([, entry]) =>
			filtersIn?.length
				? filtersIn.some((filter) => entry[filterKey]?.trim().split(/,\s+/).includes(filter))
				: true
		)
		.filter(([, entry]) =>
			filtersOut?.length
				? !filtersOut.some((filter) => entry[filterKey]?.trim().split(/,\s+/).includes(filter))
				: true
		)
		.sort(sortFunction);
}
