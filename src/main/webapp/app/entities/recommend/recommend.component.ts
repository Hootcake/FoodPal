import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';
import { Observable } from 'rxjs/Observable';

import { Recommend } from './recommend.model';
import { RecommendService } from './recommend.service';
import { Principal, ResponseWrapper, RecipeListService } from '../../shared';
import { InventoryService } from "../inventory/inventory.service";
import { Inventory } from "../inventory/inventory.model";
import { Shopping_ListService } from "../shopping-list/shopping-list.service";
import { Shopping_List } from "../shopping-list/shopping-list.model";
@Component({
    selector: 'jhi-recommend',
    templateUrl: './recommend.component.html'
})
export class RecommendComponent implements OnInit, OnDestroy {

    userInventory = new Array();
    categories = new Array();
    ingredientNames = new Array();
    //Important categories
    fruitInventory = new Array();
    vegInventory = new Array();
    meatInventory = new Array();
    grainInventory = new Array();
    //Query 
    isSaving: boolean;
    ingredients = new Array();
    recipeParam: string = "";
    recipeIngredients = new Array();
    testVar: Boolean = true;
    shoppingList: Shopping_List;
    itemCategory: Boolean = false;
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;
    choices = new Array();
    recipes: any[];
    recipeFound: boolean = false;
    
    constructor(
        private RecommendService: RecommendService,
        private inventoryService: InventoryService,
        private jhiAlertService: JhiAlertService,
        private shoppingListService: Shopping_ListService,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private _recipeListService: RecipeListService,
        private principal: Principal
    ) {
        this.currentSearch = this.activatedRoute.snapshot && this.activatedRoute.snapshot.params['search'] ?
            this.activatedRoute.snapshot.params['search'] : '';
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
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
      
        this.registerChangeInRecommends();

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
    
    test(){
        this.testVar = false;
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
    
    timelyRecipe(){
        var currentTime = new Date();
        console.log(currentTime.getHours());
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
