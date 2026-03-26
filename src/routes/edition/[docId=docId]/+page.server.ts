export const prerender = true;

import { type TSmallforms_meta } from '$lib/types/documents/TSmallforms_meta';
import { type TLongforms_meta } from '$lib/types/documents/TLongforms_meta';
import { type TLetters_meta } from '$lib/types/documents/TLetters_meta';
import { JSDOM } from 'jsdom';
import CETEI from 'CETEIcean';

import type { LayoutServerLoad } from './$types';

import smf_meta from '$lib/data/smallforms_meta.json';
import lgf_meta from '$lib/data/longforms_meta.json';
import let_meta from '$lib/data/letters_meta.json';
import smf_annot from '$lib/data/smallforms_annot.json';
import lgf_annot from '$lib/data/longforms_annot.json';
import let_annot from '$lib/data/letters_annot.json';

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

export const load: LayoutServerLoad = async ({ params }) => {
	// CETEIcean with JSDOM
	const jdom = new JSDOM(`<TEI xmlns="http://www.tei-c.org/ns/1.0" />`, {
		contentType: 'text/xml'
	});
	const cetei = new CETEI({
		documentObject: jdom.window.document
	});
	// cetei.getHTML5(`/data/texts/text-${params.docId}.xml`, (data) => {
	// 	ceteiData = data;
	// });

	return { meta, annot, ceteiData };
};
