export const prerender = false;
import type { LayoutLoad } from './$types';

import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';

export const load: LayoutLoad = async ({ params }) => {
	const resolvedDoc = resolveDoc(allDocs, params.docId as TDocKeys);
	return {
		allDocs,
		docId: resolvedDoc?.docId,
		docType: resolvedDoc?.docType,
		docItem: resolvedDoc?.item
	};
};
