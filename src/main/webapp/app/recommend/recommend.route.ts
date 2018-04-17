import { Route } from '@angular/router';
import { RecommendComponent } from './';

export const RECOMMEND_ROUTE: Route = {
    path: '/recommendations',
    component: RecommendComponent,
    data: {
        authorities: [],
        pageTitle: 'Recommendations'
    }
};
