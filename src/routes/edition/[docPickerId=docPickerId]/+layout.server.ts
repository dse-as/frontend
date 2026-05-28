import type { LayoutServerLoad } from './$types';

import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ params }) => {
	const resolvedDoc = resolveDoc(allDocs, params.docPickerId as TDocKeys);
	return { docId: resolvedDoc?.docId, docType: resolvedDoc?.docType, docItem: resolvedDoc?.item };
};
