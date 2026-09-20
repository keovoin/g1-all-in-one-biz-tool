import { HttpClient } from '@angular/common/http';
import { IProductVariantSetting } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductVariantSettingService {
    private readonly http;
    PRODUCT_VARIANT_SETTINGS_URL: string;
    constructor(http: HttpClient);
    updateProductVariantSetting(productVariantSetting: IProductVariantSetting): Promise<IProductVariantSetting>;
    getProductVariantSettings(): Promise<IProductVariantSetting[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductVariantSettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductVariantSettingService>;
}
