"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRoleBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const role_permission_service_1 = require("../../../role-permission/role-permission.service");
const role_service_1 = require("../../role.service");
const tenant_role_bulk_create_command_1 = require("../tenant-role-bulk-create.command");
let TenantRoleBulkCreateHandler = class TenantRoleBulkCreateHandler {
    constructor(roleService, rolePermissionService) {
        this.roleService = roleService;
        this.rolePermissionService = rolePermissionService;
    }
    /**
     * Executes a bulk role creation and permission update operation for tenants.
     * It first creates roles in bulk for the provided tenants and then updates their permissions accordingly.
     *
     * @param command An instance of TenantRoleBulkCreateCommand containing tenant data.
     * @returns A Promise that resolves to an array of IRole, representing the newly created roles.
     */
    async execute(command) {
        const { input: tenants } = command;
        //1. Create Roles of tenant.
        const roles = await this.roleService.createBulk(tenants);
        //2. Update RolePermission of tenant.
        await this.rolePermissionService.updateRolesAndPermissions(tenants);
        return roles;
    }
};
exports.TenantRoleBulkCreateHandler = TenantRoleBulkCreateHandler;
exports.TenantRoleBulkCreateHandler = TenantRoleBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(tenant_role_bulk_create_command_1.TenantRoleBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [role_service_1.RoleService,
        role_permission_service_1.RolePermissionService])
], TenantRoleBulkCreateHandler);
//# sourceMappingURL=tenant-role-bulk-create.handler.js.map