import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProductVariantService {
    constructor(http) {
        this.http = http;
        this.PRODUCT_VARIANTS_URL = `${API_PREFIX}/product-variants`;
    }
    getVariantsByProductId(productId) {
        return firstValueFrom(this.http.get(`${this.PRODUCT_VARIANTS_URL}/product/${productId}`));
    }
    getProductVariant(id) {
        return firstValueFrom(this.http.get(`${this.PRODUCT_VARIANTS_URL}/${id}`));
    }
    createProductVariants(variantCreateInput) {
        return firstValueFrom(this.http.post(`${this.PRODUCT_VARIANTS_URL}/variants`, variantCreateInput));
    }
    updateProductVariant(productVariant) {
        return firstValueFrom(this.http.put(`${this.PRODUCT_VARIANTS_URL}/${productVariant.id}`, productVariant));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCT_VARIANTS_URL}/${id}`));
    }
    deleteFeaturedImage(id) {
        return firstValueFrom(this.http.delete(`${this.PRODUCT_VARIANTS_URL}/featured-image/${id}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=product-variant.service.js.map