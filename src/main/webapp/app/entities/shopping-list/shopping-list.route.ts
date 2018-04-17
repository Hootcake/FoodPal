import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { Shopping_ListComponent } from './shopping-list.component';
import { Shopping_ListDetailComponent } from './shopping-list-detail.component';
import { Shopping_ListPopupComponent } from './shopping-list-dialog.component';
import { Shopping_ListDeletePopupComponent } from './shopping-list-delete-dialog.component';

@Injectable()
export class Shopping_ListResolvePagingParams implements Resolve<any> {

    constructor(private paginationUtil: JhiPaginationUtil) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const page = route.queryParams['page'] ? route.queryParams['page'] : '1';
        const sort = route.queryParams['sort'] ? route.queryParams['sort'] : 'id,asc';
        return {
            page: this.paginationUtil.parsePage(page),
            predicate: this.paginationUtil.parsePredicate(sort),
            ascending: this.paginationUtil.parseAscending(sort)
      };
    }
}

export const shopping_ListRoute: Routes = [
    {
        path: 'shopping-list',
        component: Shopping_ListComponent,
        resolve: {
            'pagingParams': Shopping_ListResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Shopping_Lists'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'shopping-list/:id',
        component: Shopping_ListDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Shopping_Lists'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const shopping_ListPopupRoute: Routes = [
    {
        path: 'shopping-list-new',
        component: Shopping_ListPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Shopping_Lists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shopping-list/:id/edit',
        component: Shopping_ListPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Shopping_Lists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'shopping-list/:id/delete',
        component: Shopping_ListDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Shopping_Lists'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
