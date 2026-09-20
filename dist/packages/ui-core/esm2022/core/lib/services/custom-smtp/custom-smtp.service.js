import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class CustomSmtpService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/smtp`;
    }
    saveSMTPSetting(request) {
        return firstValueFrom(this.http.post(`${this.API_URL}`, request));
    }
    updateSMTPSetting(id, request) {
        return firstValueFrom(this.http.put(`${this.API_URL}/${id}`, request));
    }
    getSMTPSetting(request) {
        return firstValueFrom(this.http.get(`${this.API_URL}/setting`, {
            params: toParams(request)
        }));
    }
    validateSMTPSetting(request) {
        return firstValueFrom(this.http.post(`${this.API_URL}/validate`, request));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomSmtpService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomSmtpService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: CustomSmtpService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=custom-smtp.service.js.map