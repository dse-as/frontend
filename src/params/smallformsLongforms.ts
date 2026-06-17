import type { ParamMatcher } from '@sveltejs/kit';

const docTypeIds = ['smallforms', 'longforms'];

export const match = ((param: string) => {
	return docTypeIds.includes(param);
}) satisfies ParamMatcher;
