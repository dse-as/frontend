// ------------------------------------------------------------
// Resolver Function for Doc-Object (using simple heuristic)
// ------------------------------------------------------------

import type { TDocKeys, TDocTypes, TDocuments } from '$lib/types/documents/TDocuments';
import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';
import type { TResolvedPhotos } from './resolveDoc';

export function resolvePhoto(
	object: Record<TDocTypes, any> | null,
	docId: TDocKeys
): TResolvedPhotos | null {
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
