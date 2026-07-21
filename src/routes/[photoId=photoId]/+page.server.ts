import type { EntryGenerator } from './$types';
import type { PageServerLoad } from './$types';
import { documents as allDocs } from '$lib/data/documents.json';
import { register as reg } from '$lib/data/register.json';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments.js';
import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
import type { TPhotosKeys } from '$lib/types/documents/TPhotosKeys';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import { resolvePhoto } from '$lib/functions/ease_of_use/resolvePhoto';
import { resolveReg } from '$lib/functions/ease_of_use/resolveReg';
import { photos_keys } from '$lib/data/photos_keys.json';
import type { TCrossRefEntitiesExtended } from '$lib/types/documents/TDocuments.js';
import type { TCrossRefDocumentsExtended } from '$lib/types/documents/TDocuments.js';

export const entries: EntryGenerator = () => {
	return photos_keys.map((key) => {
		return { photoId: key };
	});
};

export const load: PageServerLoad = async ({ params }) => {
	// Resolve Documents to current photo
	const resolvedPhoto = resolvePhoto(allDocs, params.photoId as TPhotosKeys);

	// Resolve cross-register references
	// Resolve cross-register references
	const crossRef: {
		linkedEntities?: TCrossRefEntitiesExtended;
		linkedDocuments?: TCrossRefDocumentsExtended;
	} = {};

	if (resolvedPhoto?.item) {
		// linkedEntities
		if (resolvedPhoto.item.crossReferences?.linkedEntities) {
			crossRef.linkedEntities = {};
			Object.keys(resolvedPhoto.item.crossReferences.linkedEntities).forEach((type) => {
				crossRef.linkedEntities![type as TRegTypes] =
					resolvedPhoto.item!.crossReferences?.linkedEntities?.[type as TRegTypes]?.map((key) => {
						const resolvedReg = resolveReg(reg, key as TRegKeysFlat);
						const hasValidType = resolvedReg?.regType;
						return {
							item: hasValidType ? resolvedReg?.item : null,
							regType: hasValidType ? resolvedReg?.regType : null,
							regKey: key
						};
					}) ?? null;
			});
		}
		// linkedDocuments
		if (resolvedPhoto.item.crossReferences?.linkedDocuments) {
			Object.keys(resolvedPhoto.item.crossReferences.linkedDocuments).forEach((type) => {
				crossRef.linkedDocuments![type as TDocTypes] =
					resolvedPhoto.item!.crossReferences?.linkedDocuments?.[type as TDocTypes]?.map((key) => {
						const resolvedDoc = resolveDoc(allDocs, key as TDocKeys);
						const hasValidType = resolvedDoc?.docType;
						return {
							item: hasValidType ? resolvedDoc?.item : null,
							docType: hasValidType ? resolvedDoc?.docType : null,
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
