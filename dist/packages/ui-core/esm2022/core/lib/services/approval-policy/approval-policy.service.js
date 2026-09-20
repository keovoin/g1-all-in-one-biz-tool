import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ApprovalPolicyService {
    constructor(http) {
        this.http = http;
        this.APPROVAL_POLICY_URL = `${API_PREFIX}/approval-policy`;
    }
    getAll(relations, where) {
        return firstValueFrom(this.http.get(`${this.APPROVAL_POLICY_URL}`, {
            params: toParams({
                where,
                relations
            })
        }));
    }
    getForRequestApproval(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${this.APPROVAL_POLICY_URL}/request-approval`, {
            params: { data }
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.APPROVAL_POLICY_URL}/${id}`));
    }
    save(approvalPolicy) {
        if (!approvalPolicy.id) {
            return firstValueFrom(this.http.post(this.APPROVAL_POLICY_URL, approvalPolicy));
        }
        else {
            return firstValueFrom(this.http.put(`${this.APPROVAL_POLICY_URL}/${approvalPolicy.id}`, approvalPolicy));
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ApprovalPolicyService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=approval-policy.service.js.map