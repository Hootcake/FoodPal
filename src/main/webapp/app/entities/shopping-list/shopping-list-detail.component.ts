import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Shopping_List } from './shopping-list.model';
import { Shopping_ListService } from './shopping-list.service';

@Component({
    selector: 'jhi-shopping-list-detail',
    templateUrl: './shopping-list-detail.component.html'
})
export class Shopping_ListDetailComponent implements OnInit, OnDestroy {

    shopping_List: Shopping_List;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private shopping_ListService: Shopping_ListService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInShopping_Lists();
    }

    load(id) {
        this.shopping_ListService.find(id).subscribe((shopping_List) => {
            this.shopping_List = shopping_List;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInShopping_Lists() {
        this.eventSubscriber = this.eventManager.subscribe(
            'shopping_ListListModification',
            (response) => this.load(this.shopping_List.id)
        );
    }
}
