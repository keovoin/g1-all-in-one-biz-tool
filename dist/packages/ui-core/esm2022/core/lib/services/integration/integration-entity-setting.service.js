import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class IntegrationEntitySettingService {
    constructor(_http) {
        this._http = _http;
    }
    /**
     * Retrieve entity settings for a given integration.
     * @param integrationId - The ID of the integration.
     * @returns An observable of entity settings.
     */
    getEntitySettings(integrationId) {
        const url = `${API_PREFIX}/integration-entity-setting/integration/${integrationId}`;
        return this._http.get(url);
    }
    /**
     * Update entity settings for a given integration.
     * @param integrationId - The ID of the integration.
     * @param settings - The entity settings to update.
     * @returns An observable of updated entity settings.
     */
    updateEntitySettings(integrationId, settings) {
        const url = `${API_PREFIX}/integration-entity-setting/integration/${integrationId}`;
        return this._http.put(url, settings);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationEntitySettingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=integration-entity-setting.service.js.map