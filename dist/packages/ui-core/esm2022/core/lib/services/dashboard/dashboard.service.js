import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
/**
 * API client for the `/api/dashboard` endpoints (custom user dashboards).
 */
export class DashboardService {
    constructor(http) {
        this.http = http;
        this.DASHBOARD_URL = `${API_PREFIX}/dashboard`;
    }
    /**
     * Retrieves dashboards matching the provided find options.
     *
     * @param params - Find options (e.g. `{ where: { organizationId, tenantId, createdByUserId } }`).
     * @returns A promise resolving to the paginated list of dashboards.
     */
    findAll(params) {
        return firstValueFrom(this.http.get(this.DASHBOARD_URL, {
            params: toParams(params)
        }));
    }
    /**
     * Retrieves a single dashboard by its ID.
     *
     * @param id - The dashboard ID.
     * @param params - Optional additional find options.
     * @returns A promise resolving to the dashboard.
     */
    findById(id, params) {
        return firstValueFrom(this.http.get(`${this.DASHBOARD_URL}/${id}`, {
            // The endpoint's BaseQueryDTO rejects an empty `where`,
            // so always send at least the id filter.
            params: toParams(params ?? { where: { id } })
        }));
    }
    /**
     * Creates a new dashboard.
     *
     * @param input - The dashboard creation input.
     * @returns A promise resolving to the created dashboard.
     */
    create(input) {
        return firstValueFrom(this.http.post(this.DASHBOARD_URL, input));
    }
    /**
     * Updates an existing dashboard.
     *
     * @param id - The dashboard ID.
     * @param input - The dashboard update input.
     * @returns A promise resolving to the updated dashboard.
     */
    update(id, input) {
        return firstValueFrom(this.http.put(`${this.DASHBOARD_URL}/${id}`, input));
    }
    /**
     * Deletes a dashboard by its ID.
     *
     * @param id - The dashboard ID.
     * @returns A promise resolving when the dashboard is deleted.
     */
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.DASHBOARD_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DashboardService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=dashboard.service.js.map