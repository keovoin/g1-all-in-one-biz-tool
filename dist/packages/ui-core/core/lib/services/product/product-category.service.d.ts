import { HttpClient } from '@angular/common/http';
import { IBasePerTenantAndOrganizationEntityModel, IPagination, IProductCategoryTranslatable, IProductCategoryTranslated } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ProductCategoryService {
    private http;
    PRODUCT_CATEGORY_URL: string;
    constructor(http: HttpClient);
    getById(id: string): Promise<IProductCategoryTranslatable>;
    getAllTranslated(where: IBasePerTenantAndOrganizationEntityModel): Observable<IPagination<IProductCategoryTranslated>>;
    create(productTypeRequest: IProductCategoryTranslatable): Promise<IProductCategoryTranslatable>;
    update(productTypeRequest: IProductCategoryTranslatable): Promise<IProductCategoryTranslatable>;
    delete(id: string): Promise<IProductCategoryTranslatable>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductCategoryService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductCategoryService>;
}
