import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { RecommendComponent } from './recommend.component';
import { RecommendDetailComponent } from './recommend-detail.component';
import { RecommendPopupComponent } from './recommend-dialog.component';
import { RecommendDeletePopupComponent } from './recommend-delete-dialog.component';

export const recommendRoute: Routes = [
    {
        path: 'recommend',
        component: RecommendComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recommends'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'recommend/:id',
        component: RecommendDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recommends'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const recommendPopupRoute: Routes = [
    {
        path: 'recommend-new',
        component: RecommendPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recommends'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'recommend/:id/edit',
        component: RecommendPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recommends'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'recommend/:id/delete',
        component: RecommendDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Recommends'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
