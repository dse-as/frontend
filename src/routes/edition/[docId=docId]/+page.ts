export const prerender = false;
import type { PageLoad } from './$types';
import { doc_sequences } from '$lib/data/doc_sequences.json';

export const load: PageLoad = ({ data, params, url }) => {
	const currentSeqId = url.searchParams.get('seq');

	function findTypeById(id: string | null): string | null {
		for (const type in doc_sequences) {
			if ((doc_sequences as Record<string, Record<string, unknown>>)[type][id!]) {
				return type;
			}
		}
		return null;
	}

	const currentSeqType = findTypeById(currentSeqId);

	return {
		currentSeq: { type: currentSeqType, id: currentSeqId },
		...data
	};
};
