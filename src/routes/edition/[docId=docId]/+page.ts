export const prerender = false;
import type { PageLoad } from './$types';
import { doc_sequences } from '$lib/data/doc_sequences.json';

export const load: PageLoad = ({ data, params, url }) => {
	const currentSeqKey = url.searchParams.get('seq');

	function findTypeByKey(key: string | null): string | null {
		for (const type in doc_sequences) {
			if ((doc_sequences as Record<string, Record<string, unknown>>)[type][key!]) {
				return type;
			}
		}
		return null;
	}

	const currentSeqType = findTypeByKey(currentSeqKey);

	return {
		currentSeq: { type: currentSeqType, key: currentSeqKey },
		...data
	};
};
