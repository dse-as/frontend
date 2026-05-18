import type { ParamMatcher } from '@sveltejs/kit';

const seqTypes = ['series', 'textstufen', 'travels'];
// const seqTypes = ['series', 'textstufen', 'travels', 'corresondence'];

export const match = ((param: string) => {
	return seqTypes.includes(param);
}) satisfies ParamMatcher;
