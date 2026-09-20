import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
import * as i3 from "@ngx-translate/core";
export class SprintService extends TranslationBaseComponent {
    constructor(_http, toastrService, translateService) {
        super(translateService);
        this._http = _http;
        this.toastrService = toastrService;
        this.API_URL = `${API_PREFIX}/organization-sprint`;
    }
    getAllSprints(findInput = {}) {
        const data = JSON.stringify({
            relations: ['tasks'],
            findInput
        });
        return this._http
            .get(this.API_URL, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    getById(id) {
        return firstValueFrom(this._http.get(`${this.API_URL}/${id}`));
    }
    createSprint(sprint) {
        return this._http.post(this.API_URL, sprint).pipe(tap(() => {
            this.toastrService.success(this.getTranslation('SPRINTS_PAGE.SPRINT_ADDED'));
        }), catchError((error) => this.errorHandler(error)));
    }
    editSprint(sprintId, sprint) {
        return this._http.put(`${this.API_URL}/${sprintId}`, sprint).pipe(tap(() => this.toastrService.success(this.getTranslation('SPRINTS_PAGE.SPRINT_UPDATED'))), catchError((error) => this.errorHandler(error)));
    }
    deleteSprint(id) {
        return this._http.delete(`${this.API_URL}/${id}`).pipe(tap(() => this.toastrService.success(this.getTranslation('SPRINTS_PAGE.SPRINT_DELETED'))), catchError((error) => this.errorHandler(error)));
    }
    errorHandler(error) {
        this.toastrService.danger(error);
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }, { token: i3.TranslateService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }, { type: i3.TranslateService }] });
//# sourceMappingURL=organization-sprint.service.js.map