export const prerender = true;

import type { LayoutServerLoad } from './$types';

import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	let {fullMeta} = await parent()
	let docId = params.docId as TDocKeys;
	let docType = findEdTypeByDocId(docId) as TDocTypes;
	let docMeta = fullMeta[docType]?.[docId];
	return { docId, docType, docMeta };
};
