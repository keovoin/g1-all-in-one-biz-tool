import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIntegrationAICreateInput, IIntegrationTenant } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class GauzyAIService extends CrudService<IIntegrationTenant> {
    readonly _http: HttpClient;
    static readonly API_URL = "/api/integration/ai";
    constructor(_http: HttpClient);
    /**
     * Create a new integration AI.
     *
     * @param input - Data for creating the integration AI, of type IIntegrationAICreateInput.
     * @returns An Observable of type IIntegrationTenant representing the created integration AI.
     */
    create(input: IIntegrationAICreateInput): Observable<IIntegrationTenant>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyAIService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GauzyAIService>;
}
