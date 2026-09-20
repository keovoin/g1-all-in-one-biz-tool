import { IProductVariant, IVariantCreateInput, IPagination } from '@gauzy/contracts';
import { HttpClient } from '@angular/common/http';
import * as i0 from "@angular/core";
export declare class ProductVariantService {
    private http;
    PRODUCT_VARIANTS_URL: string;
    constructor(http: HttpClient);
    getVariantsByProductId(productId: string): Promise<IPagination<IProductVariant>>;
    getProductVariant(id: string): Promise<IProductVariant>;
    createProductVariants(variantCreateInput: IVariantCreateInput): Promise<IProductVariant[]>;
    updateProductVariant(productVariant: IProductVariant): Promise<IProductVariant>;
    delete(id: string): Promise<any>;
    deleteFeaturedImage(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductVariantService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductVariantService>;
}
