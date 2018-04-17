import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../../shared';
import {
    RecommendService,
    RecommendPopupService,
    RecommendComponent,
    RecommendDetailComponent,
    RecommendDialogComponent,
    RecommendPopupComponent,
    RecommendDeletePopupComponent,
    RecommendDeleteDialogComponent,
    recommendRoute,
    recommendPopupRoute,
} from './';

const ENTITY_STATES = [
    ...recommendRoute,
    ...recommendPopupRoute,
];

@NgModule({
    imports: [
        FoodPalSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        RecommendComponent,
        RecommendDetailComponent,
        RecommendDialogComponent,
        RecommendDeleteDialogComponent,
        RecommendPopupComponent,
        RecommendDeletePopupComponent,
    ],
    entryComponents: [
        RecommendComponent,
        RecommendDialogComponent,
        RecommendPopupComponent,
        RecommendDeleteDialogComponent,
        RecommendDeletePopupComponent,
    ],
    providers: [
        RecommendService,
        RecommendPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalRecommendModule {}
