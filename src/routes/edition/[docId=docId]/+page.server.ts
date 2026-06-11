import processTEI from './processTEI';
import type { ProcessedTEI } from './processTEI';
import type { PageServerLoad } from './$types';
import { asset } from '$app/paths';
import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys } from '$lib/types/documents/TDocuments';
import { register as reg } from '$lib/data/register.json';
import type { TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';
import { resolveReg } from '$lib/functions/ease_of_use/resolveReg';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// CETEI Data
	async function loadText(params: { docId: string }): Promise<ProcessedTEI> {
		const defaultBody = {
			serialized: `
	<?xml version="1.0" encoding="UTF-8"?>
		<TEI xmlns="http://www.tei-c.org/ns/1.0">
			<text>
				<body>
					<div type="body" xml:lang="en">
						<p>No content available.</p>
					</div>
				</body>
			</text>
		</TEI>`,
			elements: []
		};

		try {
			// (1) Fetch xml data
			const res = await fetch(asset(`/data/texts/text-${params.docId}.xml`));
			// Throw 404 if XML not found
			if (!res.ok) {
				if (res.status === 404) {
					console.warn('XML not found, using default data');
					return defaultBody;
				}
				throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
			}

			// (2) Extract xmlString
			const xmlString = await res.text();
			// Warn if empty/invalid XML
			if (!xmlString || !xmlString.trim()) {
				console.warn('Empty XML response, using default data');
				return defaultBody;
			}

			// (3) Apply CETEIcean's processTEI()
			try {
				const ceteiData = processTEI(xmlString);
				return ceteiData;
			} catch (parseErr) {
				console.error('TEI parse error:', parseErr);
				return defaultBody;
			}
		} catch (err) {
			// catch any other errors
			console.error('Failed to load XML:', err);
			return defaultBody;
		}
	}
	const ceteiData = await loadText(params);

	// Resolve Documents to current document
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
		if ('globalEntities' in resolvedDoc.item.metadata && resolvedDoc.item.metadata.globalEntities) {
			Object.keys(resolvedDoc.item.metadata.globalEntities).forEach((type) => {
				crossRef.globalEntities[type as TRegTypes] =
					resolvedDoc.item!.metadata.globalEntities![type as TRegTypes]?.map((key) => {
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
		ceteiData,
		resolvedDoc,
		crossRef
	};
};
