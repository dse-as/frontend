export const prerender = false;
import type { LayoutServerLoad } from './$types';

import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { allDocs } = await parent();
	const resolvedDoc = resolveDoc(allDocs, params.docId as TDocKeys);
	return { docId: resolvedDoc?.docId, docType: resolvedDoc?.docType, docItem: resolvedDoc?.item };
};
