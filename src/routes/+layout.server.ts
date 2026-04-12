export const prerender = true;

import type { LayoutServerLoad } from './$types';

import smf_meta from '$lib/data/smallforms_meta.json';
import lgf_meta from '$lib/data/longforms_meta.json';
import let_meta from '$lib/data/letters_meta.json';

// Unify over smallforms, longforms and letters
//! TODO add types
// let meta:(TSmallforms_meta | TLongforms_meta | TLetters_meta) = {
const meta = {
	...Object.fromEntries(Object.entries(smf_meta.smallforms_meta)),
	...Object.fromEntries(Object.entries(lgf_meta.longforms_meta)),
	...Object.fromEntries(Object.entries(let_meta.letters_meta))
};

// Modify protoHTML
//! todo (as little modifications as possible!)

// Object.keys(meta).forEach((key) =>{
//     meta[key].metadata.textstufen = meta[key].metadata.textstufen ? meta[meta[key].metadata.textstufen].metadata.title_full : '';
// })

// Export unified meta and text
export const load: LayoutServerLoad = async () => {
    return { meta, smf_meta, lgf_meta, let_meta};
};
