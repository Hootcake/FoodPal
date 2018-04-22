import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ngx-webstorage';

import { FoodPalSharedModule, UserRouteAccessService } from './shared';
import { FoodPalAppRoutingModule} from './app-routing.module';
import { FoodPalHomeModule } from './home/home.module';
import { FoodPalRecommendModule } from './recommend/recommend.module';
import { FoodPalAdminModule } from './admin/admin.module';
import { FoodPalAccountModule } from './account/account.module';
import { FoodPalEntityModule } from './entities/entity.module';
import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { RecipeListService} from './shared'
import { FavoritesService } from "./entities/favorites/favorites.service";
import { Favorites } from "./entities/favorites/favorites.model";
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';



// jhipster-needle-angular-add-module-import JHipster will add new module here
import {
    JhiMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        FoodPalAppRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        FoodPalSharedModule,
        FoodPalHomeModule,
        FoodPalAdminModule,
        FoodPalAccountModule,
        FoodPalEntityModule,
        // jhipster-needle-angular-add-module JHipster will add new module here
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService,
        RecipeListService,
        FavoritesService,
        NgbCarouselConfig

    ],
    bootstrap: [ JhiMainComponent ]
})
export class FoodPalAppModule {}
