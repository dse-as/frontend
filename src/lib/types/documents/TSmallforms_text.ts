import { type TSmallformsKeys } from './TSmallformsKeys';

export type TSmallforms_text = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	smallforms_text: {
		// document
		[key in TSmallformsKeys]: {
			name: string;
			pathHTML: string;
		};
	};
};
