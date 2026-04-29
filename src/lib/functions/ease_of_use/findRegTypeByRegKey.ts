import type { TRegKeys } from "$lib/types/register/TRegister";

export function findRegTypeByRegKey(regKey: TRegKeys) {
    if (regKey.includes('person')) return 'people';
    else if (regKey.includes('place')) return 'places';
    else if (regKey.includes('event')) return 'events';
    else if (regKey.includes('travel')) return 'events';
    else if (regKey.includes('org')) return 'orgs';
    else if (regKey.length === 8) return 'bibls'; //! FIX HARDCODED HEURISTIC
    else if (regKey.length === 9) return 'keywords'; //! FIX HARDCODED HEURISTIC
    else return null;
}