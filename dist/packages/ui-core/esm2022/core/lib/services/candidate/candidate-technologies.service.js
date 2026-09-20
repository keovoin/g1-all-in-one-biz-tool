import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateTechnologiesService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-technologies`, createInput));
    }
    createBulk(interviewId, technologies) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-technologies/bulk`, {
            interviewId,
            technologies
        }));
    }
    getAll(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-technologies`, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-technologies/${id}`, updateInput));
    }
    updateBulk(technologies) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-technologies/bulk`, technologies));
    }
    findByInterviewId(interviewId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-technologies/interview/${interviewId}`));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-technologies/${id}`));
    }
    deleteBulkByInterviewId(id, technologies) {
        const data = JSON.stringify({ technologies });
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-technologies/bulk/${id}`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateTechnologiesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateTechnologiesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateTechnologiesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-technologies.service.js.map