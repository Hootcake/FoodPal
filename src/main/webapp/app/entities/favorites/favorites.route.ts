import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { FavoritesComponent } from './favorites.component';
import { FavoritesDetailComponent } from './favorites-detail.component';
import { FavoritesPopupComponent } from './favorites-dialog.component';
import { FavoritesDeletePopupComponent } from './favorites-delete-dialog.component';

export const favoritesRoute: Routes = [
    {
        path: 'favorites',
        component: FavoritesComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Favorites'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'favorites/:id',
        component: FavoritesDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Favorites'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const favoritesPopupRoute: Routes = [
    {
        path: 'favorites-new',
        component: FavoritesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Favorites'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'favorites/:id/edit',
        component: FavoritesPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Favorites'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'favorites/:id/delete',
        component: FavoritesDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Favorites'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
