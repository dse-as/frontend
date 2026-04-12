export const prerender = true;

import type { LayoutServerLoad } from './$types';

import {documents as fullMeta} from '$lib/data/documents.json';

export const load: LayoutServerLoad = () => {
	return { fullMeta };
};
