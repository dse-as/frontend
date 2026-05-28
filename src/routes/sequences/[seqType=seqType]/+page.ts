import type { PageLoad } from './$types';
import { documents as allDocsRaw } from '$lib/data/documents.json';
import type { TDocuments } from '$lib/types/documents/TDocuments';

const allDocs = allDocsRaw as TDocuments['documents'];

export const load: PageLoad = () => {
	return { allDocs };
};
