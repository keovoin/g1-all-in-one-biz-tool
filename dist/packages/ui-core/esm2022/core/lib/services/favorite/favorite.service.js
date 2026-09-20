import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, catchError } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class FavoriteService {
    constructor(http) {
        this.http = http;
        this.FAVORITE_URL = `${API_PREFIX}/favorite`;
    }
    create(favorite) {
        return firstValueFrom(this.http.post(`${this.FAVORITE_URL}`, favorite).pipe(catchError((error) => {
            console.error('Error creating favorite:', error);
            throw new Error('Failed to create favorite');
        })));
    }
    findByEmployee(params) {
        return firstValueFrom(this.http
            .get(`${this.FAVORITE_URL}/employee`, {
            params: toParams(params)
        })
            .pipe(catchError((error) => {
            console.error('Error finding favorites by employee:', error);
            throw new Error('Failed to find favorites by employee');
        })));
    }
    getFavoriteDetails(params) {
        return firstValueFrom(this.http
            .get(`${this.FAVORITE_URL}/type`, {
            params: toParams(params)
        })
            .pipe(catchError((error) => {
            console.error('Error getting favorite details:', error);
            throw new Error('Failed to get favorite details');
        })));
    }
    findAll(params) {
        return firstValueFrom(this.http
            .get(`${this.FAVORITE_URL}`, {
            params: toParams(params)
        })
            .pipe(catchError((error) => {
            console.error('Error finding all favorites:', error);
            throw new Error('Failed to find all favorites');
        })));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.FAVORITE_URL}/${id}`).pipe(catchError((error) => {
            console.error('Error deleting favorite:', error);
            throw new Error('Failed to delete favorite');
        })));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FavoriteService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=favorite.service.js.map