export const prerender = true;

import type { LayoutServerLoad } from './$types';

import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { fullMeta } = await parent();
	const docId = params.docId as TDocKeys;
	const docType = findEdTypeByDocId(docId) as TDocTypes;
	const docMeta = fullMeta[docType]?.[docId];
	return { docId, docType, docMeta };
};
