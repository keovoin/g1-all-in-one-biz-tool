import { HttpClient } from '@angular/common/http';
import { IMerchant } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class MerchantService {
    private readonly http;
    MERCHANTS_URL: string;
    constructor(http: HttpClient);
    getById(id: IMerchant['id'], relations?: string[]): Promise<IMerchant>;
    create(productStore: IMerchant): Promise<IMerchant>;
    update(productStore: IMerchant): Promise<IMerchant>;
    delete(id: IMerchant['id']): Promise<IMerchant>;
    static ɵfac: i0.ɵɵFactoryDeclaration<MerchantService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MerchantService>;
}
