import { type TPlacesKeys } from "./TPlacesKeys";
import { type TPeopleKeys } from "./TPeopleKeys";
import { type TEventsKeys } from "./TEventsKeys";
import { type TKeywordsKeys } from "./TKeywordsKeys";
import { type TOrganisationsKeys } from "./TOrganisationsKeys";
import { type TWorksKeys } from "./TWorksKeys";

// Entities
export type TEntityTypes = "people" | "places" | "events" | "organisations" | "works" | "keywords";
export type TEntityNames = "Orte" | "Personen" | "Events" | "Organisationen" | "Werke" | "Stichworte";

// Types for specific entities
export type TPeopleTypes = string; //! restrict to subet later
export type TPlacesTypes = string; //! restrict to subet later
export type TEventsTypes = string; //! restrict to subet later
export type TOrganisationsTypes = string; //! restrict to subet later
export type TWorksTypes = "book" | "article";
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
				organisationId: TOrganisationsKeys;
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
		organisations: {
			[key in TOrganisationsKeys]: {
				name: string;
				nameVariants: string[];
				gndNumber?: string; // optional
				type: TOrganisationsTypes;
				note: string;
			};
		};
		works: {
			[key in TWorksKeys]: {
				name: string;
				authorId: TPeopleKeys; //! string to account for uncertainties
				pubDate: string;
				type: TWorksTypes;
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
