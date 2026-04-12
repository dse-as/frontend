import type { ParamMatcher } from '@sveltejs/kit';
import { documents as fullMeta } from '$lib/data/documents.json';

let keys_all = [
	...Object.keys(fullMeta.smallforms),
	...Object.keys(fullMeta.longforms),
	...Object.keys(fullMeta.letters)
];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	return keys_all.includes(param);
}) satisfies ParamMatcher;
