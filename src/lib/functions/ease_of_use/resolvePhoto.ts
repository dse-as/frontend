// ------------------------------------------------------------
// Resolver Function for Doc-Object (using simple heuristic)
// ------------------------------------------------------------

import type { TDocKeys, TDocTypes, TDocuments } from '$lib/types/documents/TDocuments';
import type { TLettersKeys } from '$lib/types/documents/TLettersKeys';
import type { TLongformsKeys } from '$lib/types/documents/TLongformsKeys';
import type { TSmallformsKeys } from '$lib/types/documents/TSmallformsKeys';
import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';

export type TResolvedPhoto = {
	docId: TPhotosKeys;
	docType: 'photos';
	item: TDocuments['documents']['photos'][TPhotosKeys] | null;
};

export function resolvePhoto(
	object: Record<TDocTypes, any> | null,
	docId: TDocKeys
): TResolvedPhoto | null {
	if (docId.includes('photo')) {
		return {
			docId: docId as TPhotosKeys,
			docType: 'photos',
			item: object?.photos[docId] || null
		};
	} else {
		return null;
	}
}