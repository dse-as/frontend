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

import processTEI from './processTEI';
// Unify over smallforms, longforms, annotations
//! TODO add types
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

let ceteiData: HTMLElement;

export const load: LayoutServerLoad = async ({ fetch, params }) => {
	const res = await fetch(`/data/texts/text-${params.docId}.xml`);
	const xmlString = await res.text();
	const ceteiData = processTEI(xmlString);

	const findAll = (s, term = 'milestone', ctx = 500) => {
		const res = [];
		let i = s.indexOf(term);
		while (i !== -1) {
			res.push({ index: i, context: s.slice(Math.max(0, i - ctx), i + term.length + ctx) });
			i = s.indexOf(term, i + term.length);
		}
		return res;
	};
	console.log(findAll(ceteiData.serialized));

	return { meta, annot, ceteiData };
};
