import { documents as docs } from '$lib/data/documents.json';

// --- Types derived from JSON ----------------------------------------
// Keys
export type TLettersKeys = keyof (typeof docs)['letters'];
export type TSmallformsKeys = keyof (typeof docs)['smallforms'];
export type TLongformsKeys = keyof (typeof docs)['longforms'];

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
				type: TLettersGroups | '?' | '';
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
					globalEntities: {
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						people?: TPeopleKeys[];
						places?: TPlacesKeys[];
						events?: TEventsKeys[];
						orgs?: TOrgsKeys[];
						bibls?: TBiblsKeys[];
						keywords?: TKeywordsKeys[];
					};
					maximum: string;
					travel: string;
					archive: string;
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
				type: TSmallformsGroups | '?' | '';
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
					globalEntities: {
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
					archive: string;
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
				type: TLongformsGroups | '?' | '';
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
					globalEntities: {
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
					archive: string;
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
type DictEntity<TM extends string | number | symbol, TG extends string | number | symbol> = {
	name: string;
	key_singular: string;
	label_plural: string;
	metadata: {
		[K in TM]: { label: string };
	};
	groups:
		| {
				[K in TG]: {
					label_singular: string;
					label_plural: string;
					slug?: string | null;
				};
		  }
		| object;
};

export type TDocDict = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	dict_docs: {
		letters: DictEntity<TDocMetadataKeysLetters, TLettersGroups>;
		smallforms: DictEntity<TDocMetadataKeysSmallforms, TSmallformsGroups>;
		longforms: DictEntity<TDocMetadataKeysLongforms, TLongformsGroups>;
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
export type TDocAttrsMap = {
	letters: TDocAttrsLetters;
	smallforms: TDocAttrsSmallforms;
	longforms: TDocAttrsLongforms;
};

export type TDocMetadataKeysLetters =
	keyof TDocuments['documents']['letters'][TLettersKeys]['metadata'];
export type TDocMetadataKeysSmallforms =
	keyof TDocuments['documents']['smallforms'][TSmallformsKeys]['metadata'];
export type TDocMetadataKeysLongforms =
	keyof TDocuments['documents']['longforms'][TLongformsKeys]['metadata'];
export type TDocMetadataKeys =
	| TDocMetadataKeysLetters
	| TDocMetadataKeysSmallforms
	| TDocMetadataKeysLongforms;
export type TDocMetadataKeysMap = {
	letters: TDocMetadataKeysLetters;
	smallforms: TDocMetadataKeysSmallforms;
	longforms: TDocMetadataKeysLongforms;
};

export type TDocItemsLetters = TDocuments['documents']['letters'][TLettersKeys];
export type TDocItemsSmallforms = TDocuments['documents']['smallforms'][TSmallformsKeys];
export type TDocItemsLongforms = TDocuments['documents']['longforms'][TLongformsKeys];
export type TDocItems = TDocItemsLetters | TDocItemsSmallforms | TDocItemsLongforms;
export type TDocItemsMap = {
	letters: TDocItemsLetters;
	smallforms: TDocItemsSmallforms;
	longforms: TDocItemsLongforms;
};

// Group Set
export type TDocGroupsFlat = TLettersGroups | TSmallformsGroups | TLongformsGroups | '?' | '';

export type TDocGroupsMap = {
	letters: TLettersGroups | '?' | '';
	smallforms: TSmallformsGroups | '?' | '';
	longforms: TLongformsGroups | '?' | '';
};
