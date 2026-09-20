import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ExportAllService {
    constructor(http) {
        this.http = http;
    }
    downloadAllData() {
        return this.http.get(`${API_PREFIX}/download`, {
            responseType: 'blob'
        });
    }
    downloadExportTemplates() {
        return this.http.get(`${API_PREFIX}/export/template`, {
            responseType: 'blob'
        });
    }
    downloadSpecificTable(names) {
        const data = JSON.stringify({ entities: { names } });
        if (!names)
            return;
        return this.http.get(`${API_PREFIX}/export/filter`, {
            responseType: 'blob',
            params: { data }
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExportAllService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExportAllService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExportAllService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=export-all.service.js.map