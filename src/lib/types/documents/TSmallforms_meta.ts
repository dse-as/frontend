import { type TSmallformsKeys } from "./TSmallformsKeys";

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
				year: 1925;
				pubPosthumOnly: boolean;
				pubPlace: string;
				signature: string;
				pubDetails: string;
				textstufen: string;
				series: string;
				comment: string;
				keywords: '';
				maximum: 'keine';
				travel: '';
				archiveCollation: '';
				pubSecondary: '';
				urlOnlineResource: '';
				note: '';
			};
			manuscript: {
				hasiiif: boolean;
				url_iiif: string;
			};
			numPages: number | null;
			pageLimits: {
				[key: string]: [number|null, number|null]; //! for each unit (could be made more restrict to avoid invalid unitIds, but I leave it loose for now)
			};
			edition: {
				fullyEdited: boolean;
				entities?: {
					//! unsure if I should drop this, since fully redundant with register.json
					people?: string[];
					places?: string[];
					travels?: string[];
					organisations?: string[];
					works?: string[];
					keywords?: string[];
				};
			};
		};
	};
};
