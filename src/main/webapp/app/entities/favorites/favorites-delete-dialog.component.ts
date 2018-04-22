import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Favorites } from './favorites.model';
import { FavoritesPopupService } from './favorites-popup.service';
import { FavoritesService } from './favorites.service';

@Component({
    selector: 'jhi-favorites-delete-dialog',
    templateUrl: './favorites-delete-dialog.component.html'
})
export class FavoritesDeleteDialogComponent {

    favorites: Favorites;

    constructor(
        private favoritesService: FavoritesService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.favoritesService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'favoritesListModification',
                content: 'Deleted an favorites'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-favorites-delete-popup',
    template: ''
})
export class FavoritesDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private favoritesPopupService: FavoritesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.favoritesPopupService
                .open(FavoritesDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
