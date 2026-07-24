import type { ParamMatcher } from '@sveltejs/kit';
import doc_sequences from '$lib/data/doc_sequences.json';

const seriesKeys = Object.keys(doc_sequences['doc_sequences'].longforms);

export const match = ((param: string): param is (typeof seriesKeys)[number] => {
	return seriesKeys.includes(param);
}) satisfies ParamMatcher;
