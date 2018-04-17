import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Inventory } from './inventory.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class InventoryService {

    private resourceUrl =  SERVER_API_URL + 'api/inventories';
    private resourceSearchUrl = SERVER_API_URL + 'api/_search/inventories';

    constructor(private http: Http) { }

    create(inventory: Inventory): Observable<Inventory> {
        const copy = this.convert(inventory);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    update(inventory: Inventory): Observable<Inventory> {
        const copy = this.convert(inventory);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            return this.convertItemFromServer(jsonResponse);
        });
    }

    find(id: number): Observable<Inventory> {
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
     * Convert a returned JSON object to Inventory.
     */
    private convertItemFromServer(json: any): Inventory {
        const entity: Inventory = Object.assign(new Inventory(), json);
        return entity;
    }

    /**
     * Convert a Inventory to a JSON which can be sent to the server.
     */
    private convert(inventory: Inventory): Inventory {
        const copy: Inventory = Object.assign({}, inventory);
        return copy;
    }
}
