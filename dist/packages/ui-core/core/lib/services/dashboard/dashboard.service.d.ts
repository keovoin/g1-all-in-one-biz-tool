import { HttpClient } from '@angular/common/http';
import { ID, IDashboard, IDashboardCreateInput, IDashboardUpdateInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
/**
 * API client for the `/api/dashboard` endpoints (custom user dashboards).
 */
export declare class DashboardService {
    private readonly http;
    DASHBOARD_URL: string;
    constructor(http: HttpClient);
    /**
     * Retrieves dashboards matching the provided find options.
     *
     * @param params - Find options (e.g. `{ where: { organizationId, tenantId, createdByUserId } }`).
     * @returns A promise resolving to the paginated list of dashboards.
     */
    findAll(params?: any): Promise<IPagination<IDashboard>>;
    /**
     * Retrieves a single dashboard by its ID.
     *
     * @param id - The dashboard ID.
     * @param params - Optional additional find options.
     * @returns A promise resolving to the dashboard.
     */
    findById(id: ID, params?: any): Promise<IDashboard>;
    /**
     * Creates a new dashboard.
     *
     * @param input - The dashboard creation input.
     * @returns A promise resolving to the created dashboard.
     */
    create(input: IDashboardCreateInput): Promise<IDashboard>;
    /**
     * Updates an existing dashboard.
     *
     * @param id - The dashboard ID.
     * @param input - The dashboard update input.
     * @returns A promise resolving to the updated dashboard.
     */
    update(id: ID, input: IDashboardUpdateInput): Promise<IDashboard>;
    /**
     * Deletes a dashboard by its ID.
     *
     * @param id - The dashboard ID.
     * @returns A promise resolving when the dashboard is deleted.
     */
    delete(id: ID): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DashboardService>;
}
