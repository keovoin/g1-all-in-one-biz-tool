import { HttpClient } from '@angular/common/http';
import { IOrganizationContactCreateInput, IOrganizationContact, IOrganizationContactFindInput, IEditEntityByMemberInput, IOrganizationContactUpdateInput, IEmployee } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationContactService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Create organization contact
     *
     * @param input
     * @returns
     */
    create(input: IOrganizationContactCreateInput): Promise<IOrganizationContact>;
    /**
     * Update organization contact
     *
     * @param id
     * @param input
     * @returns
     */
    update(id: IOrganizationContact['id'], input: IOrganizationContactUpdateInput): Promise<IOrganizationContact>;
    getAllByEmployee(id: IEmployee['id'], where?: IOrganizationContactFindInput): Promise<IOrganizationContact[]>;
    getById(id: string, tenantId: string, relations?: string[]): Promise<IOrganizationContact>;
    getAll(relations?: string[], findInput?: IOrganizationContactFindInput): Promise<{
        items: any[];
        total: number;
    }>;
    getByName(relations?: string[], findInput?: string): Promise<IOrganizationContactFindInput>;
    updateByEmployee(updateInput: IEditEntityByMemberInput): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationContactService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationContactService>;
}
