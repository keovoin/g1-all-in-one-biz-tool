import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmployeeStatisticsService {
    constructor(http) {
        this.http = http;
    }
    /**
     * Gets the aggregated statistics for all employees of the organization from the start of time till now.
     * If date is provided in findInput it will return only for the month selected.
     */
    getAggregateStatisticsByOrganizationId(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/employee-statistics/aggregate`, {
            params: { data }
        }));
    }
    /**
     * Gets the statistics for the selected employee for the last 12 months.
     * If date is provided in findInput it will return only for the month selected.
     * @param employeeId The id of the employee.
     * @param findInput Object containing valueDate.
     * @returns Promise<EmployeeStatistics>
     */
    getStatisticsByEmployeeId(employeeId, findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/employee-statistics/months/${employeeId}`, {
            params: { data }
        }));
    }
    /**
     * Gets the statistics for the selected employee for the last N months.
     * @param findInput Object containing valueDate, employeeId, Months.
     * @returns Promise<MonthAggregatedEmployeeStatistics[]>
     */
    getAggregatedStatisticsByEmployeeId(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/employee-statistics/months`, {
            params: toParams({ ...where })
        }));
    }
    /**
     * Gets the statistics history for the selected employee for the last N months.
     * @param findInput Object containing valueDate, employeeId, Months and History Type.
     * @returns Promise<EmployeeStatisticsHistory[]
     */
    getEmployeeStatisticsHistory(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/employee-statistics/history`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmployeeStatisticsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=employee-statistics.service.js.map