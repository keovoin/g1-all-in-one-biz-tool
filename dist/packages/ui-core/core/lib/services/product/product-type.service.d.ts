import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IBasePerTenantAndOrganizationEntityModel, IPagination, IProductTypeTranslatable, IProductTypeTranslated } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ProductTypeService {
    private http;
    PRODUCT_TYPES_URL: string;
    constructor(http: HttpClient);
    getById(id?: string): Promise<IProductTypeTranslatable>;
    getAll(options: any, params: any): Promise<{
        items: IProductTypeTranslatable[];
    }>;
    getAllTranslated(where: IBasePerTenantAndOrganizationEntityModel): Observable<IPagination<IProductTypeTranslated>>;
    create(productTypeRequest: IProductTypeTranslatable): Promise<IProductTypeTranslatable>;
    update(productTypeRequest: IProductTypeTranslatable): Promise<IProductTypeTranslatable>;
    delete(id: string): Promise<IProductTypeTranslatable>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProductTypeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ProductTypeService>;
}
