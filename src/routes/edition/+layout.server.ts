export const prerender = true;

import type { LayoutServerLoad } from './$types';
import { dict_docs as dictDocPicker } from '$lib/dictionaries/dict_docs.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { allDocs } = await parent();

	// Last segment of url
	const edSlug = url.pathname.split('/').pop() || '';

	// What registerPage are we looking at?
	const edView =
		edSlug === 'edition'
			? //edition
				'edView1'
			: edSlug && Object.keys(dictDocPicker).includes(edSlug)
				? // e.g. /edition/[smallforms]
					'edView2'
				: Object.values(allDocs).some((inner) => Object.keys(inner).includes(edSlug)) &&
					  url.pathname.includes('doc-overview') //! FIX change this, once the slugs are stable
					? // e.g. /edition/doc-overview/[smallform_0001]
						'edView3'
					: null;

	const edType: TDocTypes | null =
		edView === 'edView2'
			? (edSlug as TDocTypes)
			: edSlug
				? resolveDoc(null, edSlug as TDocKeys)?.docType || null
				: null;

	return { edSlug, edType, edView };
};
