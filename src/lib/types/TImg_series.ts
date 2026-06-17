export type Tphoto_series = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	photo_series: {
		[key: string]: {
			name: string;
			filenames: string[];
		};
	};
};
