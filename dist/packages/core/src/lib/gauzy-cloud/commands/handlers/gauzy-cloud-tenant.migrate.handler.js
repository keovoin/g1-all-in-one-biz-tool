"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudTenantMigrateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const gauzy_cloud_service_1 = require("../../gauzy-cloud.service");
const role_service_1 = require("./../../../role/role.service");
const gauzy_cloud_tenant_migrate_command_1 = require("./../gauzy-cloud-tenant.migrate.command");
const role_permission_service_1 = require("./../../../role-permission/role-permission.service");
let GauzyCloudTenantMigrateHandler = class GauzyCloudTenantMigrateHandler {
    constructor(_gauzyCloudService, _roleService, _rolePermissionService) {
        this._gauzyCloudService = _gauzyCloudService;
        this._roleService = _roleService;
        this._rolePermissionService = _rolePermissionService;
    }
    async execute(command) {
        const { input, token } = command;
        return this._gauzyCloudService.migrateTenant(input, token).pipe((0, operators_1.tap)(async (response) => {
            if (response && response.data) {
                const tenant = response.data;
                this.migrateRoles(tenant, token);
                this.migratePermissions(tenant, token);
            }
        }), (0, operators_1.catchError)((error) => {
            console.log('Bad Promise:', error);
            return (0, rxjs_1.of)(error);
        }));
    }
    async migrateRoles(tenant, token) {
        return this._gauzyCloudService.migrateRoles(await this._roleService.migrateRoles(), token, tenant)
            .subscribe();
    }
    async migratePermissions(tenant, token) {
        return this._gauzyCloudService.migrateRolePermissions(await this._rolePermissionService.migratePermissions(), token, tenant)
            .subscribe();
    }
};
exports.GauzyCloudTenantMigrateHandler = GauzyCloudTenantMigrateHandler;
exports.GauzyCloudTenantMigrateHandler = GauzyCloudTenantMigrateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(gauzy_cloud_tenant_migrate_command_1.GauzyCloudTenantMigrateCommand),
    tslib_1.__metadata("design:paramtypes", [gauzy_cloud_service_1.GauzyCloudService,
        role_service_1.RoleService,
        role_permission_service_1.RolePermissionService])
], GauzyCloudTenantMigrateHandler);
//# sourceMappingURL=gauzy-cloud-tenant.migrate.handler.js.map