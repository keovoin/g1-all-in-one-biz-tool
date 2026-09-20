import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class FeatureService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/feature/toggle`;
    }
    getFeatureToggleDefinition() {
        return firstValueFrom(this.http.get(`${this.API_URL}/definition`));
    }
    getParentFeatures(relations) {
        return this.http.get(`${this.API_URL}/parent`, {
            params: toParams({ relations })
        });
    }
    getAllFeatures() {
        return this.http.get(`${this.API_URL}`);
    }
    getFeatureOrganizations(where, relations) {
        return this.http.get(`${this.API_URL}/organizations`, {
            params: toParams({ relations, ...where })
        });
    }
    featureToggle(payload) {
        return this.http.post(`${this.API_URL}`, payload);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FeatureService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=feature.service.js.map