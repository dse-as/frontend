import type { ParamMatcher } from '@sveltejs/kit';

import smallforms_meta from '$lib/data/smallforms_meta.json';
import longforms_meta from '$lib/data/longforms_meta.json';
import letters_meta from '$lib/data/letters_meta.json';

let keys_smallforms = Object.keys(smallforms_meta.smallforms_meta);
let keys_longforms = Object.keys(longforms_meta.longforms_meta);
let keys_letters = Object.keys(letters_meta.letters_meta);

let keys_all = [...keys_smallforms, ...keys_longforms, ...keys_letters];

export const match = ((param: string): param is typeof keys_all[number] => {
	return keys_all.includes(param);
}) satisfies ParamMatcher;