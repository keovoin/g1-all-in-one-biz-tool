import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBaseRelationsEntityModel, ID, IIntegration, IIntegrationGroup, IIntegrationTenant, IIntegrationTenantFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class IntegrationsService {
    private readonly _http;
    constructor(_http: HttpClient);
    fetchIntegrations(integrationTypeId: string, searchQuery?: string, filter?: string | boolean): Observable<IIntegration[]>;
    fetchIntegrationGroups(): Observable<IIntegrationGroup[]>;
    /**
     * Retrieve an integration tenant by specified options.
     *
     * @param input - The input options for finding the integration tenant.
     * @returns The integration tenant if found, or `false` if not found or an error occurs.
     */
    getIntegrationByOptions(input: IIntegrationTenantFindInput): Observable<IIntegrationTenant>;
    /**
     * Get an IntegrationTenant by ID with optional relations.
     *
     * @param id - The ID of the IntegrationTenant.
     * @param relations - Optional relations for the request.
     * @returns {Observable<any>} An Observable of the HTTP response.
     */
    getIntegrationTenant(id: ID, relations: IBaseRelationsEntityModel): Observable<IIntegrationTenant>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntegrationsService>;
}
