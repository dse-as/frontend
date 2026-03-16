export type TImg_series = {
	meta: {
        generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	img_series: {
		[key: string]: {
			name: string;
			filenames: string[];
		};
	};
};
