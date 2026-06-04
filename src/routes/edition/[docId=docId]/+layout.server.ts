import type { LayoutServerLoad } from './$types';
import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';
import { register as reg } from '$lib/data/register.json';
import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
import { resolveReg } from '$lib/functions/ease_of_use/resolveReg';

export const load: LayoutServerLoad = async ({ params }) => {
	const resolvedDoc = resolveDoc(allDocs, params.docId as TDocKeys);

	// Resolve cross-register references
	const crossRef: {
		globalEntities: Partial<
			Record<
				TRegTypes,
				{ name: string | null; regType: TRegTypes | null; regKey: TRegKeysFlat }[] | null
			>
		>;
	} = { globalEntities: {} };

	if (resolvedDoc?.item) {
		// globalEntities
		if ('globalEntities' in resolvedDoc.item.metadata && resolvedDoc.item.metadata) {
			Object.keys(resolvedDoc.item.metadata.globalEntities).forEach((type) => {
				crossRef.globalEntities[type as TRegTypes] =
					resolvedDoc.item!.metadata.globalEntities[type as TRegTypes]?.map((key) => {
						const resolved = resolveReg(reg, key as TRegKeysFlat);
						const hasValidType = resolved?.regType;
						return {
							name: hasValidType ? resolved?.item?.name || '' : null,
							regType: hasValidType ? resolved?.regType : null,
							regKey: key
						};
					}) ?? null;
			});
		}
	}

	return {
		resolvedDoc: resolvedDoc,
		crossRef
	};
};
