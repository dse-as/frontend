import { type TSmallformsKeys } from './documents/TDocuments';
import { type TLongformsKeys } from './documents/TDocuments';
import { type TLettersKeys } from './documents/TDocuments';

export type TTimelineEntry = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	timeline: {
		date: string;
		biography_info: string;
		event: string;
		textWork: string;
		textPub: string;
		work_id: TSmallformsKeys | TLongformsKeys | TLettersKeys;
		note: string;
	};
};

export type TTimeline = TTimelineEntry[];
