export const prerender = true;

import type { LayoutServerLoad } from './$types';
import { dict_docPicker as dictDocPicker } from '$lib/dictionaries/dict_docPicker.json';
import { findEdTypeByDocId } from '$lib/functions/ease_of_use/findEdTypeByDocId';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { fullMeta } = await parent();

	const edSlug = url.pathname.split('/').pop() || ''; //! better use params.edSlug;

	// What registerPage are we looking at?
	// let edView = !edSlug
	const edView =
		edSlug === 'edition'
			? //edition
				'edView1'
			: Object.keys(dictDocPicker).includes(edSlug)
				? // e.g. /edition/[smallforms]
					'edView2'
				: Object.values(fullMeta).some((inner) => Object.keys(inner).includes(edSlug)) &&
					  url.pathname.includes('doc-overview') //! FIX change this, once the slugs are stable
					? // e.g. /edition/doc-overview/[smallform_0001]
						'edView3'
					: null;

	const edType: string | null =
		edView === 'edView2' ? edSlug : edSlug ? findEdTypeByDocId(edSlug as any) : null;

	return { edSlug, edType, edView };
};
