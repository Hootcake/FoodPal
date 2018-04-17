import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../../shared';
import { FoodPalAdminModule } from '../../admin/admin.module';
import {
    InventoryService,
    InventoryPopupService,
    InventoryComponent,
    InventoryDetailComponent,
    InventoryDialogComponent,
    InventoryPopupComponent,
    InventoryDeletePopupComponent,
    InventoryDeleteDialogComponent,
    inventoryRoute,
    inventoryPopupRoute,
    InventoryResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...inventoryRoute,
    ...inventoryPopupRoute,
];

@NgModule({
    imports: [
        FoodPalSharedModule,
        FoodPalAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        InventoryComponent,
        InventoryDetailComponent,
        InventoryDialogComponent,
        InventoryDeleteDialogComponent,
        InventoryPopupComponent,
        InventoryDeletePopupComponent,
    ],
    entryComponents: [
        InventoryComponent,
        InventoryDialogComponent,
        InventoryPopupComponent,
        InventoryDeleteDialogComponent,
        InventoryDeletePopupComponent,
    ],
    providers: [
        InventoryService,
        InventoryPopupService,
        InventoryResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalInventoryModule {}
