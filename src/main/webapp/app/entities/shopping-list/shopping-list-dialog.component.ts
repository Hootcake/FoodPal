import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Shopping_List } from './shopping-list.model';
import { Shopping_ListPopupService } from './shopping-list-popup.service';
import { Shopping_ListService } from './shopping-list.service';
import { User, UserService } from '../../shared';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-shopping-list-dialog',
    templateUrl: './shopping-list-dialog.component.html'
})
export class Shopping_ListDialogComponent implements OnInit {

    shopping_List: Shopping_List;
    isSaving: boolean;

    users: User[];

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private shopping_ListService: Shopping_ListService,
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
        if (this.shopping_List.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shopping_ListService.update(this.shopping_List));
        } else {
            this.subscribeToSaveResponse(
                this.shopping_ListService.create(this.shopping_List));
        }
    }

    private subscribeToSaveResponse(result: Observable<Shopping_List>) {
        result.subscribe((res: Shopping_List) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Shopping_List) {
        this.eventManager.broadcast({ name: 'shopping_ListListModification', content: 'OK'});
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
    selector: 'jhi-shopping-list-popup',
    template: ''
})
export class Shopping_ListPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shopping_ListPopupService: Shopping_ListPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.shopping_ListPopupService
                    .open(Shopping_ListDialogComponent as Component, params['id']);
            } else {
                this.shopping_ListPopupService
                    .open(Shopping_ListDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
