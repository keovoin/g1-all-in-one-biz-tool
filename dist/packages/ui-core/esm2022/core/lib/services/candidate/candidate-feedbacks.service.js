import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateFeedbacksService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-feedbacks`, createInput));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-feedbacks`, {
            params: { data }
        }));
    }
    findById(id) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-feedbacks/${id}`));
    }
    findByInterviewId(interviewId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-feedbacks/interview/${interviewId}`));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-feedbacks/${id}`, updateInput));
    }
    delete(feedbackId, interviewId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-feedbacks/interview/${interviewId}/${feedbackId}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateFeedbacksService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateFeedbacksService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateFeedbacksService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-feedbacks.service.js.map