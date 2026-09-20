import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class JobSearchOccupationService {
    constructor(http) {
        this.http = http;
    }
    getAll(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/job-preset/job-search-occupation`, {
            params: request ? toParams(request) : {}
        }));
    }
    create(request) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/job-preset/job-search-occupation`, request));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchOccupationService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchOccupationService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchOccupationService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=job-search-occupation.service.js.map