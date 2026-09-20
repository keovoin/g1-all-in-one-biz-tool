import { DeleteResult, UpdateResult } from 'typeorm';
import { ID, IPagination, IRolePermission, IRolePermissions } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CreateRolePermissionDTO, UpdateRolePermissionDTO } from './dto';
import { RolePermission } from './role-permission.entity';
import { RolePermissionService } from './role-permission.service';
export declare class RolePermissionController extends CrudController<RolePermission> {
    private readonly _rolePermissionService;
    constructor(_rolePermissionService: RolePermissionService);
    /**
     * Import/Migrate role-permissions for specific tenant
     *
     * @param input
     * @returns
     */
    importRole(input: any): Promise<import("@gauzy/contracts").IImportRecord[]>;
    /**
     * Retrieves the permissions of the current user.
     *
     * @return {Promise<IPagination<RolePermission>>} A Promise that resolves to a paginated list of RolePermission objects.
     */
    findMePermissions(): Promise<IRolePermissions>;
    /**
     * GET role permissions for a specific tenant with pagination.
     *
     * @param {BaseQueryDTO<RolePermission>} query - The query parameters for pagination and filtering.
     * @returns {Promise<IPagination<IRolePermission>>} - Returns a promise that resolves to a paginated list of role permissions.
     */
    findAllRolePermissions(query: BaseQueryDTO<RolePermission>): Promise<IPagination<IRolePermission>>;
    /**
     * CREATE role permissions for specific tenant
     *
     * @param entity
     * @returns
     */
    create(entity: CreateRolePermissionDTO): Promise<IRolePermission>;
    /**
     * UPDATE role permissions for specific tenant
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateRolePermissionDTO): Promise<UpdateResult | IRolePermission>;
    /**
     * DELETE role permissions for specific tenant
     *
     * @param id
     * @returns
     */
    delete(id: ID): Promise<DeleteResult>;
}
