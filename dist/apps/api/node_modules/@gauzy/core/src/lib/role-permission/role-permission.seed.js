"use strict";
// Modified code from https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit.
// MIT License, see https://github.com/alexitaylor/angular-graphql-nestjs-postgres-starter-kit/blob/master/LICENSE
// Copyright (c) 2019 Alexi Taylor
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRolePermissions = void 0;
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const default_role_permissions_1 = require("./default-role-permissions");
const role_permission_entity_1 = require("./role-permission.entity");
/**
 * Creates role permissions for each tenant and role.
 *
 * @param {DataSource} dataSource - The data source to interact with the database.
 * @param {IRole[]} roles - The list of roles to create permissions for.
 * @param {ITenant[]} tenants - The list of tenants for whom to create role permissions.
 */
const createRolePermissions = async (dataSource, roles, tenants) => {
    // Permissions that should be denied in DEMO mode
    const deniedPermissions = new Set([contracts_1.PermissionsEnum.ACCESS_DELETE_ACCOUNT, contracts_1.PermissionsEnum.ACCESS_DELETE_ALL_DATA]);
    for (const tenant of tenants) {
        const rolePermissions = [];
        // Loop through each default role permission configuration
        for (const { role: roleEnum, defaultEnabledPermissions } of default_role_permissions_1.DEFAULT_ROLE_PERMISSIONS) {
            // Find the corresponding role for the current tenant
            const role = roles.find((dbRole) => dbRole.name === roleEnum && dbRole.tenant.name === tenant.name);
            if (role) {
                // Filter permissions, excluding denied permissions in DEMO mode
                const permissions = config_1.environment.demo
                    ? Object.values(contracts_1.PermissionsEnum).filter((permission) => !deniedPermissions.has(permission))
                    : Object.values(contracts_1.PermissionsEnum);
                // Create RolePermission objects and add them to the array
                rolePermissions.push(...permissions.map((permission) => {
                    const rolePermission = new role_permission_entity_1.RolePermission();
                    rolePermission.role = role;
                    rolePermission.permission = permission;
                    rolePermission.enabled = defaultEnabledPermissions.includes(permission);
                    rolePermission.tenant = tenant;
                    return rolePermission;
                }));
            }
        }
        // Save all role permissions in one batch for the current tenant
        await dataSource.manager.save(rolePermissions);
    }
};
exports.createRolePermissions = createRolePermissions;
//# sourceMappingURL=role-permission.seed.js.map