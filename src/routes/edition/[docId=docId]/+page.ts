export const prerender = false;
import type { PageLoad } from './$types';
import { doc_sequences } from '$lib/data/doc_sequences.json';

export const load: PageLoad = ({params, url}) => {
    const currentSeqId = url.searchParams.get('seq');
    
    const foo = params.docId; // force rerun on change of docId
	
	function findTypeById(id) {
        for (const type in doc_sequences) {
			if (doc_sequences[type][id]) {
				return type;
			}
		}
		return null;
	}

	const currentSeqType = findTypeById(currentSeqId);

	return {
		currentSeq: { type: currentSeqType, id: currentSeqId },
        
	};
};
