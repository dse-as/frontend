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

type TResolvedRegister =
	| {
			regId: TPeopleKeys;
			regType: 'people';
			item: TRegister['register']['people'][TPeopleKeys] | null;
	  }
	| {
			regId: TPlacesKeys;
			regType: 'places';
			item: TRegister['register']['places'][TPlacesKeys] | null;
	  }
	| {
			regId: TEventsKeys;
			regType: 'events';
			item: TRegister['register']['events'][TEventsKeys] | null;
	  }
	| {
			regId: TOrgsKeys;
			regType: 'orgs';
			item: TRegister['register']['orgs'][TOrgsKeys] | null;
	  }
	| {
			regId: TBiblsKeys;
			regType: 'bibls';
			item: TRegister['register']['bibls'][TBiblsKeys] | null;
	  }
	| {
			regId: TKeywordsKeys;
			regType: 'keywords';
			item: TRegister['register']['keywords'][TKeywordsKeys] | null;
	  };

export function resolveReg(
	object: Record<TRegTypes, any> | null,
	regId: TRegKeysFlat
): TResolvedRegister | null {
	if (regId.includes('person_')) {
		return {
			regId: regId as TPeopleKeys,
			regType: 'people',
			item: object?.people[regId] || null
		};
	} else if (regId.includes('place_')) {
		return {
			regId: regId as TPlacesKeys,
			regType: 'places',
			item: object?.places[regId] || null
		};
	} else if (regId.includes('event_') || regId.includes('travel')) {
		return {
			regId: regId as TEventsKeys,
			regType: 'events',
			item: object?.events[regId] || null
		};
	} else if (regId.includes('org_')) {
		return {
			regId: regId as TOrgsKeys,
			regType: 'orgs',
			item: object?.orgs[regId] || null
		};
	} else if (/^[0-9-]+$/.test(regId) || regId.includes('keyword_')) {
		// String only contains numbers and "-"
		return {
			regId: regId as TKeywordsKeys,
			regType: 'keywords',
			item: object?.keywords[regId] || null
		};
	} else if (regId.length === 8) {
		return {
			regId: regId as TBiblsKeys,
			regType: 'bibls',
			item: object?.bibls[regId] || null
		};
	} else {
		return null;
	}
}
