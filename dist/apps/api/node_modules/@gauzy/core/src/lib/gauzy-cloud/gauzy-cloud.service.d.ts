import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { IOrganizationCreateInput, ITenantCreateInput, IUserRegistrationInput, IRoleMigrateInput, ITenant, IRolePermissionMigrateInput, IUserLoginInput } from '@gauzy/contracts';
export declare class GauzyCloudService {
    private readonly _http;
    constructor(_http: HttpService);
    /**
     * Register a bare user on the remote cloud server for migration.
     *
     * Only sends the minimal fields needed for public self-registration
     * (password, confirmPassword, and safe user fields). Fields
     * like role, roleId, tenant, organizationId, createdByUserId are
     * intentionally stripped — they don't apply to the remote cloud
     * (which has its own role/tenant UUIDs).
     *
     * After registration, use extractToken() to log in and then
     * migrateTenant/migrateRoles/etc. to set up the cloud workspace.
     *
     * @param params - The full registration input from the local server.
     * @returns Observable of the remote server's registration response.
     */
    migrateUser(params: IUserRegistrationInput): Observable<AxiosResponse<any, any>>;
    /**
     * Extract Bearer Token from cloud server
     * Login user from local to cloud server
     *
     * @param params
     * @returns
     */
    extractToken(params: IUserLoginInput): Observable<AxiosResponse<any, any>>;
    /**
     * Migrate default tenant to the cloud server
     *
     * @param params
     * @param token
     * @returns
     */
    migrateTenant(params: ITenantCreateInput, token: string): Observable<AxiosResponse<any, any>>;
    /**
     * Migrate default organization to the cloud server
     *
     * @param params
     * @param token
     * @returns
     */
    migrateOrganization(params: IOrganizationCreateInput, token: string): Observable<AxiosResponse<any, any>>;
    /**
     * Migrate roles to the cloud server
     *
     * @param params
     * @param token
     * @param tenant
     * @returns
     */
    migrateRoles(params: IRoleMigrateInput[], token: string, tenant: ITenant): Observable<AxiosResponse<any, any>>;
    /**
     * Migrate role permissions to the cloud server
     *
     * @param params
     * @param token
     * @param tenant
     * @returns
     */
    migrateRolePermissions(params: IRolePermissionMigrateInput[], token: string, tenant: ITenant): Observable<AxiosResponse<any, any>>;
}
