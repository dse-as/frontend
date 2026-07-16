import doc_sequences from '$lib/data/doc_sequences.json';
import type { PageServerLoad } from './$types';
import type { TSeqCorrespondenceKeys } from '$lib/types/TSequences';
import type { TDocuments } from '$lib/types/documents/TDocuments';
import { documents as allDocs } from '$lib/data/documents.json';
import { register as reg } from '$lib/data/register.json';
import type { TPeopleKeys } from '$lib/types/register/TPeopleKeys';

export const load: PageServerLoad = ({ params }) => {
	const letters = allDocs.letters as TDocuments['documents']['letters'];
	const corrSlug = params.correspondenceId as TSeqCorrespondenceKeys;
	const corrSequences = doc_sequences['doc_sequences'].correspondence;

	// Cross-Reference
	let crossRef = {
		person:
			'personId' in corrSequences[corrSlug]
				? reg.people[corrSequences[corrSlug].personId as TPeopleKeys]
				: undefined
	};

	return { letters, corrSequences, corrSlug, crossRef };
};
