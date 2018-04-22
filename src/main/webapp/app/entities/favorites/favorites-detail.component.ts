import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Favorites } from './favorites.model';
import { FavoritesService } from './favorites.service';

@Component({
    selector: 'jhi-favorites-detail',
    templateUrl: './favorites-detail.component.html'
})
export class FavoritesDetailComponent implements OnInit, OnDestroy {

    favorites: Favorites;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private favoritesService: FavoritesService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInFavorites();
    }

    load(id) {
        this.favoritesService.find(id).subscribe((favorites) => {
            this.favorites = favorites;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInFavorites() {
        this.eventSubscriber = this.eventManager.subscribe(
            'favoritesListModification',
            (response) => this.load(this.favorites.id)
        );
    }
}
