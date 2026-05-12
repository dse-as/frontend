export const prerender = true;

import type { LayoutServerLoad } from './$types';

import { documents as fullMetaRaw} from '$lib/data/documents.json';
const fullMeta = fullMetaRaw as typeof fullMetaRaw;

export const load: LayoutServerLoad = () => {
	return { fullMeta };
};
