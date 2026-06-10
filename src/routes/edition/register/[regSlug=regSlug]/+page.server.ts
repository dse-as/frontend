import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
import { register as reg } from '$lib/data/register.json';
import { documents as allDocsRaw } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocuments } from '$lib/types/documents/TDocuments';
import type { TRegister, TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
import type { TEventsKeys } from '$lib/types/register/TEventsKeys';
import { resolveReg } from '$lib/functions/ease_of_use/resolveReg';
import type { TPeopleKeys } from '$lib/types/register/TPeopleKeys';
import type { TPlacesKeys } from '$lib/types/register/TPlacesKeys';
import type { TOrgsKeys } from '$lib/types/register/TOrgsKeys';
import type { TBiblsKeys } from '$lib/types/register/TBiblsKeys';
import type { TKeywordsKeys } from '$lib/types/register/TKeywordsKeys';

const allDocs = allDocsRaw as TDocuments['documents'];

export const entries: EntryGenerator = () => {
	// Extract first-order keys
	const firstOrderKeyObjects = Object.keys(reg).map((firstKey) => {
		return { regSlug: firstKey };
	});

	// Extract second-order keys
	const secondOrderKeyObjects = Object.keys(reg).flatMap((firstKey) => {
		return Object.keys(reg[firstKey as keyof typeof reg] || {}).map((secondKey) => {
			return { regSlug: secondKey };
		});
	});

	// Combine both first-order and second-order keys
	return [...firstOrderKeyObjects, ...secondOrderKeyObjects];
};

// Strip register entries to only the fields needed.
function buildListEntries(regType: TRegTypes): TRegister['register'][TRegTypes] | object {
	const full = reg[regType];
	if (!full) return {};

	type TPartialRegEntry = {
		name?: string;
		lastname?: string;
		type?: string;
		date?: TRegister['register']['events'][TEventsKeys]['date'];
	};
	const stripped: Partial<Record<TRegKeysFlat, TPartialRegEntry>> = {};

	for (const [key, entry] of Object.entries(full)) {
		stripped[key as TRegKeysFlat] = {
			...(entry.name !== undefined && { name: entry.name }),
			...(entry.lastname !== undefined && { lastname: entry.lastname }),
			...(entry.type !== undefined && { type: entry.type }),
			...(entry.date !== undefined && { date: entry.date })
		};
	}
	return stripped;
}

// Resolve linked document IDs to minimal display data.
function resolveLinkedDocs(
	docIds: TDocKeys[] | undefined
): { docId: string; iiif_url: string | null; title_full: string | null; pubDate: string | null }[] {
	if (!docIds?.length) return [];
	return docIds.map((docId) => {
		const resolved = resolveDoc(allDocs, docId);
		return {
			docId: docId as string,
			iiif_url: resolved?.item?.manuscript?.iiif_urls?.[0] ?? null,
			title_full: resolved?.item?.metadata?.title_full ?? null,
			pubDate: resolved?.item?.metadata?.pubDate ?? null
		};
	});
}

export const load: PageServerLoad = async ({ parent }) => {
	const { regType, regSlug } = await parent();

	// Stripped entries for List.svelte sidebar/multi-column view
	const regTypeEntries = regType ? buildListEntries(regType) : {};

	// Full attributes for the single item being viewed
	const regTypeIndex = [
		//! FIX: should be generalised
		...(Object.keys(reg.people) as TPeopleKeys[]),
		...(Object.keys(reg.places) as TPlacesKeys[]),
		...(Object.keys(reg.events) as TEventsKeys[]),
		...(Object.keys(reg.orgs) as TOrgsKeys[]),
		...(Object.keys(reg.bibls) as TBiblsKeys[]),
		...(Object.keys(reg.keywords) as TKeywordsKeys[])
	];
	const regAttributes =
		regType && regSlug && regTypeIndex.includes(regSlug as any)
			? resolveReg(reg, regSlug as TRegKeysFlat)?.item
			: undefined;

	// Resolve cross-register references
	let orgNames: string[] | null = null;
	let authorNames: string[] | null = null;
	let linkedDocs: ReturnType<typeof resolveLinkedDocs> = [];

	if (regAttributes) {
		if ('orgIds' in regAttributes && regAttributes.orgIds) {
			orgNames =
				regAttributes.orgIds.map((id) => {
					return reg.orgs?.[id]?.name || '';
				}) ?? null;
		}
		if ('authorIds' in regAttributes && regAttributes.authorIds) {
			authorNames =
				(regAttributes.authorIds as TPeopleKeys[]).map((id) => {
					return reg.people?.[id]?.name || '';
				}) ?? null;
		}
		linkedDocs = resolveLinkedDocs(regAttributes.docs);
	}

	return { regTypeEntries, regAttributes, orgNames, authorNames, linkedDocs };
};
