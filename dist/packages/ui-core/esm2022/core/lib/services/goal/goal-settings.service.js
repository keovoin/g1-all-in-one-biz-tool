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
export class GoalSettingsService {
    constructor(_http, toastrService) {
        this._http = _http;
        this.toastrService = toastrService;
        this.TIME_FRAME_URL = `${API_PREFIX}/goal-time-frame`;
        this.KPI_URL = `${API_PREFIX}/goal-kpi`;
        this.GENERAL_SETTINGS_URL = `${API_PREFIX}/goal-general-setting`;
    }
    // Goal Time Frame
    createTimeFrame(timeFrame) {
        return firstValueFrom(this._http.post(`${this.TIME_FRAME_URL}`, timeFrame));
    }
    getAllTimeFrames(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this._http
            .get(`${this.TIME_FRAME_URL}`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    deleteTimeFrame(id) {
        return firstValueFrom(this._http.delete(`${this.TIME_FRAME_URL}/${id}`));
    }
    updateTimeFrame(id, goalTimeFrame) {
        return firstValueFrom(this._http.put(`${this.TIME_FRAME_URL}/${id}`, goalTimeFrame));
    }
    // KPI
    createKPI(kpi) {
        return firstValueFrom(this._http.post(`${this.KPI_URL}`, kpi));
    }
    getAllKPI(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this._http
            .get(`${this.KPI_URL}`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    deleteKPI(id) {
        return firstValueFrom(this._http.delete(`${this.KPI_URL}/${id}`));
    }
    updateKPI(id, kpiData) {
        return firstValueFrom(this._http.put(`${this.KPI_URL}/${id}`, kpiData));
    }
    // General Goal Settings
    getAllGeneralSettings(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this._http
            .get(`${this.GENERAL_SETTINGS_URL}`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    updateGeneralSettings(id, generalSettingData) {
        return firstValueFrom(this._http.put(`${this.GENERAL_SETTINGS_URL}/${id}`, generalSettingData));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, 'Error');
        return throwError(error.message);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalSettingsService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalSettingsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GoalSettingsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }] });
//# sourceMappingURL=goal-settings.service.js.map