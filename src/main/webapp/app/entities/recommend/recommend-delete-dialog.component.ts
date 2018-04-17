import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Recommend } from './recommend.model';
import { RecommendPopupService } from './recommend-popup.service';
import { RecommendService } from './recommend.service';

@Component({
    selector: 'jhi-recommend-delete-dialog',
    templateUrl: './recommend-delete-dialog.component.html'
})
export class RecommendDeleteDialogComponent {

    recommend: Recommend;

    constructor(
        private recommendService: RecommendService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.recommendService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'recommendListModification',
                content: 'Deleted an recommend'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-recommend-delete-popup',
    template: ''
})
export class RecommendDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private recommendPopupService: RecommendPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.recommendPopupService
                .open(RecommendDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
