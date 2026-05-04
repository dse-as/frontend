export const selectedTextNode = $state({ id: '' });

// sorting and grouping in Registers
export const uiRegSortBy = $state({ id: 'name' });
export const uiRegGroupByCat = $state({ value: false });

// Register in Sidebar
import { type TEntityTypes } from '$lib/types/register/TRegister';
export const openRegisters: { list: TEntityTypes[] } = $state({ list: [] });

// Sidebar Toggle
type TActiveRegisterTab = 'register' | 'notes';
export const activeRegisterTab: { value: TActiveRegisterTab } = $state({ value: 'notes' });
