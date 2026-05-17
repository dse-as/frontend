import type { ParamMatcher } from '@sveltejs/kit';
import { documents as allDocs } from '$lib/data/documents.json';

const keys_all = [
	...Object.keys(allDocs.smallforms),
	...Object.keys(allDocs.longforms),
	...Object.keys(allDocs.letters)
];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	return keys_all.includes(param);
}) satisfies ParamMatcher;
