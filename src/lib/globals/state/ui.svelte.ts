export let selectedTextNode = $state({ id: '' });

// sorting and grouping
export let uiOvSortBy = $state({
	documents: 'name',
	register: 'name'
});
export let uiOvGroupByCat = $state({
	documents: false,
	register: false
});

// Register in Sidebar
import { type TRegTypes } from '$lib/types/register/TRegister';
export let openRegisters: { list: TRegTypes[] } = $state({ list: [] });

// Sidebar Toggle
type TActiveRegisterTab = 'register' | 'notes';
export let activeRegisterTab: { value: TActiveRegisterTab } = $state({ value: 'notes' });

// const
export const UI_TYPESWITHGROUPCONTROL = {
	documents: [''],
	register: ['events', 'orgs', 'people', 'places']
};
export const UI_TYPESWITHSORTCONTROL = {
	documents: ['letters', 'smallforms', 'longforms'],
	register: ['events']
};
