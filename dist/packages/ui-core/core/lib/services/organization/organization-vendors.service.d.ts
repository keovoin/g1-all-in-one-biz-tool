import { HttpClient } from '@angular/common/http';
import { IOrganizationVendorCreateInput, IOrganizationVendor, IOrganizationVendorFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationVendorsService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationVendorCreateInput): Promise<IOrganizationVendor>;
    getAll(findInput?: IOrganizationVendorFindInput, relations?: string[], order?: {}): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: IOrganizationVendorCreateInput): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationVendorsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationVendorsService>;
}
