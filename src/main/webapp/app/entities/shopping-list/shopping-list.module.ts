import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../../shared';
import { FoodPalAdminModule } from '../../admin/admin.module';
import {
    Shopping_ListService,
    Shopping_ListPopupService,
    Shopping_ListComponent,
    Shopping_ListDetailComponent,
    Shopping_ListDialogComponent,
    Shopping_ListPopupComponent,
    Shopping_ListDeletePopupComponent,
    Shopping_ListDeleteDialogComponent,
    shopping_ListRoute,
    shopping_ListPopupRoute,
    Shopping_ListResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...shopping_ListRoute,
    ...shopping_ListPopupRoute,
];

@NgModule({
    imports: [
        FoodPalSharedModule,
        FoodPalAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        Shopping_ListComponent,
        Shopping_ListDetailComponent,
        Shopping_ListDialogComponent,
        Shopping_ListDeleteDialogComponent,
        Shopping_ListPopupComponent,
        Shopping_ListDeletePopupComponent,
    ],
    entryComponents: [
        Shopping_ListComponent,
        Shopping_ListDialogComponent,
        Shopping_ListPopupComponent,
        Shopping_ListDeleteDialogComponent,
        Shopping_ListDeletePopupComponent,
    ],
    providers: [
        Shopping_ListService,
        Shopping_ListPopupService,
        Shopping_ListResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalShopping_ListModule {}
