import type { LayoutServerLoad } from './$types';
import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';
import type { TPlacesKeys } from '$lib/types/register/TPlacesKeys';
import { register as reg } from '$lib/data/register.json';

export const load: LayoutServerLoad = async ({ params }) => {
	const resolvedDoc = resolveDoc(allDocs, params.docId as TDocKeys);

	// Resolve cross-register references
	let crossRef: { mainPlaces: { name: string; regType: "places", regKey: TPlacesKeys }[] | null } = { mainPlaces: null };

	if (resolvedDoc?.item) {
		if ('mainPlaces' in resolvedDoc.item.metadata && resolvedDoc.item.metadata) {
			crossRef.mainPlaces = resolvedDoc.item.metadata.mainPlaces
				? (resolvedDoc.item.metadata.mainPlaces.map((key) => {
						return { name: reg.places?.[key]?.name || '', regType: "places", regKey: key };
					}) ?? null)
				: null;
		}
	}

	return {
		docId: resolvedDoc?.docId,
		docType: resolvedDoc?.docType,
		docItem: resolvedDoc?.item,
		crossRef
	};
};
