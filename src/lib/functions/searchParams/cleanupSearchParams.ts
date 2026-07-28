export function cleanupSearchParams(url, schema, validSeqKeys) {

    	const knownKeys = new Set(Object.keys(schema.shape));

		let needsUpdate = false;
		const newUrl = new URL(url);

		for (const key of [...url.searchParams.keys()]) {
			// Remove keys not in the schema at all
			if (!knownKeys.has(key)) {
				newUrl.searchParams.delete(key);
				needsUpdate = true;
				continue;
			}

			// Remove invalid seq values
			if (key === 'seq') {
				const value = url.searchParams.get(key);
				if (value && !validSeqKeys.includes(value)) {
					newUrl.searchParams.delete(key);
					needsUpdate = true;
				}
			}
		}

		if (needsUpdate) {
			history.replaceState({}, '', newUrl);
		}
	}