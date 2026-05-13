import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
import { register as reg } from '$lib/data/register.json';
export const prerender = true;

export const entries: EntryGenerator = () => {
	// Extract first-order keys
	const firstOrderKeyObjects = Object.keys(reg).map((firstKey) => {
		return { regSlug: firstKey };
	});

	// Extract second-order keys
	const secondOrderKeyObjects = Object.keys(reg).flatMap((firstKey) => {
		return Object.keys(reg[firstKey as keyof typeof reg] || {}).map((secondKey) => {
			return { regSlug: secondKey };
		});
	});

	// Combine both first-order and second-order keys
	return [...firstOrderKeyObjects, ...secondOrderKeyObjects];
};

export const load: PageServerLoad = async ({ parent }) => {
	const { regType, regSlug } = await parent();

	const regAttributes =
		regType && regSlug
			? (reg as Record<string, Record<string, any>>)?.[regType]?.[regSlug]
			: undefined;
	return { regAttributes };
};
