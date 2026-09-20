import { HttpClient } from '@angular/common/http';
import { IOrganizationAwardCreateInput, IOrganizationAward, IOrganizationAwardFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationAwardsService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationAwardCreateInput): Promise<IOrganizationAward>;
    getAll(findInput?: IOrganizationAwardFindInput, relations?: string[]): Promise<{
        items: IOrganizationAward[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationAwardsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationAwardsService>;
}
