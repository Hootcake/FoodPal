import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class RecipeListService{
    private query: string;
    private API_KEY: string = 
        '44fa9c8a86df0132b658b7b8556058c6';
    private API_URL: string = 
        'http://api.yummly.com/v1/api/recipes?_app_id=eb1cba50&_app_key=';
    private URL: string =
      this.API_URL 
    + this.API_KEY;

    constructor(private _http: Http){
        
    }
    
    getRecipe(query){
        var recipe = this.URL + query;
        return this._http.get(recipe).map(res => res.json());
    }
    
    getDetails(query){
        return this._http.get('http://api.yummly.com/v1/api/recipe/'
                + query + '?&_app_id=eb1cba50&_app_key=44fa9c8a86df0132b658b7b8556058c6').map(res => res.json())
    }

}
