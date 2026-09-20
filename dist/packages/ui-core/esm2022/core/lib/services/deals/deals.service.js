import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { Service } from '../crud/service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class DealsService extends Service {
    constructor(http) {
        super({ http, basePath: `${API_PREFIX}/deals` });
        this.http = http;
    }
    /**
     * Fetch all deals with optional relations and filter conditions
     *
     * @param relations Array of relation names to include in the result
     * @param where Filter conditions for fetching deals
     * @returns A promise of paginated deals
     */
    getAll(relations, where) {
        return firstValueFrom(this.http.get(`${this.basePath}`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Fetch a deal by its ID with optional relations and filter conditions
     *
     * @param id The ID of the deal to fetch
     * @param where Filter conditions for fetching the deal
     * @param relations Array of relation names to include in the result
     * @returns A promise of the fetched deal
     */
    getById(id, where, relations = []) {
        return firstValueFrom(this.http.get(`${this.basePath}/${id}`, {
            params: toParams({ where, relations })
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DealsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DealsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DealsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=deals.service.js.map