import { type TPlacesKeys } from './TPlacesKeys';
import { type TPeopleKeys } from './TPeopleKeys';
import { type TEventsKeys } from './TEventsKeys';
import { type TKeywordsKeys } from './TKeywordsKeys';
import { type TOrgsKeys } from './TOrgsKeys';
import type { TBiblsKeys } from './TBiblsKeys';

export type TPeopleTypes = string; //! restrict to subet later
export type TPlacesTypes = string; //! restrict to subet later
export type TEventsTypes = string; //! restrict to subet later
export type TOrgsTypes = string; //! restrict to subet later
export type TBiblsTypes = string; //! restrict to subet later
export type TKeywordsTypes = string; //! restrict to subet later
// Entities
export type TEntityTypes =
	| 'people'
	| 'places'
	| 'events'
	| 'orgs'
	| 'bibl'
	| 'keywords';

export type TEntityNames =
	| 'Personen'
	| 'Orte'
	| 'Events'
	| 'Organisationen'
	| 'Bibliografie'
	| 'Stichworte';

// Types for specific entities
export type TPeopleTypes = string; //! restrict to subset later
export type TPlacesTypes = string; //! restrict to subset later
export type TEventsTypes = string; //! restrict to subset later
export type TOrgsTypes = string; //! restrict to subset later
export type TBiblsTypes = string; //! restrict to subset later
export type TKeywordsTypes = string; //! restrict to subset later

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
				type: TOrgsTypes;
				note: string;
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
