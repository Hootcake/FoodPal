import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Recommend } from './recommend.model';
import { RecommendService } from './recommend.service';

@Component({
    selector: 'jhi-recommend-detail',
    templateUrl: './recommend-detail.component.html'
})
export class RecommendDetailComponent implements OnInit, OnDestroy {

    recommend: Recommend;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private recommendService: RecommendService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInRecommends();
    }

    load(id) {
        this.recommendService.find(id).subscribe((recommend) => {
            this.recommend = recommend;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInRecommends() {
        this.eventSubscriber = this.eventManager.subscribe(
            'recommendListModification',
            (response) => this.load(this.recommend.id)
        );
    }
}
