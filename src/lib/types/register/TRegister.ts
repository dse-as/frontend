import { type TPlacesKeys } from './TPlacesKeys';
import { type TPeopleKeys } from './TPeopleKeys';
import { type TEventsKeys } from './TEventsKeys';
import { type TKeywordsKeys } from './TKeywordsKeys';
import { type TOrgsKeys } from './TOrgsKeys';
import { type TSmallformsKeys } from './TSmallformsKeys';
import { type TLongformsKeys } from './TLongformsKeys';
import { type TLettersKeys } from './TLettersKeys';
import type { TBiblsKeys } from './TBiblsKeys';

// Entities
export type TEntityTypes =
	| 'people'
	| 'places'
	| 'events'
	| 'orgs'
	| 'smallforms'
	| 'longforms'
	| 'letters'
	| 'bibl'
	| 'keywords';
export type TEntityNames =
	| 'Orte'
	| 'Personen'
	| 'Events'
	| 'Organisationen'
	| 'Kleine Formen'
	| 'Lange Formen'
	| 'Briefe'
	| 'Bibliografie'
	| 'Stichworte';

// Types for specific entities
export type TPeopleTypes = string; //! restrict to subet later
export type TPlacesTypes = string; //! restrict to subet later
export type TEventsTypes = string; //! restrict to subet later
export type TorgsTypes = string; //! restrict to subet later
export type TSmallformsTypes = 'article' | 'feuilleton';
export type TLongformsTypes = string; //! restrict to subet later
export type TLettersTypes = string; //! restrict to subet later
export type TBiblsTypes = string; //! restrict to subet later
export type TKeywordsTypes = string; //! restrict to subet later

// Register
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
			};
		};
		events: {
			[key in TEventsKeys]: {
				name: string;
				type: TEventsTypes;
				date?: { from: string; to: string };
				note: string;
			};
		};
		orgs: {
			[key in TOrgsKeys]: {
				name: string;
				nameVariants: string[];
				gndNumber?: string; // optional
				type: TorgsTypes;
				note: string;
			};
		};
		smallforms: {
			[key in TSmallformsKeys]: {
				name: string;
				authorId: TPeopleKeys; //! string to account for uncertainties
				pubDate: string;
				type: TSmallformsTypes;
				gndNumber?: string; // optional
			};
		};
		longforms: {
			[key in TLongformsKeys]: {
				name: string;
				authorId: TPeopleKeys; //! string to account for uncertainties
				pubDate: string;
				type: TSmallformsTypes;
				gndNumber?: string; // optional
			};
		};
		letters: {
			[key in TLettersKeys]: {
				name: string;
				authorId: TPeopleKeys; //! string to account for uncertainties
				pubDate: string;
				type: TLettersTypes;
				gndNumber?: string; // optional
			};
		};
		bibls: {
			[key in TBiblsKeys]: {
				name: string;
				type: TLettersTypes;
				authorId: TPeopleKeys; //! string to account for uncertainties
				pubDate: string;
				gndNumber?: string; // optional
			};
		};
		keywords: {
			[key in TKeywordsKeys]: {
				name: string;
				type: TKeywordsTypes;
				gndNumber?: string; // optional
			};
		};
	};
};
