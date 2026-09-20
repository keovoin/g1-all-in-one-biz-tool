"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionUtils = void 0;
const uuid_1 = require("uuid");
const chalk = require("chalk");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const database_helper_1 = require("../database/database.helper");
const utils_2 = require("../core/utils");
const default_role_permissions_1 = require("./default-role-permissions");
/**
 * Role permissions utils functions.
 */
class RolePermissionUtils {
    /**
     * Migrate role permissions
     * @param queryRunner - The QueryRunner instance
     */
    static async migrateRolePermissions(queryRunner) {
        console.log(chalk.yellow('Starting migration of role permissions'));
        // Get all tenants from the database
        const tenants = await this.getAllTenants(queryRunner);
        console.log(chalk.green(`Fetched ${tenants.length} tenants from the database`));
        // Get all permissions, excluding certain ones if in demo mode.
        const permissions = this.getPermissions();
        console.log(chalk.green(`Fetched ${permissions.length} permissions`));
        // Loop through all tenants
        for await (const { id: tenantId, name: tenantName } of tenants) {
            console.log(chalk.blue(`Processing tenant: ${tenantName} (${tenantId})`));
            // Get all roles for specific tenant
            const roles = await this.getRolesByTenantId(queryRunner, tenantId);
            console.log(chalk.green(`Fetched ${roles.length} roles for tenant: ${tenantName}`));
            // Loop through all roles
            for await (const role of roles) {
                // Get default role permissions
                const defaultRolePermissions = this.getDefaultRolePermissions(role);
                const { role: roleEnum, defaultEnabledPermissions = [] } = defaultRolePermissions || {};
                console.log(chalk.blue(`Processing role: ${role.name} (${role.id})`));
                // Get role ID
                const roleId = role.id;
                // Loop through all permissions
                for await (const permission of permissions) {
                    // Check permission existence
                    const isPermissionExisted = await this.checkPermissionExistence(queryRunner, tenantId, roleId, permission);
                    // If permission does not exist
                    if (!isPermissionExisted) {
                        // Log missing permission
                        const timestamp = moment().format('DD.MM.YYYY HH:mm:ss');
                        const message = `${timestamp} unlocked missing permission for the tenant: ${tenantName}`;
                        console.log(chalk.magenta(message, roleEnum, permission));
                        // Missing role permission payload for insert into database
                        const payload = await this.getInsertPayload(queryRunner, tenantId, roleId, permission, defaultEnabledPermissions.includes(permission));
                        // Insert role permission into database
                        await this.insertRolePermissions(queryRunner, payload);
                    }
                }
            }
        }
        console.log(chalk.yellow('Completed migration of role permissions'));
    }
    /**
     * Get all tenants from the database
     * @param queryRunner - The QueryRunner instance
     * @returns A promise that resolves to an array of tenants
     */
    static async getAllTenants(queryRunner) {
        const query = (0, database_helper_1.prepareSQLQuery)(`SELECT * FROM "tenant"`);
        return await queryRunner.dataSource.manager.query(query);
    }
    /**
     * Get roles by tenant ID
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @returns A promise that resolves to an array of roles
     */
    static async getRolesByTenantId(queryRunner, tenantId) {
        let query = (0, database_helper_1.prepareSQLQuery)(`SELECT * FROM "role" WHERE "tenantId" = $1`);
        query = (0, utils_2.replacePlaceholders)(query, queryRunner.dataSource.options.type);
        return await queryRunner.dataSource.manager.query(query, [tenantId]);
    }
    /**
     * Get all permissions, excluding certain ones if in demo mode.
     * @returns An array of permissions.
     */
    static getPermissions() {
        /** Permissions to exclude for all users in DEMO mode */
        const excludePermissions = [
            contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT,
            contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA
        ];
        // Log the current mode (demo or not)
        console.log(chalk.yellow(`Environment demo mode: ${config_1.environment.demo}`));
        // Log the excluded permissions if in demo mode
        if (config_1.environment.demo) {
            console.log(chalk.red('Excluding permissions:'), chalk.redBright(JSON.stringify(excludePermissions)));
        }
        // If in demo mode, exclude certain permissions
        return config_1.environment.demo
            ? Object.values(contracts_1.PermissionsEnum).filter((permission) => !excludePermissions.includes(permission))
            : Object.values(contracts_1.PermissionsEnum);
    }
    /**
     * Get default role permissions
     * @param role - The role
     * @returns The default role permissions
     */
    static getDefaultRolePermissions(role) {
        return default_role_permissions_1.DEFAULT_ROLE_PERMISSIONS.find((defaultRole) => role.name === defaultRole.role);
    }
    /**
     * Check if the permission already exists
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @param roleId - The role ID
     * @param permission - The permission enum value
     * @returns A promise that resolves to a boolean indicating if the permission exists
     */
    static async checkPermissionExistence(queryRunner, tenantId, roleId, permission) {
        const dbType = queryRunner.dataSource.options.type;
        let query = (0, database_helper_1.prepareSQLQuery)(`
			SELECT DISTINCT
				"distinctAlias"."role_permission_id"
			FROM (
				SELECT
					"role_permission"."id" AS "role_permission_id",
					"role_permission"."tenantId" AS "role_permission_tenantId",
					"role_permission"."permission" AS "role_permission_permission",
					"role_permission"."roleId" AS "role_permission_roleId"
				FROM
					"role_permission" "role_permission"
				INNER JOIN "role" "role"
					ON "role"."id" = "role_permission"."roleId"
				WHERE (
					"role_permission"."tenantId" = $1 AND
					"role_permission"."permission" = $2 AND
					"role_permission"."roleId" = $3 AND
					"role"."tenantId" = $4 AND
					"role"."id" = $5
				)
			)
			"distinctAlias" ORDER BY "role_permission_id" ASC LIMIT 1
		`);
        query = (0, utils_2.replacePlaceholders)(query, dbType);
        const result = await queryRunner.dataSource.manager.query(query, [
            tenantId,
            permission,
            roleId,
            tenantId,
            roleId
        ]);
        return (0, utils_1.isNotEmpty)(result);
    }
    /**
     * Get insert payload for role permission
     * @param queryRunner - The QueryRunner instance
     * @param tenantId - The tenant ID
     * @param roleId - The role ID
     * @param permission - The permission enum value
     * @param isEnabled - Boolean indicating if the permission is enabled
     * @returns The payload array for the insert query
     */
    static async getInsertPayload(queryRunner, tenantId, roleId, permission, isEnabled) {
        const dbType = queryRunner.dataSource.options.type;
        const payload = [tenantId, roleId, permission, isEnabled ? 1 : 0];
        // Add UUID for specific database types
        if (dbType === config_1.DatabaseTypeEnum.sqlite ||
            dbType === config_1.DatabaseTypeEnum.betterSqlite3 ||
            dbType === config_1.DatabaseTypeEnum.mysql) {
            payload.push((0, uuid_1.v4)());
        }
        return payload;
    }
    /**
     * Insert role permissions into the database
     * @param queryRunner - The QueryRunner instance
     * @param payload - The payload for the insert query
     */
    static async insertRolePermissions(queryRunner, payload) {
        const dbType = queryRunner.dataSource.options.type;
        let query;
        switch (dbType) {
            case config_1.DatabaseTypeEnum.sqlite:
            case config_1.DatabaseTypeEnum.betterSqlite3:
            case config_1.DatabaseTypeEnum.mysql:
                query = (0, database_helper_1.prepareSQLQuery)(`INSERT INTO "role_permission" ("tenantId", "roleId", "permission", "enabled", "id") VALUES (?, ?, ?, ?, ?)`);
                break;
            case config_1.DatabaseTypeEnum.postgres:
                query = (0, database_helper_1.prepareSQLQuery)(`INSERT INTO "role_permission" ("tenantId", "roleId", "permission", "enabled") VALUES($1, $2, $3, $4)`);
                break;
            default:
                console.log(chalk.red('Unsupported database type'));
                break;
        }
        query = (0, utils_2.replacePlaceholders)(query, dbType);
        console.log(chalk.yellow(`Insert Query: ${query}`));
        await queryRunner.dataSource.manager.query(query, payload);
        console.log(chalk.green(`Inserted role permission for ${dbType}:`, payload));
    }
}
exports.RolePermissionUtils = RolePermissionUtils;
//# sourceMappingURL=utils.js.map