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
	async function loadText(params) {
		const defaultBody = `
		<?xml version="1.0" encoding="UTF-8"?>
			<TEI xmlns="http://www.tei-c.org/ns/1.0">
				<text>
					<body>
						<div type="body" xml:lang="en">
							<p>No content available.</p>
						</div>
					</body>
				</text>
			</TEI>`;

		try {
			// (1) Fetch xml data
			const res = await fetch(`/data/texts/text-${params.docId}.xml`);

			// Throw 404 if XML not found
			if (!res.ok) {
				if (res.status === 404) {
					console.warn('XML not found, using default data');
					return defaultBody;
				}
				throw new Error(`Fetch error: ${res.status} ${res.statusText}`);
			}

			// (2) Extract xmlString
			const xmlString = await res.text();
			// Warn if empty/invalid XML
			if (!xmlString || !xmlString.trim()) {
				console.warn('Empty XML response, using default data');
				return defaultBody;
			}

			// (3) Apply CETEIcean's processTEI()
			try {
				const ceteiData = processTEI(xmlString);
				return ceteiData;
			} catch (parseErr) {
				console.error('TEI parse error:', parseErr);
				return defaultBody;
			}
		} catch (err) {
			// (4) Catch other errors
			console.error('Failed to load XML:', err);
			return defaultBody;
		}
	}

	ceteiData = await loadText(params);
	return { meta, annot, ceteiData };
};
