import type { ParamMatcher } from '@sveltejs/kit';
import { register as reg } from '$lib/data/register.json';

const keys_all = [...Object.keys(reg.places)];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	const result = keys_all.includes(param);
	return result;
}) satisfies ParamMatcher;
