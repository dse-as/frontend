import type { PageServerLoad } from './$types';

import doc_sequences from '$lib/data/doc_sequences.json';
import type { TDocuments } from '$lib/types/documents/TDocuments';
import { documents as allDocs } from '$lib/data/documents.json';

export const load: PageServerLoad = async () => {
	const photos = allDocs.photos as TDocuments['documents']['photos'];

	const photoSequences = doc_sequences['doc_sequences'].photoseries;
	const seriesKeys = {
		SLA: (Object.keys(photoSequences) as (keyof typeof photoSequences)[]).filter((key) => {
			return photoSequences[key].type === 'SLA';
		}),
		other: (Object.keys(photoSequences) as (keyof typeof photoSequences)[]).filter((key) => {
			return photoSequences[key].type !== 'SLA';
		})
	};

	return {
		photos,
		photoSequences,
		seriesKeys
	};
};
