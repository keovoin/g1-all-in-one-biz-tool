import { HttpClient } from '@angular/common/http';
import { IProductVariantPrice } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductVariantPriceService {
    private http;
    PRODUCT_VARIANT_PRICE_URL: string;
    constructor(http: HttpClient);
    updateProductVariantPrice(productVariantPrice: IProductVariantPrice): Promise<IProductVariantPrice>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductVariantPriceService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductVariantPriceService>;
}
