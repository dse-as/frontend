export const prerender = true;

import type { ServerLoad } from '@sveltejs/kit';
import { register as reg } from '$lib/data/register.json';
import { findKeyBySlug } from '$lib/functions/ease_of_use/findKeyBySlug.js';

export const load: ServerLoad = ({ params, url }) => {
	const regSlug: string | undefined = params.regSlug;
	// const regType: string | null = findKeyBySlug(reg, regSlug);
	const allfirstOrderKeys = Object.keys(reg) as Array<keyof typeof reg>;

	// What registerPage are we looking at?
	let regView = !regSlug
		? //edition/register
			'regView1'
		: regSlug && Object.keys(reg).includes(regSlug)
			? // e.g. /edition/register/[people]
				'regView2'
			: // e.g. /edition/register/[person_0001]
				'regView3';

	let regType: string | null | undefined = regView === 'regView2' ? regSlug : findKeyBySlug(reg, regSlug);

	return { reg, regSlug, regType, allfirstOrderKeys, regView };
};
