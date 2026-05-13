import { type TDocKeys, type TDocTypes } from '$lib/types/documents/TDocuments';

export function findEdTypeByDocId(docId: TDocKeys): TDocTypes | null {
	if (docId.includes('smallform')) return 'smallforms';
	else if (docId.includes('longform')) return 'longforms';
	else if (docId.includes('letter')) return 'letters';
	else return null;
}
