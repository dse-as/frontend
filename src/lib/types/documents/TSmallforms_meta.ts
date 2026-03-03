import { type TEventsKeys } from '../register/TEventsKeys';
import { type TOrgsKeys } from '../register/TOrgsKeys';
import { type TPeopleKeys } from '../register/TPeopleKeys';
import { type TPlacesKeys } from '../register/TPlacesKeys';
import { type TSmallformsKeys } from './TSmallformsKeys';
import { type TLongformsKeys } from './TLongformsKeys';
import { type TLettersKeys } from './TLettersKeys';
import { type TBiblKeys } from '../register/TBiblsKeys';
import { type TKeywordsKeys } from '../register/TKeywordsKeys';

export type TdocType =
	| 'Typoskript'
	| 'Manuskript'
	| 'Feuilleton'
	| 'Rezension'
	| 'Beilage'
	| 'Fotoreportage'
	| 'Fotografie'
	| 'Zeitschriftenartikel'
	| 'Zeitungsartikel'
	| 'Sammelband-Beitrag'
	| 'Serie';

export type TSmallforms_meta = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	smallforms_meta: {
		[key in TSmallformsKeys]: {
			slug: string; //! discuss whether this is identical to key
			docType: TdocType;
			units: {
				unitIds: string[];
				unitLabels: string[];
			};
			metadata: {
				authors: string[];
				pubDate: string;
				summary: string;
				title_full: string;
				title_short: string;
				label: string;
				editor_workflow: 'ez_ttf_of';
				year: string;
				pubPosthumOnly: boolean;
				pubPlace: string;
				signature: string;
				pubDetails: string;
				textstufen: string;
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
					bibl?: TBiblKeys[];
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
				bibl?: TBiblKeys[];
				keywords?: TKeywordsKeys[];
			};
			manuscript: {
				hasiiif: boolean;
				url_iiif: string;
			};
			numPages: number | null;
			pageLimits: {
				[key: string]: [number | null, number | null]; //! for each unit (could be made more restrict to avoid invalid unitIds, but I leave it loose for now)
			};
			edition: {
				fullyEdited: boolean;
			};
		};
	};
};
