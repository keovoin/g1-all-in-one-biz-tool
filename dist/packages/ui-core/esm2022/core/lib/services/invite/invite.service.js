import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class InviteService {
    constructor(http) {
        this.http = http;
    }
    createWithEmails(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invite/emails`, createInput));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/invite`, {
            params: { data }
        }));
    }
    validateInvite(relations, where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/invite/validate`, {
            params: toParams({ ...where, relations })
        }));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invite/${id}`, updateInput));
    }
    acceptInvite(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invite/accept`, input));
    }
    resendInvite(inviteResendInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invite/resend`, inviteResendInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/invite/${id}`));
    }
    inviteOrganizationContact(organizationContactId) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/invite/organization-contact/${organizationContactId}`, {}));
    }
    acceptOrganizationContactInvite(acceptInviteInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/invite/contact`, acceptInviteInput));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InviteService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=invite.service.js.map