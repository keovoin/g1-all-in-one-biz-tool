import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateInterviewersService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-interviewers`, createInput));
    }
    createBulk(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-interviewers/bulk`, createInput));
    }
    getAll(findInput) {
        const data = JSON.stringify({ findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-interviewers`, {
            params: { data }
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-interviewers/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-interviewers/${id}`));
    }
    findByInterviewId(interviewId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-interviewers/interview/${interviewId}`));
    }
    deleteBulkByInterviewId(interviewId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-interviewers/interview/${interviewId}`));
    }
    deleteBulkByEmployeeId(deleteInput) {
        const data = JSON.stringify({ deleteInput });
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-interviewers/deleteBulkByEmployeeId`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewersService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewersService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateInterviewersService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-interviewers.service.js.map