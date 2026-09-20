import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class GauzyAIService extends CrudService {
    static { this.API_URL = `${API_PREFIX}/integration/ai`; }
    constructor(_http) {
        super(_http, GauzyAIService.API_URL);
        this._http = _http;
    }
    /**
     * Create a new integration AI.
     *
     * @param input - Data for creating the integration AI, of type IIntegrationAICreateInput.
     * @returns An Observable of type IIntegrationTenant representing the created integration AI.
     */
    create(input) {
        return this._http.post(`${GauzyAIService.API_URL}`, input);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyAIService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyAIService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyAIService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=gauzy-ai.service.js.map