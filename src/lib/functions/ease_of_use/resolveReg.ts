// ------------------------------------------------------------
// Resolver Function for Register-Object (using simple heuristic)
// ------------------------------------------------------------

import type { TBiblsKeys } from '$lib/types/register/TBiblsKeys';
import type { TEventsKeys } from '$lib/types/register/TEventsKeys';
import type { TKeywordsKeys } from '$lib/types/register/TKeywordsKeys';
import type { TOrgsKeys } from '$lib/types/register/TOrgsKeys';
import type { TPeopleKeys } from '$lib/types/register/TPeopleKeys';
import type { TPlacesKeys } from '$lib/types/register/TPlacesKeys';
import type { TRegister, TRegKeysFlat, TRegTypes } from '$lib/types/register/TRegister';

export type TResolvedRegister =
	| {
			regKey: TPeopleKeys;
			regType: 'people';
			item: TRegister['register']['people'][TPeopleKeys] | null;
	  }
	| {
			regKey: TPlacesKeys;
			regType: 'places';
			item: TRegister['register']['places'][TPlacesKeys] | null;
	  }
	| {
			regKey: TEventsKeys;
			regType: 'events';
			item: TRegister['register']['events'][TEventsKeys] | null;
	  }
	| {
			regKey: TOrgsKeys;
			regType: 'orgs';
			item: TRegister['register']['orgs'][TOrgsKeys] | null;
	  }
	| {
			regKey: TBiblsKeys;
			regType: 'bibls';
			item: TRegister['register']['bibls'][TBiblsKeys] | null;
	  }
	| {
			regKey: TKeywordsKeys;
			regType: 'keywords';
			item: TRegister['register']['keywords'][TKeywordsKeys] | null;
	  };

export function resolveReg(
	object: Record<TRegTypes, any> | null,
	regKey: TRegKeysFlat
): TResolvedRegister | null {
	if (regKey.includes('person_')) {
		return {
			regKey: regKey as TPeopleKeys,
			regType: 'people',
			item: object?.people[regKey] || null
		};
	} else if (regKey.includes('place_')) {
		return {
			regKey: regKey as TPlacesKeys,
			regType: 'places',
			item: object?.places[regKey] || null
		};
	} else if (regKey.includes('event_') || regKey.includes('travel')) {
		return {
			regKey: regKey as TEventsKeys,
			regType: 'events',
			item: object?.events[regKey] || null
		};
	} else if (regKey.includes('organisation_')) {
		return {
			regKey: regKey as TOrgsKeys,
			regType: 'orgs',
			item: object?.orgs[regKey] || null
		};
	} else if (/^[0-9-]+$/.test(regKey) || regKey.includes('keyword_')) {
		// String only contains numbers and "-"
		return {
			regKey: regKey as TKeywordsKeys,
			regType: 'keywords',
			item: object?.keywords[regKey] || null
		};
	} else if (regKey.length === 8) {
		return {
			regKey: regKey as TBiblsKeys,
			regType: 'bibls',
			item: object?.bibls[regKey] || null
		};
	} else {
		return null;
	}
}
