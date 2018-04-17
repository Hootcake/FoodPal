import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Account, LoginModalService, Principal, RecipeListService } from '../shared';

@Component({
    selector: 'jhi-recommend',
    templateUrl: './recommend.component.html',
    styleUrls: [
        'home.css'
    ]
})

export class RecommendComponent implements OnInit {
    account: Account;
    constructor(
            private principal: Principal,
            private loginModalService: LoginModalService,
            private eventManager: JhiEventManager,
            private _recipeListService: RecipeListService,
            private modalService: NgbModal
            ) {
    }
    
    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;
        });
        this.registerAuthenticationSuccess();
    }
    
    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    } 
}