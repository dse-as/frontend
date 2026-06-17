import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';

import type { TDocTypes } from '$lib/types/documents/TDocuments';

export const entries: EntryGenerator = () => {
	return [{ smallformsLongforms: 'smallforms' }, { smallformsLongforms: 'longforms' }];
};

export const load: PageServerLoad = ({ params }) => {
	const docType = params.smallformsLongforms as TDocTypes;
	return { docType };
};
