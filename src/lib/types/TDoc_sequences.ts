export type TDoc_sequences = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	doc_sequences: {
		[key: string]: {
			name: string;
			docs: string[];
		};
	};
};
