import type { ParamMatcher } from '@sveltejs/kit';
import { smallforms_keys } from '$lib/data/smallforms_keys.json';
import { longforms_keys } from '$lib/data/longforms_keys.json';
import { letters_keys } from '$lib/data/letters_keys.json';

const keys_all = [...letters_keys, ...smallforms_keys, ...longforms_keys];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	const result = keys_all.includes(param);
	return result;
}) satisfies ParamMatcher;
