import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { Service } from '../crud/service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class PipelinesService extends Service {
    constructor(http) {
        super({ http, basePath: `${API_PREFIX}/pipelines` });
        this.http = http;
    }
    /**
     * Fetches all pipelines with optional relations and filtering conditions.
     *
     * @param relations - An optional array of relation names to include in the response.
     * @param where - Optional filtering conditions.
     * @returns A promise that resolves with the paginated pipelines.
     */
    getAll(relations, where) {
        return firstValueFrom(this.http.get(`${this.basePath}`, {
            params: toParams({ where, relations })
        }));
    }
    /**
     * Fetches a pipeline by its ID with optional relations.
     *
     * @param id - The ID of the pipeline to fetch.
     * @param relations - An array of relation names to include in the response.
     * @returns A promise that resolves with the pipeline.
     */
    getById(id, where, relations = []) {
        return this.http.get(`${this.basePath}/${id}`, {
            params: toParams({ where, relations })
        });
    }
    /**
     * Find deals associated with a specific pipeline
     *
     * @param pipelineId The ID of the pipeline
     * @param where Filter conditions for fetching the deals
     * @returns A promise of paginated deals
     */
    getPipelineDeals(pipelineId, where, relations = []) {
        return firstValueFrom(this.http.get(`${this.basePath}/${pipelineId}/deals`, {
            params: toParams({ where, relations })
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipelinesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipelinesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PipelinesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=pipelines.service.js.map