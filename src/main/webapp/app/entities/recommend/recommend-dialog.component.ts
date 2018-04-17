import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Recommend } from './recommend.model';
import { RecommendPopupService } from './recommend-popup.service';
import { RecommendService } from './recommend.service';

@Component({
    selector: 'jhi-recommend-dialog',
    templateUrl: './recommend-dialog.component.html'
})
export class RecommendDialogComponent implements OnInit {

    recommend: Recommend;
    isSaving: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private recommendService: RecommendService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.recommend.id !== undefined) {
            this.subscribeToSaveResponse(
                this.recommendService.update(this.recommend));
        } else {
            this.subscribeToSaveResponse(
                this.recommendService.create(this.recommend));
        }
    }

    private subscribeToSaveResponse(result: Observable<Recommend>) {
        result.subscribe((res: Recommend) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Recommend) {
        this.eventManager.broadcast({ name: 'recommendListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
}

@Component({
    selector: 'jhi-recommend-popup',
    template: ''
})
export class RecommendPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private recommendPopupService: RecommendPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.recommendPopupService
                    .open(RecommendDialogComponent as Component, params['id']);
            } else {
                this.recommendPopupService
                    .open(RecommendDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
