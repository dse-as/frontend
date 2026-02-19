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
    ...Object.fromEntries(Object.entries(smf_meta.smallforms_meta)),
    ...Object.fromEntries(Object.entries(lgf_meta.longforms_meta)),
    ...Object.fromEntries(Object.entries(let_meta.letters_meta))
};
let text = {
    ...Object.fromEntries(Object.entries(smf_text.smallforms_text)),
    ...Object.fromEntries(Object.entries(lgf_text.longforms_text)),
    ...Object.fromEntries(Object.entries(let_text.letters_text))
};
let annot = {
    ...Object.fromEntries(Object.entries(smf_annot.smallforms_annot)),
    ...Object.fromEntries(Object.entries(lgf_annot.longforms_annot)),
    ...Object.fromEntries(Object.entries(let_annot.letters_annot))
};

// Modify protoHTML
//! todo (as little modifications as possible!)

// Export unified meta, text and annot
export const load: LayoutServerLoad = async () => {
    return { meta, text, annot };
};