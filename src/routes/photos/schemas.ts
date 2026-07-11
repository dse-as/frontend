import { z } from "zod";

import doc_sequences from '$lib/data/doc_sequences.json';

const photoSequences = doc_sequences['doc_sequences'].photoseries;
const seriesKeys = Object.keys(photoSequences);

export const productSearchSchema = z.object({
    series: z.enum(seriesKeys).default("")
});