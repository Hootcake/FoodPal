import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { JhiPaginationUtil } from 'ng-jhipster';

import { UserRouteAccessService } from '../../shared';
import { InventoryComponent } from './inventory.component';
import { InventoryDetailComponent } from './inventory-detail.component';
import { InventoryPopupComponent } from './inventory-dialog.component';
import { InventoryDeletePopupComponent } from './inventory-delete-dialog.component';

@Injectable()
export class InventoryResolvePagingParams implements Resolve<any> {

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

export const inventoryRoute: Routes = [
    {
        path: 'inventory',
        component: InventoryComponent,
        resolve: {
            'pagingParams': InventoryResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Inventories'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'inventory/:id',
        component: InventoryDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Inventories'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const inventoryPopupRoute: Routes = [
    {
        path: 'inventory-new',
        component: InventoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Inventories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'inventory/:id/edit',
        component: InventoryPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Inventories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'inventory/:id/delete',
        component: InventoryDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Inventories'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
