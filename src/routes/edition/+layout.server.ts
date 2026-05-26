import type { LayoutServerLoad } from './$types';
import { dict_docs as dictDoc } from '$lib/dictionaries/dict_docs.json';
import { resolveDoc } from '$lib/functions/ease_of_use/resolveDoc';
import type { TDocKeys, TDocTypes } from '$lib/types/documents/TDocuments';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { allDocs } = await parent();

	// Last segment of url
	const docSlug = url.pathname.split('/').pop() || '';

	// What registerPage are we looking at?
	const edView =
		docSlug === 'edition'
			? //edition
				'edView1'
			: docSlug && Object.keys(dictDoc).includes(docSlug)
				? // e.g. /edition/[smallforms]
					'edView2'
				: Object.values(allDocs).some((inner) => Object.keys(inner).includes(docSlug)) &&
					  url.pathname.includes('doc-overview') //! FIX change this, once the slugs are stable
					? // e.g. /edition/doc-overview/[smallform_0001]
						'edView3'
					: null;

	const docType: TDocTypes | null =
		edView === 'edView2'
			? (docSlug as TDocTypes)
			: docSlug
				? resolveDoc(null, docSlug as TDocKeys)?.docType || null
				: null;

	return { docSlug, docType, edView };
};
