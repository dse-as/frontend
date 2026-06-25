import { type TSmallformsKeys } from '../documents/TSmallformsKeys';
import { type TLettersKeys } from '../documents/TLettersKeys';
import { type TLongformsKeys } from '../documents/TLongformsKeys';

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
