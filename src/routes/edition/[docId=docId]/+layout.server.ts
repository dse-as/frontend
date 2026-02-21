export const prerender = true;

import { type TSmallforms_meta } from '$lib/types/documents/TSmallforms_meta';
import { type TLongforms_meta } from '$lib/types/documents/TLongforms_meta';
import { type TLetters_meta } from '$lib/types/documents/TLetters_meta';

import type { LayoutServerLoad } from './$types';

import smf_meta from '$lib/data/smallforms_meta.json';
import lgf_meta from '$lib/data/longforms_meta.json';
import let_meta from '$lib/data/letters_meta.json';
import smf_annot from '$lib/data/smallforms_annot.json';
import lgf_annot from '$lib/data/longforms_annot.json';
import let_annot from '$lib/data/letters_annot.json';

// Unify over smallforms, longforms, annotations
// let meta:(TSmallforms_meta | TLongforms_meta | TLetters_meta) = {
let meta = {
    ...Object.fromEntries(Object.entries(smf_meta.smallforms_meta)),
    ...Object.fromEntries(Object.entries(lgf_meta.longforms_meta)),
    ...Object.fromEntries(Object.entries(let_meta.letters_meta))
};
let annot = {
    ...Object.fromEntries(Object.entries(smf_annot.smallforms_annot)),
    ...Object.fromEntries(Object.entries(lgf_annot.longforms_annot)),
    ...Object.fromEntries(Object.entries(let_annot.letters_annot))
};

// Modify protoHTML
//! todo (as little modifications as possible!)

//! @sebi: what is wrong with the textstufen type? If I replace it with e.g. label (which is just a sibling key) everything works...
// Object.keys(meta).forEach((key) =>{
//     meta[key].metadata.textstufen = meta[key].metadata.textstufen ? meta[meta[key].metadata.textstufen].metadata.title_full : '';
// })

// Export unified meta, text and annot
export const load: LayoutServerLoad = async () => {
    return { meta, annot };
};