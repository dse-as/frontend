import type { ParamMatcher } from '@sveltejs/kit';
import { register as reg } from '$lib/data/register.json';

// Extract the first-order keys from the register object
const firstOrderKeys = Object.keys(reg) as Array<keyof typeof reg>;

// Extract second-order keys (sub-keys) from the register object
const secondOrderKeys = firstOrderKeys.flatMap((key) => Object.keys(reg[key]) as Array<string>);

// Combine both first-order and second-order keys
const allKeys = [...firstOrderKeys, ...secondOrderKeys];

export const match: ParamMatcher = (param: string): param is (typeof allKeys)[number] => {
	return allKeys.includes(param);
};
