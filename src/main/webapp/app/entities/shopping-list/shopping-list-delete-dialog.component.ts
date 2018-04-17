import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Shopping_List } from './shopping-list.model';
import { Shopping_ListPopupService } from './shopping-list-popup.service';
import { Shopping_ListService } from './shopping-list.service';

@Component({
    selector: 'jhi-shopping-list-delete-dialog',
    templateUrl: './shopping-list-delete-dialog.component.html'
})
export class Shopping_ListDeleteDialogComponent {

    shopping_List: Shopping_List;

    constructor(
        private shopping_ListService: Shopping_ListService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.shopping_ListService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'shopping_ListListModification',
                content: 'Deleted an shopping_List'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-shopping-list-delete-popup',
    template: ''
})
export class Shopping_ListDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private shopping_ListPopupService: Shopping_ListPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.shopping_ListPopupService
                .open(Shopping_ListDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
