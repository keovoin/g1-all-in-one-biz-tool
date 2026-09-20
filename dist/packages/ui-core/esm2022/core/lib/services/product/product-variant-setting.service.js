import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class ProductVariantSettingService {
    constructor(http) {
        this.http = http;
        this.PRODUCT_VARIANT_SETTINGS_URL = `${API_PREFIX}/product-variant-settings`;
    }
    updateProductVariantSetting(productVariantSetting) {
        return firstValueFrom(this.http.put(`${this.PRODUCT_VARIANT_SETTINGS_URL}/${productVariantSetting.id}`, productVariantSetting));
    }
    getProductVariantSettings() {
        return firstValueFrom(this.http.get(this.PRODUCT_VARIANT_SETTINGS_URL));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantSettingService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantSettingService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProductVariantSettingService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=product-variant-setting.service.js.map