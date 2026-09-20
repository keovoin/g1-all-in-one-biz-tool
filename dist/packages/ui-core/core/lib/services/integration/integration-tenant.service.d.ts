import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIntegrationTenantFindInput, IIntegrationTenant, IPagination } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class IntegrationTenantService extends CrudService<IIntegrationTenant> {
    private readonly _http;
    static readonly API_URL = "/api/integration-tenant";
    constructor(_http: HttpClient);
    /**
     * Get a list of IntegrationTenant entities based on specified criteria and optional relations.
     *
     * @param where - The criteria to filter IntegrationTenant entities.
     * @param relations - Optional relations to include in the response.
     * @returns An Observable of IPagination<IIntegrationTenant>.
     */
    getAll(where: IIntegrationTenantFindInput, relations?: string[]): Observable<IPagination<IIntegrationTenant>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<IntegrationTenantService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<IntegrationTenantService>;
}
