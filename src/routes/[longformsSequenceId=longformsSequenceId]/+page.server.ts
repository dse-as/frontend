import doc_sequences from '$lib/data/doc_sequences.json';
import type { PageServerLoad } from './$types';
import type { TSeqLongformsKeys } from '$lib/types/TSequences';
import type { TDocuments } from '$lib/types/documents/TDocuments';
import { documents as allDocs } from '$lib/data/documents.json';

export const load: PageServerLoad = ({ params }) => {
	const docs = allDocs.longforms as TDocuments['documents']['longforms'];
	const seqSlug = params.longformsSequenceId as TSeqLongformsKeys;
	const sequences = doc_sequences['doc_sequences'].longforms;

	// Cross-Reference
	const crossRef = {};

	return { docs, sequences, seqSlug, crossRef };
};
