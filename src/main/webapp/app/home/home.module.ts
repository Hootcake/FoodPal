import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FoodPalSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent, NgbdModalContent } from './';

@NgModule({
    imports: [
        FoodPalSharedModule,
        RouterModule.forChild([ HOME_ROUTE ])
    ],
    declarations: [
        HomeComponent,
        NgbdModalContent
    ],
    entryComponents: [
        NgbdModalContent
    ],
    providers: [
                
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalHomeModule {}
