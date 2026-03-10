export const prerender = true;

import type { LayoutServerLoad } from '../[docId=docId]/$types';

import smf_meta from '$lib/data/smallforms_meta.json';

// Unify over smallforms, longforms, annotations
// let meta:(TSmallforms_meta | TLongforms_meta | TLetters_meta) = {
let meta = {
    ...Object.fromEntries(Object.entries(smf_meta.smallforms_meta))
};

// Export unified meta, text and annot
export const load: LayoutServerLoad = async () => {
    return { meta };
};