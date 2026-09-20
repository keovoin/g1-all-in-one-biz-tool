import { HttpClient } from '@angular/common/http';
import { IEditEntityByMemberInput, IOrganizationDepartment, IOrganizationDepartmentCreateInput, IOrganizationDepartmentFindInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationDepartmentsService {
    private http;
    constructor(http: HttpClient);
    create(createInput: IOrganizationDepartmentCreateInput): Promise<IOrganizationDepartment>;
    getAllByEmployee(id: string): Promise<IOrganizationDepartment[]>;
    getAll(relations?: string[], findInput?: IOrganizationDepartmentFindInput, order?: {}): Promise<{
        items: any[];
        total: number;
    }>;
    update(id: string, updateInput: IOrganizationDepartmentCreateInput): Promise<any>;
    updateByEmployee(updateInput: IEditEntityByMemberInput): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationDepartmentsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationDepartmentsService>;
}
