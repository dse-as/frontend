import { z } from 'zod';

import { doc_sequences as docSeq } from '$lib/data/doc_sequences.json';

const seqKeys = Object.keys(docSeq) as (keyof typeof docSeq)[];

export const schema = z.object({
	filter: z.string().default('foo'),
	comment: z.string().default("").optional(),
	seq: z.enum(seqKeys).optional(),
	line: z.number().default(1).optional(),
	page: z.number().default(1).optional(),
	mode: z.enum(['DF', 'LF']).optional()
});
