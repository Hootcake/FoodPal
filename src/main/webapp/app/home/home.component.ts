import { Component, OnInit, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { Account, LoginModalService, Principal, RecipeListService } from '../shared';

//Modal dialog for recipe details
@Component({
  selector:'ngbd-modal-content',
  template:`<div class="modal-header">
      <h4 class="modal-title">Recipe Info</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p align="center"><img src="{{image}}"><p>
      <p>Yields: {{ yield }}</p>
      <p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>`
})
export class NgbdModalContent {
  @Input() name;
  @Input() yield: string;
  @Input() image: string;
  constructor(public activeModal: NgbActiveModal) {}
}


@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {
    account: Account;
    modalRef: NgbModalRef;
    recipes: any[];
    diets = new Array();
    searchQuery: string = null;
    ingredients = new Array();
    recipeParam: string = "";
    public details;
    largeImageDetails: any[];
    model = {
            left: false,
            middle: false,
            right: false
          };
    recipeFound: boolean = false;
    recipeDetailsFound: boolean = false;
    dietChecked: boolean = false;
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

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    testFunc(e) {
        if(e.target.checked){
            this.dietChecked = true;
            this.searchRecipes(null, '388^Lacto vegetarian');
        }
        if(this.dietChecked == true && !e.target.checked){
            this.diets.splice(this.diets.indexOf('388^Lacto vegetarian'), 1);
            this.refreshSearch();
        }
    }
   
    login() {
        this.modalRef = this.loginModalService.open();
    }
   
    handleSuccess(data){
        this.recipeFound = true;
        this.recipes = data.matches;
        console.log(data.matches);
    }
    
    handleDetails(data){
        this.open(data)
    }
    
    //Logs any errors to console
    handleError(error){
        console.log(error);
    }
    
    
    // Pings our second API: Giving us the details of a recipe based on the UID given to us from our primary API
    searchDetail(query: string){
        return this._recipeListService.getDetails(query).subscribe(
                data => this.handleDetails(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    deleteIngredient(ingredient: string, diet: string){
        console.log(this.ingredients.indexOf(ingredient));
        this.ingredients.splice(this.ingredients.indexOf(ingredient), 1);
        this.refreshSearch();
    }
    
    // Refresh our search every time an ingredient is removed from the ingredients array
    refreshSearch(){
        console.log(this.dietChecked);
        this.recipeParam = "";
        for(let ingredient of this.ingredients){
            this.recipeParam += '&allowedIngredient=' + ingredient;
        }
        for(let diet of this.diets){
            this.recipeParam += '&allowedDiet[]=' + diet;
        }
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    // Search recipes, called every time a new ingredient is added
    searchRecipes(query: string, diet: string){
        console.log(this.dietChecked);
        this.recipeParam = "";
        if(query != null)
            this.ingredients.push(query.toLowerCase());
        if(diet != null)
            this.diets.push(diet);
        console.log(this.ingredients);
        for(let ingredient of this.ingredients){
            this.recipeParam += '&allowedIngredient=' + ingredient;
        }
        for(let diet of this.diets){
            this.recipeParam += '&allowedDiet[]=' + diet;
        }
        this.searchQuery = ''
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    // Opens up our modal dialog 'ngbd-modal-dialog'. Receives JSON-P object through query. 
    open(query: any) {
      const modalRef = this.modalService.open(NgbdModalContent);
      this.recipeDetailsFound = true;
      this.largeImageDetails = query.images;
      var largeImage: any;
      console.log(query);
      for(let i of this.largeImageDetails){
          console.log(i.hostedLargeUrl)
          largeImage = i.hostedLargeUrl;
      }
      modalRef.componentInstance.yield = query.yield;
      modalRef.componentInstance.image = largeImage;  
    }
}
