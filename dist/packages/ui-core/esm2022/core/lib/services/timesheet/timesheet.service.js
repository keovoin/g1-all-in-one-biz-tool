import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TimesheetService {
    constructor(http) {
        this.http = http;
        this._updateLog$ = new BehaviorSubject(false);
        this.updateLog$ = this._updateLog$.asObservable();
    }
    updateLogs(value) {
        this._updateLog$.next(value);
    }
    addTime(request) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/timesheet/time-log`, request));
    }
    updateTime(id, request) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/timesheet/time-log/` + id, request));
    }
    checkOverlaps(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/conflict`, {
            params: toParams(request)
        }));
    }
    /**
     * Fetches a timesheet by its ID.
     *
     * @param id - The ID of the timesheet to retrieve.
     * @returns An observable of the timesheet data.
     */
    getTimeSheetById(id) {
        return this.http.get(`${API_PREFIX}/timesheet/${id}`);
    }
    getTimeSheets(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet`, { params: toParams(request) })).then((data) => {
            return data;
        });
    }
    getTimeSheetCount(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/count`, { params: toParams(request) })).then((data) => {
            return data;
        });
    }
    updateStatus(request) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/timesheet/status`, {
            ...request
        }));
    }
    submitTimesheet(request) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/timesheet/submit`, {
            ...request
        }));
    }
    getTimeLogs(request, relations = []) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log`, {
            params: toParams({ ...request, relations })
        }));
    }
    /**
     * Fetches daily report data based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the daily report data.
     */
    async getDailyReport(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        // Fetch the daily report data
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/report/daily`, { params }));
    }
    /**
     * Fetches daily report chart data based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the daily report chart data.
     */
    async getDailyReportChart(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/report/daily-chart`, { params }));
    }
    /**
     * Retrieves the amount owed report based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the amount owed report data.
     */
    async getOwedAmountReport(request = {}) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/report/owed-report`, { params }));
    }
    /**
     * Retrieves chart data for the owed amount report based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the chart data for the owed amount report.
     */
    async getOwedAmountReportChartData(request = {}) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/report/owed-charts`, { params }));
    }
    /**
     * Fetches weekly report chart data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the weekly report chart data.
     */
    async getWeeklyReportChart(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/report/weekly`, { params }));
    }
    /**
     * Fetches time limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLimitReportInput).
     * @returns A Promise that resolves to the time limit report data.
     */
    async getTimeLimit(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/time-limit`, { params }));
    }
    /**
     * Fetches project budget limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the project budget limit report data.
     */
    async getProjectBudgetLimit(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/project-budget-limit`, {
            params
        }));
    }
    /**
     * Fetches client budget limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the client budget limit report data.
     */
    async getClientBudgetLimit(request) {
        // Convert the request parameters to URL query parameters
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/client-budget-limit`, {
            params
        }));
    }
    getTimeLog(id, findOptions) {
        const params = toParams(findOptions);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-log/${id}`, { params })).then((data) => {
            return data;
        });
    }
    getTimeSlot(id, request) {
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-slot/${id}`, {
            params
        }));
    }
    getTimeSlots(request) {
        const params = toParams(request);
        return firstValueFrom(this.http.get(`${API_PREFIX}/timesheet/time-slot`, { params }));
    }
    /**
     * Deletes multiple time slots based on the provided request.
     *
     * @param request - The request object containing parameters for deletion.
     * @returns A Promise that resolves when the time slots are deleted.
     */
    deleteTimeSlots(request) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/timesheet/time-slot`, {
            params: toParams(request)
        }));
    }
    deleteLogs(request) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/timesheet/time-log`, {
            params: toParams(request)
        }));
    }
    /**
     * Deletes a screenshot by its ID.
     *
     * @param id - The ID of the screenshot to delete.
     * @param params - The parameters that include tenant and organization context.
     * @returns A Promise that resolves to an object containing the result of the deletion.
     */
    deleteScreenshot(id, params) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/timesheet/screenshot/${id}`, {
            params: toParams(params)
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimesheetService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=timesheet.service.js.map