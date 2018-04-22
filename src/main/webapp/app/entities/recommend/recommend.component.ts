import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs/Observable';
import { NgbModalRef, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Recommend } from './recommend.model';
import { RecommendService } from './recommend.service';
import { Principal, ResponseWrapper, RecipeListService } from '../../shared';
import { InventoryService } from "../inventory/inventory.service";
import { Inventory } from "../inventory/inventory.model";
import { Shopping_ListService } from "../shopping-list/shopping-list.service";
import { FavoritesService } from "../favorites/favorites.service";
import { Favorites } from "../favorites/favorites.model";
import { Shopping_List } from "../shopping-list/shopping-list.model";
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import {map} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

export interface IAlert {
    id: number;
    type: string;
    message: string;
  }

//Modal dialog for recipe details
@Component({
  selector:'ngbd-modal-content',
  template:`<div class="modal-header">
      <h4 class="modal-title">Recipe Info   </h4> 
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p align="center"><img src="{{image}}"><p>
      <p>Yields: {{ recipe.yield }}</p>
      <p>
    </div>
    <div class="modal-footer">
      <td><button class="btn btn-md btn-outline-primary" (click)="save(recipe)">Save</button></td>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">Close</button>
    </div>`
})
export class NgbdModalContent {
  @Input() name;
  @Input() yield: string;
  @Input() recipe: any;
  @Input() image: string;
  isSaving: boolean;
  recipeIngredients = new Array();
  testVar: Boolean = true;
  favorite: Favorites;
  itemCategory: Boolean = false;
  currentAccount: any;
  largeImageDetails: any[];
  eventSubscriber: Subscription;
  currentSearch: string;
  choices = new Array();
  recipes: any[];
  recipeFound: boolean = false;
  recipeDetailsFound: boolean = false;
  
  constructor(public activeModal: NgbActiveModal,
          private eventManager: JhiEventManager,
          private favoriteService: FavoritesService) {}
  

  
  save(data) {
      this.isSaving = true;
      this.favorite = new Favorites();
      this.isSaving = true;
      this.favorite.ingredients = "";
      this.favorite.recipe_title = data.name;
      this.favorite.cuisine = "";
      for(let ingredient of data.ingredientLines){
          this.favorite.ingredients += ''+ingredient;
      }
      this.favorite.source_URL = data.source.sourceRecipeUrl;
     
      if (this.favorite.id !== undefined) {
          this.subscribeToSaveResponse(
              this.favoriteService.update(this.favorite));
      } else {
          this.subscribeToSaveResponse(
              this.favoriteService.create(this.favorite));
      }

  }
  
  private subscribeToSaveResponse(result: Observable<Favorites>) {
      result.subscribe((res: Favorites) =>
          this.onSaveSuccess(res), (res: Response) => this.onSaveError());
  }
  
  private onSaveSuccess(result: Favorites) {
      this.eventManager.broadcast({ name: 'favoritesListModification', content: 'OK'});
      this.isSaving = false;
  }
  
