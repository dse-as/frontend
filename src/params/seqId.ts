import type { ParamMatcher } from '@sveltejs/kit';

const seqIds = ['series', 'textstufen', 'travels'];

export const match = ((param: string) => {
	return seqIds.includes(param);
}) satisfies ParamMatcher;
