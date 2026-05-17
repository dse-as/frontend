export const prerender = true;

import type { LayoutServerLoad } from './$types';

import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { fullMeta } = await parent();
	const resolvedDoc = resolveDoc(fullMeta, params.docId as TDocKeys);
	console.log('params.docId', params.docId);
	console.log('resolvedDoc', resolvedDoc);
	return { docId: resolvedDoc?.docId, docType: resolvedDoc?.docType, docMeta: resolvedDoc?.item };
};