  private onSaveError() {
      this.isSaving = false;
  }
  
}
@Component({
    selector:'ngbd-help-content',
    template:`<div class="modal-header">
        <h4 class="modal-title">Help</h4> 
        <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
            <ngb-tabset>
  <ngb-tab title="Recommendations by Inventory">
    <ng-template ngbTabContent>
      <p>Upon selecting this option, you will be shown various categories of items. 
      These categories contain items that can be used as the main ingredient.</p>
      <p>From there, you can select one of the ingredients you own from that category. 
      After this, you will get results based on the chosen ingredient</p>
    </ng-template>
  </ngb-tab>
  <ngb-tab>
    <ng-template ngbTabTitle>Recommendations by Time</ng-template>
    <ng-template ngbTabContent>
      <p>Want a recommendation for something to eat right now? This will provide you recommendations based on the current time.</p>
      <p>For example, if it is midday, you will get recommendations for lunch and brunch, while also excluding results for dinner and other inappropriate courses</p>
    </ng-template>
  </ngb-tab>
   <ngb-tab>
    <ng-template ngbTabTitle>Recommendations by Cuisine</ng-template>
    <ng-template ngbTabContent>
      <p>Have you been favoriting recipes? If so, this might be the ideal tool for you</p>
      <p>This tool will find your favorites and the most commonly occurring cuisine type amongst them. 
      Then, you will get recommendations based on the cuisine you seem to be liking the most</p>
    </ng-template>
  </ngb-tab>
  </ngb-tabset>
      </div>
      <div class="modal-footer">
      </div>`
  })
  export class NgbdHelpContent {
    @Input() name;
    @Input() yield: string;
    @Input() recipe: any;
    @Input() image: string;
    isSaving: boolean;
    recipeIngredients = new Array();
    testVar: Boolean = true;
    favorite: Favorites;
    itemCategory: Boolean = false;
    currentAccount: any;
    largeImageDetails: any[];
    eventSubscriber: Subscription;
    currentSearch: string;
    choices = new Array();
    recipes: any[];
    recipeFound: boolean = false;
    recipeDetailsFound: boolean = false;
    
    constructor(public activeModal: NgbActiveModal,
            private eventManager: JhiEventManager,
            private favoriteService: FavoritesService) {}
    

    
    save(data) {
        this.isSaving = true;
        this.favorite = new Favorites();
        this.isSaving = true;
        this.favorite.ingredients = "";
        this.favorite.recipe_title = data.name;
        this.favorite.cuisine = "";
        for(let ingredient of data.ingredientLines){
            this.favorite.ingredients += ''+ingredient;
        }
        this.favorite.source_URL = data.source.sourceRecipeUrl;
       
        if (this.favorite.id !== undefined) {
            this.subscribeToSaveResponse(
                this.favoriteService.update(this.favorite));
        } else {
            this.subscribeToSaveResponse(
                this.favoriteService.create(this.favorite));
        }

    }
    
    private subscribeToSaveResponse(result: Observable<Favorites>) {
        result.subscribe((res: Favorites) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }
    
    private onSaveSuccess(result: Favorites) {
        this.eventManager.broadcast({ name: 'favoritesListModification', content: 'OK'});
        this.isSaving = false;
    }
    
    private onSaveError() {
        this.isSaving = false;
    }
    
  }

@Component({
    selector: 'jhi-recommend',
    templateUrl: './recommend.component.html'
})
export class RecommendComponent implements OnInit, OnDestroy {
    @Input()
    public alerts: Array<IAlert> = [];

    private backup: Array<IAlert>;
    userInventory = new Array();
    userFavorites = new Array();
    categories = new Array();
    images: Array<string>;
    ingredientNames = new Array();
    //Important categories
    fruitInventory = new Array();
    vegInventory = new Array();
    meatInventory = new Array();
    grainInventory = new Array();
    //Query 
    isSaving: boolean;
    largeImage: any;
    ingredients = new Array();
    recipeParam: string = "";
    recipeIngredients = new Array();
    beginVar: Boolean = true;
    shoppingList: Shopping_List;
    itemCategory: Boolean = false;
    currentAccount: any;
    largeImageDetails: any[];
    eventSubscriber: Subscription;
    currentSearch: string;
    choices = new Array();
    recipes: any[];
    recipeFound: boolean = false;
    recipeDetailsFound: boolean = false;

    constructor(
        private RecommendService: RecommendService,
        private inventoryService: InventoryService,
        private jhiAlertService: JhiAlertService,
        private shoppingListService: Shopping_ListService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private _recipeListService: RecipeListService,
        private principal: Principal,
        private modalService: NgbModal,
        config: NgbCarouselConfig,
        private _http: HttpClient,
        private favoriteService: FavoritesService
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
            config.interval = 10000;
            config.wrap = true;
            config.keyboard = true;
    }

    loadAll() {
        this.userInventory = this.userInventory;
        return this.userInventory; 
    }
    
    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    
    ngOnInit() {
        this.inventoryService.query().subscribe(
                (res: ResponseWrapper) => {
                    this.userInventory = res.json;
                    console.log(this.userInventory);
                    this.findInventoryCategoryAndName(this.userInventory);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.favoriteService.query().subscribe(
                (res: ResponseWrapper) => {
                    this.userFavorites = res.json;
                    console.log(this.userFavorites);
                  //  this.findInventoryCategoryAndName(this.userFavorites);
                },
                (res: ResponseWrapper) => this.onError(res.json)
            );
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
      
        this.registerChangeInRecommends();

    }
    
    isAuthenticated() {
        return this.principal.isAuthenticated();
    }
    
    private _randomImageUrls(images: Array<{id: number}>): Array<string> {
        return [1, 2, 3].map(() => {
          const randomId = images[Math.floor(Math.random() * images.length)].id;
          return `https://picsum.photos/900/500?image=${randomId}`;
        });
        }
    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Recommend) {
        return item.id;
    }
    
    findInventoryCategoryAndName(inventories){
        for(let inventory of inventories){
           if(inventory.category.id === 3)
               this.fruitInventory.push(inventory);
           if(inventory.category.id === 1)
               this.meatInventory.push(inventory); 
           if(inventory.category.id === 4)
               this.vegInventory.push(inventory);
           if(inventory.category.id === 2)
               this.grainInventory.push(inventory);
           this.ingredientNames.push(inventory.ingredient_name.toLowerCase());
        }
        console.log( this.ingredientNames );
        console.log( this.fruitInventory );
    }
    
    beginRecommendations(){
        this.beginVar = false;
        this.itemCategory = true;
    }
    
    listIngredients(query: string){
            switch(query){
            case "meat":
                 this.choices = new Array();
                 for(let meat of this.meatInventory){
                     this.choices.push(meat);
                 }
            }
    }
    
    mainChoice(query: string){
        this.recipeParam = "";
        this.ingredients.push(query.toLowerCase());
        for(let ingredient of this.ingredients){
            this.recipeParam += '&allowedIngredient=' + ingredient;
        }
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    registerChangeInRecommends() {
        this.eventSubscriber = this.eventManager.subscribe('recommendListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
  
    handleSuccess(data){
        this.recipeFound = true;
        this.recipes = data.matches;
        for(let recipe of this.recipes){
            this.getImg(recipe);
            var ingredientsOnHand = new Array();
            var ingredientsNotOnHand = new Array();
            for(let recipeIngredient of recipe.ingredients){
                if(this.ingredientNames.indexOf(recipeIngredient) == -1)
                    ingredientsNotOnHand.push(recipeIngredient);
                else
                    ingredientsOnHand.push(recipeIngredient);
            }
            recipe.ingredients_owned = ingredientsOnHand;
            recipe.ingredients_not_owned = ingredientsNotOnHand;
        }
        console.log(this.recipes);
        this.testBoogaloo(this.recipes);
    }
    
    getImg(query: any){
        this._recipeListService.getDetails(query.id).subscribe(
                data => this.handleImage(data, query),
                error => this.handleError(error))
                return this.largeImageDetails;  
    }
    
    handleImage(data: any, query:any){   
        for(let i of data.images){
            this.largeImage = i.hostedLargeUrl;
        }   
        query.largeImage = this.largeImage;
    }
    
    timelyRecipe(){
        this.recipeParam = "";
        var currentTime = new Date();
        console.log(currentTime.getHours());
        var timeInHours = currentTime.getHours();
        if(timeInHours >=6 && timeInHours<=10){
            console.log('Breakfast');
            this.recipeParam += '&allowedCourse[]=course^course-Breakfast and Brunch'+
            '&excludedCourse[]=course^course-Main Dishes';

        }
        if(timeInHours > 10 && timeInHours <=15){
            console.log('Brunch');
            this.recipeParam += '&allowedCourse[]=course^course-Breakfast and Brunch'
                +'&allowedCourse[]=course^course-Salads'
                +'&allowedCourse[]=course^course-Soups'
                +'&excludedCourse[]=course^course-Main Dishes';
        }
        if(timeInHours >= 12 && timeInHours <=14){
            console.log('Lunch');
            this.recipeParam += '&allowedCourse[]=course^course-Lunch'
                +'&excludedCourse[]=course^course-Main Dishes'
                +'&excludedCourse[]=course^course-Breakfast and Brunch';
        }
        if(timeInHours >= 15 && timeInHours <18){
            console.log('Tea');
            this.recipeParam += '&allowedCourse[]=course^course-Appetizers'
                +'&allowedCourse[]=course^course-Salads'
                +'&allowedCourse[]=course^course-Soups'
                +'&excludedCourse[]=course^course-Lunch'
                +'&excludedCourse[]=course^course-Breakfast and Brunch';
            
        }
        if(timeInHours >= 18 && timeInHours <=21){
            console.log('Dinner');
           this.recipeParam += '&allowedCourse[]=course^course-Main Dishes'
            +'&allowedCourse[]=course^course-Appetizers'
            +'&excludedCourse[]=course^course-Lunch'
            +'&excludedCourse[]=course^course-Breakfast and Brunch'
            
        }
        if(timeInHours >=21){

           this.recipeParam += '&allowedCourse[]=course^course-Main Dishes'
            +'&allowedCourse[]=course^course-Desserts'
            +'&excludedCourse[]=course^course-Lunch'
            +'&excludedCourse[]=course^course-Breakfast and Brunch'
        }
        return this._recipeListService.getRecipe(this.recipeParam).subscribe(
                data => this.handleSuccess(data),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    testBoogaloo(query){
        for(let q of query){
            this.recipeIngredients.push(q.ingredients);
        }
        console.log(this.recipeIngredients);
    } 
    
    //Logs any errors to console
    handleError(error){
        console.log(error);
    }
    
    searchDetail(query: string, attributes:any){
        return this._recipeListService.getDetails(query).subscribe(
                data => this.handleDetails(data, attributes),
                error => this.handleError(error),
                () => console.log("Request Complete!"))
    }
    
    handleDetails(data, attributes){
        this.open(data, attributes)
    }
    
    open(query: any, attributes:any) {
        console.log(attributes.cuisine);
        
        const modalRef = this.modalService.open(NgbdModalContent, {size: 'lg'});
        this.recipeDetailsFound = true;
        this.largeImageDetails = query.images;
        var largeImage: any;
        console.log(query);
        for(let i of this.largeImageDetails){
            console.log(i.hostedLargeUrl)
            largeImage = i.hostedLargeUrl;
        }
        modalRef.componentInstance.recipe = query;
        modalRef.componentInstance.image = largeImage;  
      }
    
    help() {
        const modalRef = this.modalService.open(NgbdHelpContent, { size : 'lg' });
      }
    save(data) {
        this.isSaving = true;
        var today = new Date().toISOString().split("T")[0]; 
        this.shoppingList = new Shopping_List();
        this.shoppingList.items = data.ingredients_not_owned + "";
        if (this.shoppingList.id !== undefined) {
            this.subscribeToSaveResponse(
                this.shoppingListService.update(this.shoppingList));
        } else {
            this.subscribeToSaveResponse(
                this.shoppingListService.create(this.shoppingList));
        }
        
        this.alerts.push({
            id: 1,
            type: 'success',
            message: 'Missing ingredients for ' + data.recipeName+' have been added to a new shopping list'});
          
    }
    
    public closeAlert(alert: IAlert) {
        const index: number = this.alerts.indexOf(alert);
        this.alerts.splice(index, 1);
      }
    
    private subscribeToSaveResponse(result: Observable<Shopping_List>) {
        result.subscribe((res: Shopping_List) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }
    
    private onSaveSuccess(result: Shopping_List) {
        this.eventManager.broadcast({ name: 'shopping_ListListModification', content: 'OK'});
        this.isSaving = false;
    }
    
    private onSaveError() {
        this.isSaving = false;
    }
    

}

