import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Favorites } from './favorites.model';
import { FavoritesPopupService } from './favorites-popup.service';
import { FavoritesService } from './favorites.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-favorites-dialog',
    templateUrl: './favorites-dialog.component.html'
})
export class FavoritesDialogComponent implements OnInit {

    favorites: Favorites;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private favoritesService: FavoritesService,
        private userService: UserService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.userService.query()
            .subscribe((res: ResponseWrapper) => { this.users = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.favorites.id !== undefined) {
            this.subscribeToSaveResponse(
                this.favoritesService.update(this.favorites));
        } else {
            this.subscribeToSaveResponse(
                this.favoritesService.create(this.favorites));
        }
    }

    private subscribeToSaveResponse(result: Observable<Favorites>) {
        result.subscribe((res: Favorites) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Favorites) {
        this.eventManager.broadcast({ name: 'favoritesListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackUserById(index: number, item: User) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-favorites-popup',
    template: ''
})
export class FavoritesPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private favoritesPopupService: FavoritesPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.favoritesPopupService
                    .open(FavoritesDialogComponent as Component, params['id']);
            } else {
                this.favoritesPopupService
                    .open(FavoritesDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
