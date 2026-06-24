// ------------------------------------------------------------
// Resolver Function for Doc-Object (using simple heuristic)
// ------------------------------------------------------------

import type { TDocKeys, TDocTypes, TDocuments } from '$lib/types/documents/TDocuments';
import type { TLettersKeys } from '$lib/types/documents/TLettersKeys';
import type { TLongformsKeys } from '$lib/types/documents/TLongformsKeys';
import type { TSmallformsKeys } from '$lib/types/documents/TSmallformsKeys';
import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';

export type TResolvedDoc =
	| {
			docId: TLettersKeys;
			docType: 'letters';
			item: TDocuments['documents']['letters'][TLettersKeys] | null;
	  }
	| {
			docId: TSmallformsKeys;
			docType: 'smallforms';
			item: TDocuments['documents']['smallforms'][TSmallformsKeys] | null;
	  }
	| {
			docId: TLongformsKeys;
			docType: 'longforms';
			item: TDocuments['documents']['longforms'][TLongformsKeys] | null;
	  }
	| {
			docId: TPhotosKeys;
			docType: 'photos';
			item: TDocuments['documents']['photos'][TPhotosKeys] | null;
	  };

export function resolveDoc(
	object: Record<TDocTypes, any> | null,
	docId: TDocKeys
): TResolvedDoc | null {
	if (docId.includes('letter')) {
		return {
			docId: docId as TLettersKeys,
			docType: 'letters',
			item: object?.letters[docId] || null
		};
	} else if (docId.includes('smallform')) {
		return {
			docId: docId as TSmallformsKeys,
			docType: 'smallforms',
			item: object?.smallforms[docId] || null
		};
	} else if (docId.includes('longform')) {
		return {
			docId: docId as TLongformsKeys,
			docType: 'longforms',
			item: object?.longforms[docId] || null
		};
	} else if (docId.includes('photo')) {
		return {
			docId: docId as TPhotosKeys,
			docType: 'photos',
			item: object?.photos[docId] || null
		};
	} else {
		return null;
	}
}

// ------------------------------------------------------------
// Resolver Function for Doc-Object (using run-time indexing)
// ------------------------------------------------------------

// import { documents as docs } from '$lib/data/documents.json';

// const docTypeIndex = Object.fromEntries([
// 	...Object.keys(docs.letters).map((k) => [k, 'letters']),
// 	...Object.keys(docs.smallforms).map((k) => [k, 'smallforms']),
// 	...Object.keys(docs.longforms).map((k) => [k, 'longforms'])
// 	...Object.keys(docs.photos).map((k) => [k, 'photos'])
// ]);

// export function resolveDocIndexed<K extends TDocKeys>(
// 	object: Record<TDocTypes, any> | null,
// 	docId: K
// ): TResolvedDoc | null {
// 	const type = docTypeIndex[docId];

// 	if (!docTypeIndex[docId]) return null;
// 	switch (type) {
// 		case 'letters':
// 			return {
// 				docId: docId as TLettersKeys,
// 				docType: 'letters',
// 				item: object?.letters[docId as TLettersKeys] || null
// 			};
// 		case 'smallforms':
// 			return {
// 				docId: docId as TSmallformsKeys,
// 				docType: 'smallforms',
// 				item: object?.smallforms[docId as TSmallformsKeys] || null
// 			};
// 		case 'longforms':
// 			return {
// 				docId: docId as TLongformsKeys,
// 				docType: 'longforms',
// 				item: object?.longforms[docId as TLongformsKeys] || null
// 			};
// 		case 'photos':
// 			return {
// 				docId: docId as TPhotosKeys,
// 				docType: 'photos',
// 				item: object?.photos[docId as TPhotosKeys] || null
// 			};
// 		default:
// 			return null;
// 	}
// }
