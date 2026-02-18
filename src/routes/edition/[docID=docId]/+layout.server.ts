export const prerender = true;

import type { LayoutServerLoad } from './$types';

import smf_meta from '$lib/data/smallforms_meta.json';
import lgf_meta from '$lib/data/longforms_meta.json';
import let_meta from '$lib/data/letters_meta.json';
import smf_text from '$lib/data/smallforms_text.json';
import lgf_text from '$lib/data/longforms_text.json';
import let_text from '$lib/data/letters_text.json';
import smf_annot from '$lib/data/smallforms_annot.json';
import lgf_annot from '$lib/data/longforms_annot.json';
import let_annot from '$lib/data/letters_annot.json';

// Unify over smallforms, longforms, annotations
let meta = {
    ...Object.fromEntries(Object.values(smf_meta.smallforms_meta).map(entry => [entry.slug, entry])),
    ...Object.fromEntries(Object.values(lgf_meta.longforms_meta).map(entry => [entry.slug, entry])),
    ...Object.fromEntries(Object.values(let_meta.letters_meta).map(entry => [entry.slug, entry])),
};
// let text = {
//     ...Object.fromEntries(Object.values(smf_text.smallforms_text).map(entry => [entry.slug, entry])),
//     ...Object.fromEntries(Object.values(lgf_text.longforms_text).map(entry => [entry.slug, entry])),
//     ...Object.fromEntries(Object.values(let_text.letters_text).map(entry => [entry.slug, entry])),
// };
// let annot = {
//     ...Object.fromEntries(Object.values(smf_annot.smallforms_annot).map(entry => [entry.slug, entry])),
//     ...Object.fromEntries(Object.values(lgf_annot.longforms_annot).map(entry => [entry.slug, entry])),
//     ...Object.fromEntries(Object.values(let_annot.letters_annot).map(entry => [entry.slug, entry])),
// };

// Modify protoHTML
//! todo (as little modifications as possible!)

// Export unified meta, text and annot
export const load: LayoutServerLoad = async () => {
    return { meta };
    // return { meta, text, annot };
};