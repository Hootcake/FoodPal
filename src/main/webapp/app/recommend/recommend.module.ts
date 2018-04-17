import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../shared';

import { RECOMMEND_ROUTE, RecommendComponent} from './';

@NgModule({
    imports: [
        FoodPalSharedModule,
        RouterModule.forChild([ RECOMMEND_ROUTE ])
    ],
    declarations: [
        RecommendComponent
    ],
    entryComponents: [
    ],
    providers: [
                
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalRecommendModule {}
