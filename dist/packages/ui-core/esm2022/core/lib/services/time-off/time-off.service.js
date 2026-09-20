import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class TimeOffService {
    constructor(http) {
        this.http = http;
    }
    createPolicy(createInput) {
        return this.http.post(`${API_PREFIX}/time-off-policy`, createInput);
    }
    getAllPolicies(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return this.http.get(`${API_PREFIX}/time-off-policy`, { params: { data } });
    }
    updatePolicy(id, updateInput) {
        return this.http.put(`${API_PREFIX}/time-off-policy/${id}`, updateInput);
    }
    deletePolicy(id) {
        return this.http.delete(`${API_PREFIX}/time-off-policy/${id}`);
    }
    createRequest(timeOffRequest) {
        return this.http.post(`${API_PREFIX}/time-off-request`, timeOffRequest);
    }
    updateRequest(id, timeOffRequest) {
        return this.http.put(`${API_PREFIX}/time-off-request/${id}`, timeOffRequest);
    }
    getAllTimeOffRecords(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return this.http.get(`${API_PREFIX}/time-off-request`, { params: { data } });
    }
    updateRequestStatus(id, action) {
        return this.http.put(`${API_PREFIX}/time-off-request/${action}/${id}`, {});
    }
    deleteDaysOffRequest(id) {
        return this.http.delete(`${API_PREFIX}/time-off-request/${id}`);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeOffService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=time-off.service.js.map