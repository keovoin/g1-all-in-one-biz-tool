import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
export class GoalService {
    constructor(_http, toastrService) {
        this._http = _http;
        this.toastrService = toastrService;
        this.API_URL = `${API_PREFIX}/goals`;
    }
    createGoal(goal) {
        return firstValueFrom(this._http.post(`${this.API_URL}`, goal).pipe(catchError((error) => this.errorHandler(error))));
    }
    update(id, goal) {
        return firstValueFrom(this._http.put(`${this.API_URL}/${id}`, goal));
    }
    getAllGoals(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this._http
            .get(`${this.API_URL}`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    delete(id) {
        return firstValueFrom(this._http.delete(`${this.API_URL}/${id}`));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, 'Error');
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }] });
//# sourceMappingURL=goal.service.js.map