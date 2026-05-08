// Keys
import { type TPlacesKeys } from './TPlacesKeys';
import { type TPeopleKeys } from './TPeopleKeys';
import { type TEventsKeys } from './TEventsKeys';
import { type TKeywordsKeys } from './TKeywordsKeys';
import { type TOrgsKeys } from './TOrgsKeys';
import { type TBiblsKeys } from './TBiblsKeys';

// Types
import { type TPeopleTypes } from './TPeopleTypes';
import { type TPlacesTypes } from './TPlacesTypes';
import { type TEventsTypes } from './TEventsTypes';
import { type TOrgsTypes } from './TOrgsTypes';
import { type TBiblsTypes } from './TBiblsTypes';
import { type TKeywordsTypes } from './TKeywordsTypes';

// From Documents
import { type TSmallformsKeys } from '../documents/TSmallformsKeys';
import { type TLettersKeys } from '../documents/TLettersKeys';
import { type TLongformsKeys } from '../documents/TLongformsKeys';

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
				gndNumber?: string; // optional
				dateBirth: string;
				dateDeath: string;
				type: TPeopleTypes;
				orgId: TOrgsKeys;
				note: string;
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		places: {
			[key in TPlacesKeys]: {
				name: string;
				nameVariants: string[];
				geoNamesID: number;
				geoNamesLink: string;
				type: TPlacesTypes;
				coords: [number, number];
				country: string;
				note: string;
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		events: {
			[key in TEventsKeys]: {
				name: string;
				type: TEventsTypes;
				date?: { from: string; to: string };
				note: string;
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		orgs: {
			[key in TOrgsKeys]: {
				name: string;
				nameVariants: string[];
				gndNumber?: string; // optional
				type: TOrgsTypes;
				note: string;
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		bibls: {
			[key in TBiblsKeys]: {
				name: string;
				type: TBiblsTypes;
				authorId: TPeopleKeys;
				pubDate: string;
				gndNumber?: string; // optional
				note?: string; // optional
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
		keywords: {
			[key in TKeywordsKeys]: {
				name: string;
				type: TKeywordsTypes;
				gndNumber?: string; // optional
				note?: string; // optional
				docs: (TSmallformsKeys | TLettersKeys | TLongformsKeys)[];
			};
		};
	};
};

// --- Register Dictionary -------------------------------------------------------
type RegEntity<Attrs extends string | number | symbol, Types extends string | number | symbol> = {
	register_name: string;
	key_singular: string;
	label_plural: string;
	attributes: {
		[K in Attrs]: { label: string };
	};
	type_labels: {
		[K in Types]: {
			label_singular: string;
			label_plural: string;
			slug?: string | null;
		};
	};
};

export type TRegDict = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	dict_register: {
		people: RegEntity<TRegAttrsPeople, TPeopleTypes>;
		places: RegEntity<TRegAttrsPlaces, TPlacesTypes>;
		events: RegEntity<TRegAttrsEvents, TEventsTypes>;
		orgs: RegEntity<TRegAttrsOrgs, TOrgsTypes>;
		bibls: RegEntity<TRegAttrsBibls, TBiblsTypes>;
		keywords: RegEntity<TRegAttrsKeywords, TKeywordsTypes>;
	};
};

// --- Sets -------------------------------------------------------
// Type Sets
export type TRegTypes = keyof TRegister['register'];

// Key Sets
export type TRegKeys =
	| TPeopleKeys
	| TPlacesKeys
	| TEventsKeys
	| TKeywordsKeys
	| TOrgsKeys
	| TBiblsKeys;

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
