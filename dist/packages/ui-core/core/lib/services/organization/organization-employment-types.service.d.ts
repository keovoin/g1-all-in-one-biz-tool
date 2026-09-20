import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganizationEmploymentType, IOrganizationEmploymentTypeFindInput, IOrganizationEmploymentTypeCreateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationEmploymentTypesService {
    private http;
    private readonly API_URL;
    constructor(http: HttpClient);
    getAllWithPagination(findInput?: IOrganizationEmploymentTypeFindInput, relations?: string[]): Promise<{
        items: any[];
        total: number;
    }>;
    getAll(relations?: string[], findInput?: IOrganizationEmploymentTypeFindInput): Observable<{
        items: IOrganizationEmploymentType[];
        total: number;
    }>;
    addEmploymentType(employmentType: IOrganizationEmploymentTypeCreateInput): Observable<IOrganizationEmploymentTypeCreateInput>;
    deleteEmploymentType(id: number): Promise<any>;
    editEmploymentType(id: string, updateInput: any): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationEmploymentTypesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationEmploymentTypesService>;
}
