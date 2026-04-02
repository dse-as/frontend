export type TSeqType = 'correspondence' | 'travels' | 'topics';
export type TSeqId = string;

export type TDoc_sequences = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	doc_sequences: {
		[key in TSeqType]: {
			name: string;
			preamble: string;
			docs: string[];
		};
	};
};
