import type { ParamMatcher } from '@sveltejs/kit';
import { documents as fullMeta } from '$lib/data/documents.json';

const keys_all = [
	...Object.keys(fullMeta.smallforms),
	...Object.keys(fullMeta.longforms),
	...Object.keys(fullMeta.letters)
];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	console.log('Matching docId param:', param);
	const result = keys_all.includes(param);
	console.log('Match result:', result);
	return result;
}) satisfies ParamMatcher;
