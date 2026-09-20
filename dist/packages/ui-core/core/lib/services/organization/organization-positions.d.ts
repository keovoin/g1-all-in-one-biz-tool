import { HttpClient } from '@angular/common/http';
import { IOrganizationPositionCreateInput, IOrganizationPosition, IOrganizationPositionFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationPositionsService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationPositionCreateInput): Promise<IOrganizationPosition>;
    getAll(findInput?: IOrganizationPositionFindInput, relations?: string[]): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationPositionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationPositionsService>;
}
