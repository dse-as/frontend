import {
	type TDocKeys,
	type TDocKeysMap,
	type TDocTypes,
	type TDocuments
} from '$lib/types/documents/TDocuments';
import type { TLettersKeys } from '$lib/types/documents/TLettersKeys';
import type { TLongformsKeys } from '$lib/types/documents/TLongformsKeys';
import type { TSmallformsKeys } from '$lib/types/documents/TSmallformsKeys';

export function findEdTypeByDocId<K extends TDocKeys>(
	docId: K
):
	| {
			[P in TDocTypes]: K extends TDocKeysMap[P] ? P : never;
	  }[TDocTypes]
	| null {
	if (docId.includes('smallform')) return 'smallforms' as any;
	else if (docId.includes('longform')) return 'longforms' as any;
	else if (docId.includes('letter')) return 'letters' as any;
	else return null;
}

type TResolvedDoc =
	| {
			type: 'letters';
			docId: TLettersKeys;
	  }
	| {
			type: 'smallforms';
			docId: TSmallformsKeys;
	  }
	| {
			type: 'longforms';
			docId: TLongformsKeys;
	  };

function isLetterKey(docId: TDocKeys): docId is TLettersKeys {
	return docId.includes('letter');
}

function isSmallformKey(docId: TDocKeys): docId is TSmallformsKeys {
	return docId.includes('smallform');
}

function isLongformKey(docId: TDocKeys): docId is TLongformsKeys {
	return docId.includes('longform');
}

export function resolveDoc(docId: TDocKeys): TResolvedDoc | null {
	if (isSmallformKey(docId)) {
		return {
			type: 'smallforms',
			docId
		};
	}

	if (isLongformKey(docId)) {
		return {
			type: 'longforms',
			docId
		};
	}

	if (isLetterKey(docId)) {
		return {
			type: 'letters',
			docId
		};
	}

	return null;
}
