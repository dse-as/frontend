export const selectedTextNode: { id: string; el: HTMLElement | null; els:HTMLElement[] | null } = $state({
	id: '',
	el: null,
	els: null
});

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
