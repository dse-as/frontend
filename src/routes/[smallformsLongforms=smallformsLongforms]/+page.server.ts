import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';

import { documents as allDocs } from '$lib/data/documents.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const entries: EntryGenerator = () => {
	return [{ smallformsLongforms: 'smallforms' }, { smallformsLongforms: 'longforms' }];
};

export const load: PageServerLoad = ({ params }) => {
	const docType = params.smallformsLongforms as TDocTypes;
	return { docType };
};
