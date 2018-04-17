import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Shopping_List } from './shopping-list.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class Shopping_ListService {

    private resourceUrl =  SERVER_API_URL + 'api/shopping-lists';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/shopping-lists';

    constructor(private http: Http) { }

    create(shopping_List: Shopping_List): Observable<Shopping_List> {
        const copy = this.convert(shopping_List);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(shopping_List: Shopping_List): Observable<Shopping_List> {
        const copy = this.convert(shopping_List);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Shopping_List> {
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
     * Convert a returned JSON object to Shopping_List.
     */
    private convertItemFromServer(json: any): Shopping_List {
        const entity: Shopping_List = Object.assign(new Shopping_List(), json);
        return entity;
    }

    /**
     * Convert a Shopping_List to a JSON which can be sent to the server.
     */
    private convert(shopping_List: Shopping_List): Shopping_List {
        const copy: Shopping_List = Object.assign({}, shopping_List);
        return copy;
    }
}
