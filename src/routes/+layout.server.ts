export const prerender = true;

import type { LayoutServerLoad } from './$types';
import { documents as allDocsRaw } from '$lib/data/documents.json';
import type { TDocuments } from '$lib/types/documents/TDocuments';

const allDocs = allDocsRaw as TDocuments['documents'];

export const load: LayoutServerLoad = () => {
	return { allDocs };
};
