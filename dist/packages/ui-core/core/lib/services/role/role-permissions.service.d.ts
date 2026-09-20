import { HttpClient } from '@angular/common/http';
import { ID, IPagination, IRolePermission, IRolePermissionCreateInput, IRolePermissionFindInput, IRolePermissionUpdateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class RolePermissionsService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Retrieves role permissions based on the specified filter criteria.
     *
     * @param {IRolePermissionFindInput} [where] - An optional filter object used to specify the criteria for retrieving role permissions.
     * @returns {Promise<IPagination<IRolePermission>>} - Returns a promise that resolves to a pagination object containing the role permissions.
     */
    getRolePermissions(where?: IRolePermissionFindInput): Promise<IPagination<IRolePermission>>;
    /**
     * Creates a new role permission.
     *
     * @param input - The input data for creating the role permission.
     * @returns A promise that resolves to the created role permission.
     */
    create(input: IRolePermissionCreateInput): Promise<IRolePermission>;
    /**
     * Updates an existing role permission.
     *
     * @param id - The ID of the role permission to update.
     * @param input - The input data for updating the role permission.
     * @returns A promise that resolves to the updated role permission.
     */
    update(id: ID, input: IRolePermissionUpdateInput): Promise<IRolePermission>;
    static ɵfac: i0.ɵɵFactoryDeclaration<RolePermissionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RolePermissionsService>;
}
