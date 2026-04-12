import type { LayoutLoad } from './$types';
import { doc_sequences as seqAll } from '$lib/data/doc_sequences.json';

export const load: LayoutLoad = () => {  
    return {seqAll: seqAll};
};
