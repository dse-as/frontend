import type { PageLoad } from './$types';

export const load: PageLoad = ({params, url}) => {  
    return {travelId: params.travel};
};
