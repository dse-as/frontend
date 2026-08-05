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
import type { TRegKeysFlat, TRegTypes } from '../register/TRegister';

// --- Document -------------------------------------------------------
type TContentNotes = {
	type: string;
	title?: string;
	comment?: string;
};
type TCrossRefDocs = {
	letters?: TLettersKeys[];
	smallforms?: TSmallformsKeys[];
	longforms?: TLongformsKeys[];
	photos?: TPhotosKeys[];
};
type TCrossRefEntities = {
	people?: TPeopleKeys[];
	places?: TPlacesKeys[];
	events?: TEventsKeys[];
	orgs?: TOrgsKeys[];
	bibls?: TBiblsKeys[];
	keywords?: TKeywordsKeys[];
};

type TRendition = {
	blur?: boolean;
	hide?: boolean;
};

type TDate = { 
	notBefore?: string; 
	notAfter?: string; 
	when?: string 
};

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
				name: string | null;
				metadata: {
					types: TLettersGroups[] | null;
					date: TDate | null; // the same as date_stamp, but it could also be a date-estimate if date_stamp does not exist.
					date_stamp: TDate | null;
					people_sending: TPeopleKeys[] | null;
					people_addressed: TPeopleKeys[] | null;
					people_addressfield?: TPeopleKeys[] | null; //! as suggestion
					place_of_sender?: string | null; //! discuss whether TPlacesKeys
					place_of_recepient?: string | null; //! discuss whether TPlacesKeys
					content_and_medium?: string | null;
					language?: string | null;
					attachments?: string | null;
					archive: {
						repository?: string | null;
						repo_url?: string | null;
						shelfmark?: string | null;
						folder_name?: string | null;
						ref_code_fonds?: string | null;
						rights?: string | null;
						archival_history?: string | null;
					};
				};
				crossReferences?: {
					citedDocuments?: TCrossRefDocs;
					linkedDocuments?: TCrossRefDocs;
					citedEntities?: TCrossRefEntities;
					linkedEntities?: TCrossRefEntities;
				};
				editorialNotes: {
					comment?: string | null;
					summary?: string | null;
					contentNotes?: TContentNotes[];
					published_in?: string[];
					cited_in?: string[];
				};
				manuscript: {
					rendition?: TRendition | null;
					iiif_urls: string[];
				};
			};
		};
		smallforms: {
			[key in TSmallformsKeys]: {
				name: string;
				metadata: {
					types: TSmallformsGroups[] | null;
					date: TDate | null; // what date would that be?
					title: string | null;
					title_short?: string;
					authors: string[];
					publication: {
						pubDate: TDate | null;
						pubPosthumOnly: boolean | null;
						pubPlace?: string;
						pubDetails?: string;
						series: string; // may be redundant with sequence, but since it's very close to the data, it may stay in here.
					};
					sequences: {
						textzeugen_nonedited: string[]; // not to be confused with edited Textzeugen (which are in sequence list)
					};
					archive: {
						repository: string;
						signature: string;
						archiveCollation: string;
						pubSecondary: string;
						urlOnlineResource: string;
						note: string;
					};
				};
				crossReferences?: {
					citedDocuments?: TCrossRefDocs;
					linkedDocuments?: TCrossRefDocs;
					citedEntities?: TCrossRefEntities;
					linkedEntities?: TCrossRefEntities;
				};
				editorialNotes: {
					comment?: string;
					summary?: string;
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition?: TRendition | null;
					iiif_urls: string[];
				};
			};
		};
		longforms: {
			[key in TLongformsKeys]: {
				name: string;
				metadata: {
					types: TLongformsGroups[] | null;
					date: TDate | null; // what date would that be?
					title: string | null;
					title_short?: string;
					authors: string[];
					publication: {
						pubDate: TDate | null;
						pubPosthumOnly: boolean | null;
						pubPlace?: string;
						pubDetails?: string;
					};
					sequences: {
						textzeugen_nonedited: string[];
						textstufen_edited: string[]; // not needed here
						series: string; // not needed here
					};
					archive: {
						repository: string;
						signature: string;
						archiveCollation: string;
						pubSecondary: string;
						urlOnlineResource: string;
						note: string;
					};
				};
				crossReferences?: {
					citedDocuments?: TCrossRefDocs;
					linkedDocuments?: TCrossRefDocs;
					citedEntities?: TCrossRefEntities;
					linkedEntities?: TCrossRefEntities;
				};
				editorialNotes: {
					comment?: string;
					summary?: string;
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition?: TRendition | null;
					iiif_urls: string[];
				};
			};
		};
		photos: {
			[key in TPhotosKeys]: {
				name: string | null;
				type?: TPhotosGroups | '?' | '';
				metadata: {
					title: string | null;
					date: TDate | null;
					photographer: string | null;
					people_on_photo: string[] | null;
					published_in: string[] | null;
					mentioned_in: string[] | null;
					specs: {
						characteristics: string | null;
						captions_1: string[] | null; // how is this different to captions_2? And does it make sense to split string?
						captions_2: string[] | null;
						orientation: string | null;
						shape: string | null;
						stamped: boolean | null;
						signed: boolean | null;
					};
					archive: {
						sla_id_full: string | null;
						sla_id_coll: string | null;
						sla_id_img: string | null;
						url_helveticarchives: string | null;
						url_wikimedia: string | null;
						url_emanuscripta: string | null;
						repository: string | null;
					};
				};
				crossReferences?: {
					linkedDocuments?: TCrossRefDocs;
					linkedEntities?: TCrossRefEntities;
				};
				faksimile: {
					iiif_manifest: string | null;
					iiif_manifest_emanuscripta: string | null;
					iiif_image_emanuscripta?: string | null;
				};
				editorialNotes: {
					comment?: string | null; // note that currently there is comment_1 and comment_2 in the spreadsheet
					contentNotes?: TContentNotes[];
				};
				manuscript: {
					rendition?: TRendition | null;
					iiif_urls: string[];
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

// CrossRef Entities (Register)
export type TCrossRefEntitiesExtended = Partial<
	Record<
		TRegTypes,
		{ item: object | string | null; regType: TRegTypes | null; regKey: TRegKeysFlat }[] | null
	>
>;

// CrossRef Documents
export type TCrossRefDocumentsExtended = Partial<
	Record<
		TDocTypes,
		{ item: object | string | null; docType: TDocTypes | null; docKey: TDocKeys }[] | null
	>
>;
