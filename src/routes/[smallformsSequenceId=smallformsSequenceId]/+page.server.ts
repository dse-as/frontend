import doc_sequences from '$lib/data/doc_sequences.json';
import type { PageServerLoad } from './$types';
import type { TSeqSmallformsKeys } from '$lib/types/TSequences';
import type { TDocuments } from '$lib/types/documents/TDocuments';
import { documents as allDocs } from '$lib/data/documents.json';

export const load: PageServerLoad = ({ params }) => {
	const docs = allDocs.smallforms as TDocuments['documents']['smallforms'];
	const seqSlug = params.smallformsSequenceId as TSeqSmallformsKeys;
	const sequences = doc_sequences['doc_sequences'].smallforms;

	// Cross-Reference
	const crossRef = {};

	return { docs, sequences, seqSlug, crossRef };
};
