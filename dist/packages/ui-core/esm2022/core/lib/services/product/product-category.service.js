import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { toParams } from '@gauzy/ui-core/common';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProductCategoryService {
    constructor(http) {
        this.http = http;
        this.PRODUCT_CATEGORY_URL = `${API_PREFIX}/product-categories`;
    }
    getById(id) {
        return firstValueFrom(this.http.get(`${this.PRODUCT_CATEGORY_URL}/${id}`));
    }
    getAllTranslated(where) {
        return this.http.get(`${this.PRODUCT_CATEGORY_URL}`, {
            params: toParams({ where })
        });
    }
    create(productTypeRequest) {
        return firstValueFrom(this.http.post(`${this.PRODUCT_CATEGORY_URL}`, productTypeRequest));
    }
    update(productTypeRequest) {
        return firstValueFrom(this.http.put(`${this.PRODUCT_CATEGORY_URL}/${productTypeRequest.id}`, productTypeRequest));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCT_CATEGORY_URL}/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductCategoryService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=product-category.service.js.map