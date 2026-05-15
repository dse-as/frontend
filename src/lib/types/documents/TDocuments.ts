// Keys
import { type TLettersKeys } from './TLettersKeys';
import { type TSmallformsKeys } from './TSmallformsKeys';
import { type TLongformsKeys } from './TLongformsKeys';

// Types
import { type TLettersGroups } from './TLettersGroups';
import { type TSmallformsGroups } from './TSmallformsGroups';
import { type TLongformsGroups } from './TLongformGroups';

// From Register
import { type TPeopleKeys } from '../register/TPeopleKeys';
import { type TPlacesKeys } from '../register/TPlacesKeys';
import { type TEventsKeys } from '../register/TEventsKeys';
import { type TOrgsKeys } from '../register/TOrgsKeys';
import { type TBiblsKeys } from '../register/TBiblsKeys';
import { type TKeywordsKeys } from '../register/TKeywordsKeys';

// --- Document -------------------------------------------------------
export type TDocuments = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	documents: {
		letters: {
			[key in TLettersKeys]: {
				slug?: string; //! discuss whether this is identical to key
				name: string;
				date: { from: string; to: string };
				type: TLettersGroups | '?' | "";
				metadata: {
					authors?: string[];
					summary?: string;
					title_short?: string;
					pubDate: string;
					title_full: string;
					label: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					pubPlace: string;
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					keywords: {
						people?: TPeopleKeys[];
						places?: TPlacesKeys[];
						events?: TEventsKeys[];
						orgs?: TOrgsKeys[];
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						bibls?: TBiblsKeys[];
						keywords?: TKeywordsKeys[];
					};
					maximum: string;
					travel: string;
					archiveCollation: string;
					pubSecondary: string;
					urlOnlineResource: string;
					note: string;
				};
				entities: {
					//! unsure if I should drop this, since fully redundant with register.json
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				manuscript: {
					iiif_urls: string[];
				};
				numPages: number | null;
				edition: {
					fullyEdited: boolean;
				};
			};
		};
		smallforms: {
			[key in TSmallformsKeys]: {
				slug?: string; //! discuss whether this is identical to key
				name: string;
				date: { from: string; to: string };
				type: TSmallformsGroups | '?' | "";
				metadata: {
					authors?: string[];
					summary?: string;
					pubDate: string;
					title_full: string;
					title_short?: string;
					label: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					pubPlace: string;
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					keywords: {
						people?: TPeopleKeys[];
						places?: TPlacesKeys[];
						events?: TEventsKeys[];
						orgs?: TOrgsKeys[];
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						bibls?: TBiblsKeys[];
						keywords?: TKeywordsKeys[];
					};
					maximum: string; //! what is this?
					travel: string; //! what is this?
					archiveCollation: string;
					pubSecondary: string;
					urlOnlineResource: string;
					note: string;
				};
				entities: {
					//! unsure if I should drop this, since fully redundant with register.json
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				manuscript: {
					iiif_urls: string[];
				};
				numPages: number | null;
				edition: {
					fullyEdited: boolean;
				};
			};
		};
		longforms: {
			[key in TLongformsKeys]: {
				slug?: string; //! discuss whether this is identical to key
				name: string;
				date: { from: string; to: string };
				type: TLongformsGroups | '?' | "";
				metadata: {
					authors?: string[];
					summary?: string;
					pubDate: string;
					title_full: string;
					title_short?: string;
					label: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					pubPlace: string;
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					keywords: {
						people?: TPeopleKeys[];
						places?: TPlacesKeys[];
						events?: TEventsKeys[];
						orgs?: TOrgsKeys[];
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						bibls?: TBiblsKeys[];
						keywords?: TKeywordsKeys[];
					};
					maximum: string;
					travel: string;
					archiveCollation: string;
					pubSecondary: string;
					urlOnlineResource: string;
					note: string;
				};
				entities: {
					//! unsure if I should drop this, since fully redundant with register.json
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				manuscript: {
					iiif_urls: string[];
				};
				numPages: number | null;
				edition: {
					fullyEdited: boolean;
				};
			};
		};
	};
};

// --- Docs Dictionary -------------------------------------------------------
type DictEntity<Attrs extends string | number | symbol, Types extends string | number | symbol> = {
	name: string;
	key_singular: string;
	label_plural: string;
	attributes: {};
	groups:
		| {
				[K in Types]: {
					label_singular: string;
					label_plural: string;
					slug?: string | null;
				};
		  }
		| {};
};

export type TDocDict = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	dict_docs: {
		letters: DictEntity<TDocAttrsLetters, TLettersGroups>;
		smallforms: DictEntity<TDocAttrsSmallforms, TSmallformsGroups>;
		longforms: DictEntity<TDocAttrsLongforms, TLongformsGroups>;
	};
};

// --- Sets -------------------------------------------------------
export type TDocTypes = keyof TDocuments['documents'];
export type TDocKeys = TLettersKeys | TSmallformsKeys | TLongformsKeys;
export type TDocKeysMap = {
	letters: TLettersKeys;
	smallforms: TSmallformsKeys;
	longforms: TLongformsKeys;
};

export type TDocAttrsLetters = keyof TDocuments['documents']['letters'][TLettersKeys];
export type TDocAttrsSmallforms = keyof TDocuments['documents']['smallforms'][TSmallformsKeys];
export type TDocAttrsLongforms = keyof TDocuments['documents']['longforms'][TLongformsKeys];
export type TDocAttrs = TDocAttrsLetters | TDocAttrsSmallforms | TDocAttrsLongforms;

export type TDocMetadataLetters =
	keyof TDocuments['documents']['letters'][TLettersKeys]['metadata'];
export type TDocMetadataSmallforms =
	keyof TDocuments['documents']['smallforms'][TSmallformsKeys]['metadata'];
export type TDocMetadataLongforms =
	keyof TDocuments['documents']['longforms'][TLongformsKeys]['metadata'];
export type TDocMetadata = TDocMetadataLetters | TDocMetadataSmallforms | TDocMetadataLongforms;

// Group Set
export type TDocGroupsFlat = TLettersGroups | TSmallformsGroups | TLongformsGroups  | '?' | "";;

export type TDocGroupsMap = {
	letters: TLettersGroups | '?' | "";
	smallforms: TSmallformsGroups | '?' | "";
	longforms: TLongformsGroups | '?' | "";
};
