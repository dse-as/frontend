export let selectedTextNode = $state({ id: '' });

// sorting and grouping in Registers
export let uiRegSortBy = $state({ id: 'name' });
export let uiRegGroupByCat = $state({ value: false });

// Register in Sidebar
import { type TEntityTypes } from '$lib/types/register/TRegister';
export let openRegisters: { list: TEntityTypes[] } = $state({ list: [] });

// Sidebar Toggle
type TActiveRegisterTab = 'register' | 'notes';
export let activeRegisterTab: { value: TActiveRegisterTab } = $state({ value: 'register' });
