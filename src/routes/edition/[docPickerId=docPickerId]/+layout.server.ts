import type { LayoutServerLoad } from './$types';

import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ params }) => {
	const resolvedDoc = resolveDoc(allDocs, params.docPickerId as TDocKeys);

	// Resolve cross-register references
	let crossRef: {
		linkedDocs: Partial<
			Record<
				TDocTypes,
				{ name: string | null; docType: TDocTypes | null; docKey: TDocKeys }[] | null
			>
		>;
	} = { linkedDocs: {} };

	if (resolvedDoc?.item) {
		// linkedDocs
		if (
			('smallforms' in resolvedDoc.item.metadata.globalEntities &&
				resolvedDoc.item?.metadata.globalEntities.smallforms) ||
			('longforms' in resolvedDoc.item.metadata.globalEntities &&
				resolvedDoc.item?.metadata.globalEntities.longforms) ||
			('letters' in resolvedDoc.item.metadata.globalEntities &&
				resolvedDoc.item?.metadata.globalEntities.letters)
		) {
			Object.keys([
				...resolvedDoc.item?.metadata.globalEntities.smallforms || [],
				...resolvedDoc.item?.metadata.globalEntities.longforms || [],
				...resolvedDoc.item?.metadata.globalEntities.letters || []
			]).forEach((type) => {
				crossRef.linkedDocs[type as TDocTypes] =
					resolvedDoc.item?.metadata.globalEntities[type as TDocTypes]?.map((key) => {
						const resolved = resolveDoc(allDocs, key as TDocKeys);
						const hasValidType = resolved?.docType;
						return {
							name: hasValidType ? resolved?.item?.name || '' : null,
							docType: hasValidType ? resolved?.docType : null,
							docKey: key
						};
					}) ?? null;
			});
		}
	}

	return { crossRef, resDoc: resolvedDoc };
};
