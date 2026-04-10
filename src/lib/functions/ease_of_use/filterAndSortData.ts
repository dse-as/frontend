export function filterAndSortData(
		item,
		sortBy,
		filteringOptions = { filterKey: '', filtersIn: [], filtersOut: [] }
	) {
		let sortFunction;
		if (sortBy === 'date') {
			sortFunction = (a, b) => {
				const compare = (x, y) => {
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

		// Filter and sort item
		return Object.entries(item)
			.map(([key, entry]) => ({ key, ...(entry as Object) })) // Include the key in each value
			.filter((entry) =>
				filteringOptions.filtersIn?.length
					? filteringOptions.filtersIn.includes(entry[filteringOptions.filterKey])
					: true
			)
			.filter((entry) =>
				filteringOptions.filtersOut?.length
					? !filteringOptions.filtersOut.includes(entry[filteringOptions.filterKey])
					: true
			)
			.sort((a, b) => sortFunction(a, b));
	}