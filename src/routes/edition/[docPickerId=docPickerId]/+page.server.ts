import type { PageServerLoad } from './$types';
import type { EntryGenerator } from './$types';
export const prerender = true;

export const entries: EntryGenerator = () => {
	return [{ docPickerId: 'letters' }, { docPickerId: 'smallforms' }, { docPickerId: 'longforms' }];
};

export const load: PageServerLoad = ({}) => {
	return {};
};
