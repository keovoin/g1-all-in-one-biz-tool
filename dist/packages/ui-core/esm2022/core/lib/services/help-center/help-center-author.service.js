import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class HelpCenterAuthorService {
    constructor(http) {
        this.http = http;
    }
    createBulk(input) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/help-center-author/createBulk`, input));
    }
    findByArticleId(articleId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/help-center-author/article/${articleId}`));
    }
    deleteBulkByArticleId(articleId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/help-center-author/article/${articleId}`));
    }
    getAll(relations, findInput) {
        const data = JSON.stringify({ relations, findInput });
        return firstValueFrom(this.http.get(`${API_PREFIX}/help-center-author`, {
            params: { data }
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterAuthorService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterAuthorService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterAuthorService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=help-center-author.service.js.map