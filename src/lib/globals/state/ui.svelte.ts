export const selectedTextNode = $state({ id: '' });

// sorting and grouping
export const uiOvSortBy = $state({
	documents: 'name',
	register: 'name'
});
export const uiOvGroupByCat = $state({
	documents: false,
	register: false
});

// Register in Sidebar
import { type TRegTypes } from '$lib/types/register/TRegister';
export const openRegisters: { list: TRegTypes[] } = $state({ list: [] });

// Sidebar Toggle
type TActiveRegisterTab = 'register' | 'notes';
export const activeRegisterTab: { value: TActiveRegisterTab } = $state({ value: 'notes' });

// const
export const UI_TYPESWITHGROUPCONTROL = {
	documents: ['letters', 'smallforms', 'longforms'],
	register: ['events', 'orgs', 'people', 'places']
};
export const UI_TYPESWITHSORTCONTROL = {
	documents: ['letters', 'smallforms', 'longforms'],
	register: ['events']
};
