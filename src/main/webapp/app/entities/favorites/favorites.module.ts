import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../../shared';
import { FoodPalAdminModule } from '../../admin/admin.module';
import {
    FavoritesService,
    FavoritesPopupService,
    FavoritesComponent,
    FavoritesDetailComponent,
    FavoritesDialogComponent,
    FavoritesPopupComponent,
    FavoritesDeletePopupComponent,
    FavoritesDeleteDialogComponent,
    favoritesRoute,
    favoritesPopupRoute,
} from './';

const ENTITY_STATES = [
    ...favoritesRoute,
    ...favoritesPopupRoute,
];

@NgModule({
    imports: [
        FoodPalSharedModule,
        FoodPalAdminModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        FavoritesComponent,
        FavoritesDetailComponent,
        FavoritesDialogComponent,
        FavoritesDeleteDialogComponent,
        FavoritesPopupComponent,
        FavoritesDeletePopupComponent,
    ],
    entryComponents: [
        FavoritesComponent,
        FavoritesDialogComponent,
        FavoritesPopupComponent,
        FavoritesDeleteDialogComponent,
        FavoritesDeletePopupComponent,
    ],
    providers: [
        FavoritesService,
        FavoritesPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalFavoritesModule {}
