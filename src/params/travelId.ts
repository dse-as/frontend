import type { ParamMatcher } from '@sveltejs/kit';
import { register as reg } from '$lib/data/register.json';
import type { TEventsKeys } from '$lib/types/register/TEventsKeys';

const keys_all = [
	...Object.keys(reg.events).filter((key) => {
		return reg.events[key as TEventsKeys].type === 'travel';
	})
];

export const match = ((param: string): param is (typeof keys_all)[number] => {
	const result = keys_all.includes(param);
	return result;
}) satisfies ParamMatcher;
