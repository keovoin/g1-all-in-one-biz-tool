import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
export class KeyResultService {
    constructor(_http, toastrService) {
        this._http = _http;
        this.toastrService = toastrService;
        this.API_URL = `${API_PREFIX}/key-results`;
    }
    createKeyResult(keyResult) {
        return firstValueFrom(this._http
            .post(`${this.API_URL}`, keyResult)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    createBulkKeyResult(keyResults) {
        return firstValueFrom(this._http
            .post(`${this.API_URL}/bulk`, keyResults)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    async update(id, keyResult) {
        return firstValueFrom(this._http.put(`${this.API_URL}/${id}`, keyResult));
    }
    findKeyResult(id) {
        return firstValueFrom(this._http
            .get(`${this.API_URL}/${id}`)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    getAllKeyResults(keyResult) {
        return this._http
            .get(`${this.API_URL}/${keyResult}`)
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    delete(id) {
        return firstValueFrom(this._http.delete(`${this.API_URL}/${id}`));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, 'Error');
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KeyResultService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KeyResultService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: KeyResultService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }] });
//# sourceMappingURL=keyresult.service.js.map