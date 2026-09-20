import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TimesheetStatisticsService {
    constructor(http) {
        this.http = http;
    }
    getCounts(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/counts`, {
            params: toParams(request)
        }));
    }
    getTimeSlots(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/time-slots`, {
            params: toParams(request)
        }));
    }
    getActivities(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/activities`, {
            params: toParams(request)
        }));
    }
    /**
     * Get tasks statistics via POST request
     *
     * @param input - The input parameters for fetching tasks statistics
     * @returns
     */
    getTasksStatistics(input) {
        // Fetch tasks statistics via POST request
        return firstValueFrom(this.http.post(`${API_PREFIX}/timesheet/statistics/tasks`, input));
    }
    getManualTimes(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/manual-times`, {
            params: toParams(request)
        }));
    }
    getProjects(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/projects`, {
            params: toParams(request)
        }));
    }
    getMembers(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/statistics/members`, {
            params: toParams(request)
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetStatisticsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=timesheet-statistics.service.js.map