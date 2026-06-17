import type { ParamMatcher } from '@sveltejs/kit';

// const keys_all = [
//     ...Object.keys(docs.images)
// ];
//! FIX THIS
const keys_all = [];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	const result = keys_all.includes(param);
	return result;
}) satisfies ParamMatcher;
