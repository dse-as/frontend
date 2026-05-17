import type { PageLoad } from './$types';

export type TTopicKeys = 'topic_0001' | 'topic_0002' | 'topic_0003';

export type TTopics = {
	meta: {
		generated_by: string;
		task: string;
		generated_on: string;
		description: string;
	};
	topics: {
		[key in TTopicKeys]: {
			url_slug: string;
			preamble: string;
			docs: TDocKeys[];
		};
	};
};
import { doc_topics as topics } from '$lib/data/doc_topics.json';
import type { TDocKeys } from '$lib/types/documents/TDocuments';

export const load: PageLoad = ({ params }) => {
	const slug = params.topic;
	const topicData = Object.values(topics).find((item) => item.url_slug === slug) as TTopics['topics'][TTopicKeys];
	return { slug, topicData };
};
