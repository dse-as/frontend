import type { PageLoad } from './$types';

export const load: PageLoad = ({params, url}) => {  
    return {topic_slug: params.topic};
};
