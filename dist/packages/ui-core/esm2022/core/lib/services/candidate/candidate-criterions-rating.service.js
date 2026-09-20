import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CandidateCriterionsRatingService {
    constructor(http) {
        this.http = http;
    }
    createBulk(feedbackId, technologies, qualities) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/candidate-criterions-rating/bulk`, {
            feedbackId,
            technologies,
            qualities
        }));
    }
    getAll() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/candidate-criterions-rating`));
    }
    updateBulk(criterionsRating, technologies, personalQualities) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/candidate-criterions-rating/bulk`, {
            criterionsRating,
            technologies,
            personalQualities
        }));
    }
    deleteBulkByFeedbackId(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/candidate-criterions-rating/feedback/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCriterionsRatingService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCriterionsRatingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CandidateCriterionsRatingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=candidate-criterions-rating.service.js.map