import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
import { register as reg } from '$lib/data/register.json';
import { documents as allDocsRaw } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocuments } from '$lib/types/documents/TDocuments';

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

/** Strip register entries to only the fields List.svelte needs for display/sort/group. */
function buildListEntries(regType: string): Record<string, Record<string, any>> {
	const full = (reg as Record<string, Record<string, Record<string, any>>>)[regType];
	if (!full) return {};
	const stripped: Record<string, Record<string, any>> = {};
	for (const [key, entry] of Object.entries(full)) {
		stripped[key] = {
			name: entry.name,
			...(entry.lastname !== undefined && { lastname: entry.lastname }),
			...(entry.type !== undefined && { type: entry.type }),
			...(entry.date !== undefined && { date: entry.date })
		};
	}
	return stripped;
}

/** Resolve linked document IDs to minimal display data. */
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
	const regAttributes =
		regType && regSlug
			? (reg as Record<string, Record<string, any>>)?.[regType]?.[regSlug]
			: undefined;

	// Resolve cross-references server-side so we don't ship the full register/documents to the client
	let orgName: string | null = null;
	let authorName: string | null = null;
	let linkedDocs: ReturnType<typeof resolveLinkedDocs> = [];

	if (regAttributes) {
		if (regAttributes.orgId) {
			orgName =
				(reg as Record<string, Record<string, any>>).orgs?.[regAttributes.orgId]?.name ?? null;
		}
		if (regAttributes.authorId) {
			authorName =
				(reg as Record<string, Record<string, any>>).people?.[regAttributes.authorId]?.name ?? null;
		}
		linkedDocs = resolveLinkedDocs(regAttributes.docs);
	}

	return { regTypeEntries, regAttributes, orgName, authorName, linkedDocs };
};
