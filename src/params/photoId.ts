import type { ParamMatcher } from '@sveltejs/kit';
import { photos_keys } from '$lib/data/photos_keys.json';

const keys_all = [...photos_keys];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	const result = keys_all.includes(param);
	return result;
}) satisfies ParamMatcher;
