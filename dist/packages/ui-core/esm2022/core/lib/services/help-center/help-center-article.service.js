import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class HelpCenterArticleService {
    constructor(http) {
        this.http = http;
    }
    create(createInput) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/help-center-article`, createInput));
    }
    findByCategoryId(categoryId) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/help-center-article/category/${categoryId}`));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/help-center-article/${id}`, updateInput));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/help-center-article/${id}`));
    }
    deleteBulkByCategoryId(categoryId) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/help-center-article/category/${categoryId}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterArticleService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterArticleService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HelpCenterArticleService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=help-center-article.service.js.map