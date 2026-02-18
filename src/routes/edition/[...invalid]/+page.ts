import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

import { page } from '$app/state';

export const load: PageLoad = (event) => {
	// error(404, `Not Found ${page.params.invalid}`); //! @sebi: why does this lead to Internal Error?
	error(404, `Not Found`);
};