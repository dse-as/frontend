import type { ParamMatcher } from '@sveltejs/kit';
import imgSeries from '$lib/data/img_series.json';

let seriesKeys = Object.keys(imgSeries['imgSeries']);
console.log(seriesKeys);

export const match = ((param: string): param is typeof seriesKeys[number] => {
	return seriesKeys.includes(param);
}) satisfies ParamMatcher;