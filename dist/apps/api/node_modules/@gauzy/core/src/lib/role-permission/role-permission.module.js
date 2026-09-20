"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const cache_manager_1 = require("@nestjs/cache-manager");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_controller_1 = require("./role-permission.controller");
const role_permission_entity_1 = require("./role-permission.entity");
const role_permission_service_1 = require("./role-permission.service");
const role_module_1 = require("./../role/role.module");
const type_orm_role_permission_repository_1 = require("./repository/type-orm-role-permission.repository");
const mikro_orm_role_permission_repository_1 = require("./repository/mikro-orm-role-permission.repository");
let RolePermissionModule = class RolePermissionModule {
};
exports.RolePermissionModule = RolePermissionModule;
exports.RolePermissionModule = RolePermissionModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            cache_manager_1.CacheModule.register({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forFeature([role_permission_entity_1.RolePermission]),
            nestjs_1.MikroOrmModule.forFeature([role_permission_entity_1.RolePermission]),
            (0, common_1.forwardRef)(() => role_module_1.RoleModule)
        ],
        controllers: [role_permission_controller_1.RolePermissionController],
        providers: [role_permission_service_1.RolePermissionService, type_orm_role_permission_repository_1.TypeOrmRolePermissionRepository, mikro_orm_role_permission_repository_1.MikroOrmRolePermissionRepository],
        exports: [cache_manager_1.CacheModule, role_permission_service_1.RolePermissionService, type_orm_role_permission_repository_1.TypeOrmRolePermissionRepository, mikro_orm_role_permission_repository_1.MikroOrmRolePermissionRepository]
    })
], RolePermissionModule);
//# sourceMappingURL=role-permission.module.js.map