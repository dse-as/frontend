export const selectedTextNode: {
	key: string;
	el: HTMLElement | undefined | null;
	els: HTMLElement[] | undefined | null;
} = $state({
	key: '',
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
