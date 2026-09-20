import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrganization, IOrganizationCreateInput, IOrganizationFindInput, IOrganizationContactFindInput, IPagination, IOrganizationContact, IOptionsSelect } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class OrganizationsService {
    private readonly http;
    constructor(http: HttpClient);
    create(body: IOrganizationCreateInput): Promise<IOrganization>;
    update(id: IOrganization['id'], body: IOrganizationCreateInput): Promise<IOrganization>;
    delete(id: IOrganization['id']): Promise<any>;
    getAll(where: IOrganizationFindInput, relations?: string[]): Promise<IPagination<IOrganization>>;
    getById(id: IOrganization['id'], relations?: string[], select?: IOptionsSelect<IOrganization>): Observable<IOrganization>;
    /**
     * GET organization by profile link
     *
     * @param profile_link
     * @returns
     */
    getByProfileLink(profile_link: IOrganization['profile_link'], organizationId: IOrganization['id'], relations?: string[]): Observable<IOrganization>;
    /**
     * GET public clients by organization
     *
     * @param params
     * @returns
     */
    getAllPublicClients(params: IOrganizationContactFindInput): Observable<IPagination<IOrganizationContact>>;
    /**
     * GET public client counts by organization
     *
     * @param params
     * @returns
     */
    getAllPublicClientCounts(params: IOrganizationContactFindInput): Observable<number>;
    /**
     * GET public project counts by organization
     *
     * @param params
     * @returns
     */
    getAllPublicProjectCounts(params: IOrganizationContactFindInput): Observable<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationsService>;
}
