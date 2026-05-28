import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
import { documents as allDocs } from '$lib/data/documents.json';

export const entries: EntryGenerator = () => {
	return [{ docPickerId: 'letters' }, { docPickerId: 'smallforms' }, { docPickerId: 'longforms' }];
};

export const load: PageServerLoad = () => {
	return { allDocs };
};
