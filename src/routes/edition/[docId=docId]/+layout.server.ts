export const prerender = true;

import type { LayoutServerLoad } from './$types';

import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { fullMeta } = await parent();
	const rawDocId = params.docId as TDocKeys;
	const docType = findEdTypeByDocId(rawDocId) as TDocTypes;
	const docId = rawDocId as keyof (typeof fullMeta)[typeof docType];
	const docMeta = fullMeta[docType]?.[docId];
	return { docId, docType, docMeta };
};

// ---------------------------------
// Below is an alternative attempt to get the typing of `fullMeta[docType]?.[docId]` right.
// It returns without errors, however, the type of docMeta is `const docMeta: null`
// ---------------------------------

// export const load: LayoutServerLoad = async ({ parent, params }) => {
// 	const { fullMeta } = await parent();

// 	function getDocMeta<T extends TDocTypes>(type: T, id: TDocKeys): (typeof fullMeta)[T][keyof (typeof fullMeta)[T]] | null {
// 		const category = fullMeta[type];
// 		if (!category) return null;
// 		if (!(id in category)) return null;
// 		return category[id as keyof typeof category] as (typeof fullMeta)[T][keyof (typeof fullMeta)[T]];
// 	}

// 	const docId = params.docId as TDocKeys;
// 	const docType = findEdTypeByDocId(docId) as TDocTypes;

// 	if (!docType) {
// 		return { error: 'Invalid document type' };
// 	}

// 	const docMeta = getDocMeta(docType, docId);

// 	return { docId, docType, docMeta };
// };
