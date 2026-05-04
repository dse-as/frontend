import type { PageLoad } from './$types';

import { doc_topics as topics } from '$lib/data/doc_topics.json';

export const load: PageLoad = ({ params }) => {
	const slug = params.topic;
	const topicData = Object.values(topics).find((item) => item.url_slug === slug);
	return { slug, topicData };
};
