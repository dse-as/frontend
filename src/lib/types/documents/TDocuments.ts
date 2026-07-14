// --- Types ----------------------------------------
// Keys
import { type TLettersKeys } from './TLettersKeys';
import { type TSmallformsKeys } from './TSmallformsKeys';
import { type TLongformsKeys } from './TLongformsKeys';
import { type TPhotosKeys } from './TPhotosKeys';

// Types
import { type TLettersGroups } from './TLettersGroups';
import { type TSmallformsGroups } from './TSmallformsGroups';
import { type TLongformsGroups } from './TLongformGroups';
import { type TPhotosGroups } from './TPhotosGroups';

// From Register
import { type TPeopleKeys } from '../register/TPeopleKeys';
import { type TPlacesKeys } from '../register/TPlacesKeys';
import { type TEventsKeys } from '../register/TEventsKeys';
import { type TOrgsKeys } from '../register/TOrgsKeys';
import { type TBiblsKeys } from '../register/TBiblsKeys';
import { type TKeywordsKeys } from '../register/TKeywordsKeys';

// --- Document -------------------------------------------------------
type TContentNotes = {
	type: string;
	title?: string;
	comment?: string;
}
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
					title: string | null;
					authors?: string[];
					summary?: string;
					title_short?: string;
					pubDate: string;
					title_full: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					placeOfSending?: string; //! discuss whether TPlacesKeys
					placeOfRecepient?: string; //! discuss whether TPlacesKeys
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					globalEntities?: {
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						photos?: TPhotosKeys[];
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
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					photos?: TPhotosKeys[];
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				editorialNotes: {
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition: {
						blur?: boolean;
						hide?: boolean;
					};
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
					title: string | null;
					authors?: string[];
					summary?: string;
					pubDate: string;
					title_full: string;
					title_short?: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					pubPlace?: string;
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					globalEntities?: {
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						photos?: TPhotosKeys[];
						people?: TPeopleKeys[];
						places?: TPlacesKeys[];
						events?: TEventsKeys[];
						orgs?: TOrgsKeys[];
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
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					photos?: TPhotosKeys[];
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				editorialNotes: {
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition: {
						blur?: boolean;
						hide?: boolean;
					};
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
					title: string | null;
					authors?: string[];
					summary?: string;
					pubDate: string;
					title_full: string;
					title_short?: string;
					editor_workflow: 'ez_ttf_of';
					year: string;
					pubPosthumOnly: boolean | string;
					pubPlace?: string;
					signature: string;
					pubDetails?: string;
					textstufen_edited: string[];
					textzeugen_nonedited: string[];
					series: string;
					comment: string;
					globalEntities?: {
						smallforms?: TSmallformsKeys[];
						longforms?: TLongformsKeys[];
						letters?: TLettersKeys[];
						photos?: TPhotosKeys[];
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
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					letters?: TLettersKeys[];
					photos?: TPhotosKeys[];
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				editorialNotes: {
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition: {
						blur?: boolean;
						hide?: boolean;
					};
					iiif_urls: string[];
				};
				numPages: number | null;
				edition: {
					fullyEdited: boolean;
				};
			};
		};
		photos: {
			[key in TPhotosKeys]: {
				name: string | null;
				type?: TPhotosGroups | '?' | '';
				metadata: {
					title: string | null;
					date: string | null;
					date_normalised: {
						from: string | null;
						to: string | null;
					} | null;
					travel: string | null;
					photographer: string | null;
					people_on_photo: string[] | null;
					characteristics: string | null;
					comments_1: string | null;
					captions_1: string[] | null;
					captions_2: string[] | null;
					orientation: string | null;
					shape: string | null;
					url_helveticarchives: string | null;
					url_wikimedia: string | null;
					url_emanuscripta: string | null;
					repository: string | null;
					published_in: string[] | null;
					mentioned_in: string[] | null;
					comments_2: string | null;
					sla_id_full: string | null;
					sla_id_coll: string | null;
					sla_id_img: string | null;
					stamped: boolean | null;
					signed: boolean | null;
				};
				faksimile: {
					iiif_manifest: string | null;
					iiif_manifest_emanuscripta: string | null;
					iiif_image_emanuscripta?: string | null;
				};
				editorialNotes: {
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition: {
						blur?: boolean;
						hide?: boolean;
					};
					iiif_urls: string[];
				};
				linkedReg: {
					people?: TPeopleKeys[];
					places?: TPlacesKeys[];
					events?: TEventsKeys[];
					orgs?: TOrgsKeys[];
					bibls?: TBiblsKeys[];
					keywords?: TKeywordsKeys[];
				};
				linkedDocs: {
					letters?: TLettersKeys[];
					smallforms?: TSmallformsKeys[];
					longforms?: TLongformsKeys[];
					photos?: TPhotosKeys[];
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
		[K in TM]?: { label: string };
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
		photos: DictEntity<TDocMetadataKeysPhotos, TPhotosGroups>;
	};
};

// --- Sets -------------------------------------------------------
export type TDocTypes = keyof TDocuments['documents'];
export type TDocKeys = TLettersKeys | TSmallformsKeys | TLongformsKeys | TPhotosKeys;
export type TDocKeysMap = {
	letters: TLettersKeys;
	smallforms: TSmallformsKeys;
	longforms: TLongformsKeys;
	photos: TPhotosKeys;
};

export type TDocAttrsLetters = keyof TDocuments['documents']['letters'][TLettersKeys];
export type TDocAttrsSmallforms = keyof TDocuments['documents']['smallforms'][TSmallformsKeys];
export type TDocAttrsLongforms = keyof TDocuments['documents']['longforms'][TLongformsKeys];
export type TDocAttrsPhotos = keyof TDocuments['documents']['photos'][TPhotosKeys];
export type TDocAttrs =
	| TDocAttrsLetters
	| TDocAttrsSmallforms
	| TDocAttrsLongforms
	| TDocAttrsPhotos;
export type TDocAttrsMap = {
	letters: TDocAttrsLetters;
	smallforms: TDocAttrsSmallforms;
	longforms: TDocAttrsLongforms;
	photos: TDocAttrsPhotos;
};

export type TDocMetadataKeysLetters =
	keyof TDocuments['documents']['letters'][TLettersKeys]['metadata'];
export type TDocMetadataKeysSmallforms =
	keyof TDocuments['documents']['smallforms'][TSmallformsKeys]['metadata'];
export type TDocMetadataKeysLongforms =
	keyof TDocuments['documents']['longforms'][TLongformsKeys]['metadata'];
export type TDocMetadataKeysPhotos =
	keyof TDocuments['documents']['photos'][TPhotosKeys]['metadata'];
export type TDocMetadataKeys =
	| TDocMetadataKeysLetters
	| TDocMetadataKeysSmallforms
	| TDocMetadataKeysLongforms
	| TDocMetadataKeysPhotos;
export type TDocMetadataKeysMap = {
	letters: TDocMetadataKeysLetters;
	smallforms: TDocMetadataKeysSmallforms;
	longforms: TDocMetadataKeysLongforms;
	photos: TDocMetadataKeysPhotos;
};

export type TDocItemsLetters = TDocuments['documents']['letters'][TLettersKeys];
export type TDocItemsSmallforms = TDocuments['documents']['smallforms'][TSmallformsKeys];
export type TDocItemsLongforms = TDocuments['documents']['longforms'][TLongformsKeys];
export type TDocItemsPhotos = TDocuments['documents']['photos'][TPhotosKeys];
export type TDocItems =
	| TDocItemsLetters
	| TDocItemsSmallforms
	| TDocItemsLongforms
	| TDocItemsPhotos;
export type TDocItemsMap = {
	letters: TDocItemsLetters;
	smallforms: TDocItemsSmallforms;
	longforms: TDocItemsLongforms;
	photos: TDocItemsPhotos;
};

// Group Set
export type TDocGroupsFlat =
	| TLettersGroups
	| TSmallformsGroups
	| TLongformsGroups
	| TPhotosGroups
	| '?'
	| '';

export type TDocGroupsMap = {
	letters: TLettersGroups | '?' | '';
	smallforms: TSmallformsGroups | '?' | '';
	longforms: TLongformsGroups | '?' | '';
	photos: TPhotosGroups | '?' | '';
};
