import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { FoodPalInventoryModule } from './inventory/inventory.module';
import { FoodPalCategoryModule } from './category/category.module';
import { FoodPalRecommendModule } from './recommend/recommend.module';
import { FoodPalShopping_ListModule } from './shopping-list/shopping-list.module';
import { FoodPalFavoritesModule } from './favorites/favorites.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        FoodPalInventoryModule,
        FoodPalCategoryModule,
        FoodPalRecommendModule,
        FoodPalShopping_ListModule,
        FoodPalFavoritesModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FoodPalEntityModule {}
