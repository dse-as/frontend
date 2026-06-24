import type { PageServerLoad } from './$types';
import { documents as allDocs } from '$lib/data/documents.json';
import { register as reg } from '$lib/data/register.json';
import type { TDocKeysFlat, TDocTypes } from '$lib/types/documents/TDocuments.js';
import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import { resolvePhoto } from '$lib/functions/ease_of_use/resolvePhoto';
import { resolveReg } from '$lib/functions/ease_of_use/resolveReg';

export const load: PageServerLoad = async ({ params }) => {
	
	// Resolve Documents to current photo
	const resolvedPhoto = resolvePhoto(allDocs, params.photoId as TPhotosKeys);
	
	// Resolve cross-register references
	const crossRef: {
		linkedReg: Partial<
			Record<
				TRegTypes,
				{ name: string | null; regType: TRegTypes | null; regKey: TRegKeysFlat }[] | null
			>
		>;
		linkedDocs: Partial<
			Record<
				TDocTypes,
				{ name: string | null; docType: TDocTypes | null; docKey: TDocKeysFlat }[] | null
			>
		>;
	} = { linkedReg: {}, linkedDocs: {} };

	if (resolvedPhoto?.item) {
		// linkedReg
		if ('linkedReg' in resolvedPhoto.item && resolvedPhoto.item.linkedReg) {
			Object.keys(resolvedPhoto.item.linkedReg).forEach((type) => {
				crossRef.linkedReg[type as TRegTypes] =
					resolvedPhoto.item!.linkedReg![type as TRegTypes]?.map((key) => {
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
		// linkedDocs
		if ('linkedDocs' in resolvedPhoto.item && resolvedPhoto.item.linkedDocs) {
			Object.keys(resolvedPhoto.item.linkedDocs).forEach((type) => {
				crossRef.linkedDocs[type as TDocTypes] =
					resolvedPhoto.item!.linkedDocs![type as TDocTypes]?.map((key) => {
						const resolved = resolveDoc(allDocs, key as TDocKeysFlat);
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

	return {
		resolvedPhoto,
		crossRef
	};
};
