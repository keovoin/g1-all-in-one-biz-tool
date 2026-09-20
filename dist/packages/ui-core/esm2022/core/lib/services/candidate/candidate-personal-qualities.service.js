import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidatePersonalQualitiesService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-personal-qualities`, createInput));
    }
    createBulk(interviewId, personalQualities) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-personal-qualities/bulk`, {
            interviewId,
            personalQualities
        }));
    }
    getAll(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-personal-qualities`, {
            params: { data }
        }));
    }
    findByInterviewId(interviewId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-personal-qualities/interview/${interviewId}`));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-personal-qualities/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-personal-qualities/${id}`));
    }
    deleteBulkByInterviewId(id, personalQualities) {
        const data = JSON.stringify({ personalQualities });
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-personal-qualities/bulk/${id}`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatePersonalQualitiesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatePersonalQualitiesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidatePersonalQualitiesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-personal-qualities.service.js.map