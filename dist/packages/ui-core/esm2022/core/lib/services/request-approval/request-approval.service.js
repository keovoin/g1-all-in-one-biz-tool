import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class RequestApprovalService {
    constructor(http) {
        this.http = http;
        this.REQUESTS_APPROVAL_URL = `${API_PREFIX}/request-approval`;
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${this.REQUESTS_APPROVAL_URL}`, {
            params: { data }
        }));
    }
    getByEmployeeId(id, relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${this.REQUESTS_APPROVAL_URL}/employee/${id}`, {
            params: { data }
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.REQUESTS_APPROVAL_URL}/${id}`));
    }
    save(requestApproval) {
        if (!requestApproval.id) {
            return firstValueFrom(this.http.post(this.REQUESTS_APPROVAL_URL, requestApproval));
        }
        else {
            return firstValueFrom(this.http.put(`${this.REQUESTS_APPROVAL_URL}/${requestApproval.id}`, requestApproval));
        }
    }
    approvalRequestByAdmin(id) {
        return firstValueFrom(this.http.put(`${this.REQUESTS_APPROVAL_URL}/approval/${id}`, null));
    }
    refuseRequestByAdmin(id) {
        return firstValueFrom(this.http.put(`${this.REQUESTS_APPROVAL_URL}/refuse/${id}`, null));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RequestApprovalService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=request-approval.service.js.map