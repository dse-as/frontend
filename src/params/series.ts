import type { ParamMatcher } from '@sveltejs/kit';
import img_series from '$lib/data/img_series.json';

let seriesKeys = Object.keys(img_series['img_series']);
console.log(seriesKeys);

export const match = ((param: string): param is typeof seriesKeys[number] => {
	return seriesKeys.includes(param);
}) satisfies ParamMatcher;