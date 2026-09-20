import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class EmailTemplateService {
    constructor(http) {
        this.http = http;
    }
    getAll(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/email-template`, {
            params: toParams({ where })
        }));
    }
    getTemplate(where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/email-template/template`, {
            params: toParams({ ...where })
        }));
    }
    generateTemplatePreview(data) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/email-template/template/preview`, {
            data
        }));
    }
    saveEmailTemplate(data) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/email-template/template/save`, {
            ...data
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailTemplateService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailTemplateService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailTemplateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=email-template.service.js.map