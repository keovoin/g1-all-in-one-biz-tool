import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
export class GoalTemplatesService {
    constructor(_http, toastrService) {
        this._http = _http;
        this.toastrService = toastrService;
        this.GOAL_URL = `${API_PREFIX}/goal-templates`;
        this.KEYRESULT_URL = `${API_PREFIX}/key-result-templates`;
        this.GOAL_KPI_URL = `${API_PREFIX}/goal-kpi-template`;
    }
    createGoalTemplate(goalTemplate) {
        return firstValueFrom(this._http
            .post(`${this.GOAL_URL}`, goalTemplate)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    createKeyResultTemplate(keyResultTemplate) {
        return firstValueFrom(this._http
            .post(`${this.KEYRESULT_URL}`, keyResultTemplate)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    createGoalKpiTemplate(goalKpiTemplate) {
        return firstValueFrom(this._http
            .post(`${this.GOAL_KPI_URL}`, goalKpiTemplate)
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    getAllGoalTemplates(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this._http
            .get(`${this.GOAL_URL}`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, 'Error');
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalTemplatesService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }] });
//# sourceMappingURL=goal-templates.service.js.map