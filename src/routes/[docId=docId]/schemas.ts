import { z } from 'zod';
import { doc_sequences as docSeq } from '$lib/data/doc_sequences.json';

const seqTypeKeys = Object.keys(docSeq) as (keyof typeof docSeq)[];
const allDocKeys = seqTypeKeys.flatMap((typeKey) => Object.keys(docSeq[typeKey])) as string[];

export const validSeqKeys = allDocKeys;

export const SEARCH_PARAMS_DEFAULTS = {
	seq: '',
	page: 1,
	mode: 'LF' as const,
	comment: '',
	line: 1
};

export const schema = z.object({
	seq: z.string().default(SEARCH_PARAMS_DEFAULTS.seq).optional(),
	page: z.number().default(SEARCH_PARAMS_DEFAULTS.page).optional(),
	mode: z.enum(['DF', 'LF']).default(SEARCH_PARAMS_DEFAULTS.mode),
	comment: z.string().default(SEARCH_PARAMS_DEFAULTS.comment).optional(),
	line: z.coerce.number().default(SEARCH_PARAMS_DEFAULTS.line).optional()
});

type Params = z.infer<typeof schema>;
type ParamKey = keyof typeof SEARCH_PARAMS_DEFAULTS;

export function resetParams(params: Params, keys: ParamKey[] = []) {
	keys.forEach((key) => {
		// @ts-expect-error
		params[key] = SEARCH_PARAMS_DEFAULTS[key];
	});
}

export function resetParamsExcept(params: Params, excludeKeys: ParamKey[]) {
	(Object.keys(SEARCH_PARAMS_DEFAULTS) as ParamKey[]).forEach((key) => {
		if (!excludeKeys.includes(key)) {
			// @ts-expect-error
			params[key] = SEARCH_PARAMS_DEFAULTS[key];
		}
	});
}
