import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
import { register as reg } from '$lib/data/register.json';
import { findKeyBySlug } from '$lib/functions/ease_of_use/findKeyBySlug.js';
export const prerender = true;

export const entries: EntryGenerator = () => {
    // Extracting first-order keys
    const firstOrderKeyObjects = Object.keys(reg).map((firstKey) => {
        return { regSlug: firstKey };
    });

    // Extracting second-order keys
    const secondOrderKeyObjects = Object.keys(reg).flatMap((firstKey) => {
        return Object.keys(reg[firstKey]).map((secondKey) => {
            return { regSlug: secondKey };
        });
    });

    // Combine both first-order and second-order keys
    return [...firstOrderKeyObjects, ...secondOrderKeyObjects];
};

export const load: PageServerLoad = ({ params, url }) => {
	const regSlug: string = params.regSlug;
	const regType: string | null = findKeyBySlug(reg, regSlug);

	const keysOfCurrentRegSlug = Object.keys(reg) as Array<keyof typeof reg>;
    const regAttributes = reg?.[regType]?.[regSlug]
	return { regAttributes };
};
