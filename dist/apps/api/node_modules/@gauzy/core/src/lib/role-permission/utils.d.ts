import { QueryRunner } from 'typeorm';
/**
 * Role permissions utils functions.
 */
export declare class RolePermissionUtils {
    /**
     * Migrate role permissions
     * @param queryRunner - The QueryRunner instance
     */
    static migrateRolePermissions(queryRunner: QueryRunner): Promise<void>;
    /**
     * Get all tenants from the database
     * @param queryRunner - The QueryRunner instance
     * @returns A promise that resolves to an array of tenants
     */
    private static getAllTenants;
    /**
     * Get roles by tenant ID
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @returns A promise that resolves to an array of roles
     */
    private static getRolesByTenantId;
    /**
     * Get all permissions, excluding certain ones if in demo mode.
     * @returns An array of permissions.
     */
    private static getPermissions;
    /**
     * Get default role permissions
     * @param role - The role
     * @returns The default role permissions
     */
    private static getDefaultRolePermissions;
    /**
     * Check if the permission already exists
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @param roleId - The role ID
     * @param permission - The permission enum value
     * @returns A promise that resolves to a boolean indicating if the permission exists
     */
    private static checkPermissionExistence;
    /**
     * Get insert payload for role permission
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @param roleId - The role ID
     * @param permission - The permission enum value
     * @param isEnabled - Boolean indicating if the permission is enabled
     * @returns The payload array for the insert query
     */
    private static getInsertPayload;
    /**
     * Insert role permissions into the database
     * @param queryRunner - The QueryRunner instance
     * @param payload - The payload for the insert query
     */
    private static insertRolePermissions;
}
