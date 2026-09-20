import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CandidateStatusEnum } from '@gauzy/contracts';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidatesService {
    constructor(http) {
        this.http = http;
    }
    getAll(relations = [], where) {
        return this.http.get(`${API_PREFIX}/candidate`, {
            params: toParams({ where, relations })
        });
    }
    getCandidateById(id, relations = [], where = {}) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate/${id}`, {
            params: toParams({ where, relations })
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate/${id}`));
    }
    update(id, body) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate/${id}`, body));
    }
    create(body) {
        return this.http.post(`${API_PREFIX}/candidate`, body);
    }
    createBulk(body) {
        return this.http.post(`${API_PREFIX}/candidate/bulk`, body);
    }
    /**
     * Set candidate as archived
     *
     * @param id
     * @param body
     * @returns
     */
    setCandidateAsArchived(id, input) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate/${id}`, {
            isArchived: true,
            ...input
        }));
    }
    /**
     * Set candidate hired as employee
     *
     * @param id
     * @returns
     */
    setCandidateAsHired(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate/${id}/hired`, {}));
    }
    /**
     * Set candidate as rejected application
     *
     * @param id
     * @returns
     */
    setCandidateAsRejected(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate/${id}/rejected`, {}));
    }
    /**
     * Set candidate as applied application
     *
     * @param id
     * @returns
     */
    setCandidateAsApplied(id) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate/${id}`, {
            status: CandidateStatusEnum.APPLIED
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidates.service.js.map