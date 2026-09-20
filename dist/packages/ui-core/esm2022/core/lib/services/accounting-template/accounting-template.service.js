import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AccountingTemplateService {
    constructor(http) {
        this.http = http;
    }
    getAll(relations, where) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/accounting-template`, {
            params: toParams({ where, relations })
        }));
    }
    getById(id) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/accounting-template/${id}`));
    }
    getTemplate(request) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/accounting-template/template`, {
            params: toParams({ ...request })
        }));
    }
    generateTemplatePreview(request) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/accounting-template/template/preview`, {
            request
        }));
    }
    saveTemplate(data) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/accounting-template/template/save`, {
            ...data
        }));
    }
    updateTemplate(id, data) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/accounting-template/${id}`, data));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AccountingTemplateService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AccountingTemplateService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AccountingTemplateService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=accounting-template.service.js.map