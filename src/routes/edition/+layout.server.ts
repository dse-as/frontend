export const prerender = true;

import type { LayoutServerLoad } from './$types';
import { dict_docPicker as dictDocPicker } from '$lib/dictionaries/dict_docPicker.json';

function findEdTypeByDocId(docId: string) {
	if (docId.includes('smallform')) return 'smallforms';
	else if (docId.includes('longform')) return 'longforms';
	else if (docId.includes('letter')) return 'letters';
	else return '';
}

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { meta } = await parent();

	const edSlug: string | undefined = url.pathname.split('/').pop(); //! better use params.edSlug;

	// What registerPage are we looking at?
	// let edView = !edSlug
	let edView = edSlug === 'edition'
		? //edition
			'edView1'
		: edSlug && Object.keys(dictDocPicker).includes(edSlug)
			? // e.g. /edition/[smallforms]
				'edView2'
			: Object.keys(meta).includes(edSlug)
				? // e.g. /edition/[smallform_0001]
					'edView3'
				: '';

	let edType: string | null | undefined = edView === 'edView2' ? edSlug : findEdTypeByDocId(edSlug);

	console.log('view/type', edView, edType);
	return { edSlug, edType, edView };
};
