import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Favorites } from './favorites.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class FavoritesService {

    private resourceUrl =  SERVER_API_URL + 'api/favorites';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/favorites';

    constructor(private http: Http) { }

    create(favorites: Favorites): Observable<Favorites> {
        const copy = this.convert(favorites);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(favorites: Favorites): Observable<Favorites> {
        const copy = this.convert(favorites);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Favorites> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: number): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    search(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceSearchUrl, options)
            .map((res: any) => this.convertResponse(res));
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        const result = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            result.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return new ResponseWrapper(res.headers, result, res.status);
    }

    /**
     * Convert a returned JSON object to Favorites.
     */
    private convertItemFromServer(json: any): Favorites {
        const entity: Favorites = Object.assign(new Favorites(), json);
        return entity;
    }

    /**
     * Convert a Favorites to a JSON which can be sent to the server.
     */
    private convert(favorites: Favorites): Favorites {
        const copy: Favorites = Object.assign({}, favorites);
        return copy;
    }
}
