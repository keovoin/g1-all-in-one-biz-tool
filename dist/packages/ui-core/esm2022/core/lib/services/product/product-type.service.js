import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProductTypeService {
    constructor(http) {
        this.http = http;
        this.PRODUCT_TYPES_URL = `${API_PREFIX}/product-types`;
    }
    getById(id = '') {
        return firstValueFrom(this.http.get(`${this.PRODUCT_TYPES_URL}/${id}`));
    }
    getAll(options, params) {
        const data = JSON.stringify(options);
        return firstValueFrom(this.http.get(this.PRODUCT_TYPES_URL, {
            params: { data, ...params }
        }));
    }
    getAllTranslated(where) {
        return this.http.get(`${this.PRODUCT_TYPES_URL}`, {
            params: toParams({ where })
        });
    }
    create(productTypeRequest) {
        return firstValueFrom(this.http.post(`${this.PRODUCT_TYPES_URL}`, productTypeRequest));
    }
    update(productTypeRequest) {
        return firstValueFrom(this.http.put(`${this.PRODUCT_TYPES_URL}/${productTypeRequest.id}`, productTypeRequest));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCT_TYPES_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductTypeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=product-type.service.js.map