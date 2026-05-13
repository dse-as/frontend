export const prerender = true;

import type { LayoutServerLoad } from './$types';
import { register as reg } from '$lib/data/register.json';
import { findKeyBySlug } from '$lib/functions/ease_of_use/findKeyBySlug.js';
import { type TRegKeysFlat, type TRegTypes } from '$lib/types/register/TRegister';

export const load: LayoutServerLoad = ({ params, url }) => {
	const regSlug = params.regSlug as TRegTypes | TRegKeysFlat | undefined;
	// const regType: string | null = findKeyBySlug(reg, regSlug);
	const allfirstOrderKeys = Object.keys(reg) as Array<keyof typeof reg>;

	// What registerPage are we looking at?
	const regView = !regSlug
		? //edition/register
			'regView1'
		: regSlug && Object.keys(reg).includes(regSlug)
			? // e.g. /edition/register/[people]
				'regView2'
			: // e.g. /edition/register/[person_0001]
				'regView3';

	const regType: string | null | undefined =
		regView === 'regView2' ? regSlug : findKeyBySlug(reg, regSlug);

	return { reg, regSlug, regType, allfirstOrderKeys, regView };
};
