// Keys
import { type TPlacesKeys } from './TPlacesKeys';
import { type TPeopleKeys } from './TPeopleKeys';
import { type TEventsKeys } from './TEventsKeys';
import { type TKeywordsKeys } from './TKeywordsKeys';
import { type TOrgsKeys } from './TOrgsKeys';
import { type TBiblsKeys } from './TBiblsKeys';

// Types
import { type TPeopleGroups } from './TPeopleGroups';
import { type TPlacesGroups } from './TPlacesGroups';
import { type TEventsGroups } from './TEventsGroups';
import { type TOrgsGroups } from './TOrgsGroups';
import { type TBiblsGroups } from './TBiblsGroups';
import { type TKeywordsGroups } from './TKeywordsGroups';

// From Documents
import { type TSmallformsKeys } from '../documents/TDocuments';
import { type TLettersKeys } from '../documents/TDocuments';
import { type TLongformsKeys } from '../documents/TDocuments';

// --- Register -------------------------------------------------------
export type TRegister = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	register: {
		people: {
			[key in TPeopleKeys]: {
				name: string;
				firstname: string;
				lastname: string;
				nameVariants: string[];
				gndNumber?: string;
				dateBirth: string;
				dateDeath: string;
				type: TPeopleGroups | null;
				orgId: TOrgsKeys;
				note: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		places: {
			[key in TPlacesKeys]: {
				name: string;
				nameVariants: string[];
				gndNumber?: string;
				geoNamesID: number | null;
				geoNamesLink: string;
				type: TPlacesGroups | null;
				coords: number[] | null;
				country: string;
				note: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		events: {
			[key in TEventsKeys]: {
				name: string;
				type: TEventsGroups | null;
				date?: { from: string; to: string };
				note: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		orgs: {
			[key in TOrgsKeys]: {
				name: string;
				nameVariants: string[];
				gndNumber?: string;
				type: TOrgsGroups | null;
				note: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		bibls: {
			[key in TBiblsKeys]: {
				name: string;
				type: TBiblsGroups | null;
				authorId: TPeopleKeys;
				pubDate: string;
				gndNumber?: string;
				note?: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		keywords: {
			[key in TKeywordsKeys]: {
				name: string;
				type: TKeywordsGroups | null;
				gndNumber?: string;
				note?: string;
				docs?: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
	};
};

// --- Register Dictionary -------------------------------------------------------
type RegEntity<TA extends string | number | symbol, TG extends string | number | symbol> = {
	register_name: string;
	key_singular: string;
	label_plural: string;
	attributes: {
		[K in TA]: { label: string };
	};
	groups:
		| {
				[K in TG]: {
					label_singular: string;
					label_plural: string;
					slug?: string | null;
				};
		  }
		| {};
};

export type TRegDict = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	dict_register: {
		people: RegEntity<TRegAttrsPeople, TPeopleGroups>;
		places: RegEntity<TRegAttrsPlaces, TPlacesGroups>;
		events: RegEntity<TRegAttrsEvents, TEventsGroups>;
		orgs: RegEntity<TRegAttrsOrgs, TOrgsGroups>;
		bibls: RegEntity<TRegAttrsBibls, TBiblsGroups>;
		keywords: RegEntity<TRegAttrsKeywords, TKeywordsGroups>;
	};
};

// --- Sets -------------------------------------------------------
// Type Set
export type TRegTypes = keyof TRegister['register'];

// Key Set
export type TRegKeysFlat =
	| TPeopleKeys
	| TPlacesKeys
	| TEventsKeys
	| TOrgsKeys
	| TBiblsKeys
	| TKeywordsKeys;

export type TRegKeysMap = {
	people: TPeopleKeys;
	places: TPlacesKeys;
	events: TEventsKeys;
	orgs: TOrgsKeys;
	bibls: TBiblsKeys;
	keywords: TKeywordsKeys;
};

// Attribute Sets
export type TRegAttrsPeople = keyof TRegister['register']['people'][TPeopleKeys];
export type TRegAttrsPlaces = keyof TRegister['register']['places'][TPlacesKeys];
export type TRegAttrsEvents = keyof TRegister['register']['events'][TEventsKeys];
export type TRegAttrsOrgs = keyof TRegister['register']['orgs'][TOrgsKeys];
export type TRegAttrsBibls = keyof TRegister['register']['bibls'][TBiblsKeys];
export type TRegAttrsKeywords = keyof TRegister['register']['keywords'][TKeywordsKeys];

export type TRegAttrs =
	| TRegAttrsPeople
	| TRegAttrsPlaces
	| TRegAttrsEvents
	| TRegAttrsOrgs
	| TRegAttrsBibls
	| TRegAttrsKeywords;

export type TRegAttrsMap = {
	people: TRegAttrsPeople;
	places: TRegAttrsPlaces;
	events: TRegAttrsEvents;
	orgs: TRegAttrsOrgs;
	bibls: TRegAttrsBibls;
	keywords: TRegAttrsKeywords;
};

// Group Set
export type TRegGroupsFlat =
	| TPeopleGroups
	| TPlacesGroups
	| TEventsGroups
	| TOrgsGroups
	| TBiblsGroups
	| TKeywordsGroups;

export type TRegGroupsMap = {
	people: TPeopleGroups;
	places: TPlacesGroups;
	events: TEventsGroups;
	orgs: TOrgsGroups;
	bibls: TBiblsGroups;
	keywords: TKeywordsGroups;
};
