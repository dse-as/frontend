import type { ParamMatcher } from '@sveltejs/kit';
import photo_series from '$lib/data/photo_series.json';

const seriesKeys = Object.keys(photo_series['photo_series']);

export const match = ((param: string): param is (typeof seriesKeys)[number] => {
	return seriesKeys.includes(param);
}) satisfies ParamMatcher;
