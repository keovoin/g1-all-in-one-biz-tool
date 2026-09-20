import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ActivityService {
    constructor(http) {
        this.http = http;
    }
    getActivities(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/activity`, {
            params: toParams(request)
        }));
    }
    getDailyActivities(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/activity/daily`, {
            params: toParams(request)
        }));
    }
    getDailyActivitiesReport(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/activity/report`, {
            params: toParams(request)
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=activity.service.js.map