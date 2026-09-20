"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_entity_1 = require("./role.entity");
const role_service_1 = require("./role.service");
const role_authorization_service_1 = require("./role-authorization.service");
const role_controller_1 = require("./role.controller");
const role_permission_module_1 = require("./../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const type_orm_role_repository_1 = require("./repository/type-orm-role.repository");
const mikro_orm_role_repository_1 = require("./repository/mikro-orm-role.repository");
let RoleModule = class RoleModule {
};
exports.RoleModule = RoleModule;
exports.RoleModule = RoleModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([role_entity_1.Role]),
            nestjs_1.MikroOrmModule.forFeature([role_entity_1.Role]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule)
        ],
        controllers: [role_controller_1.RoleController],
        providers: [role_service_1.RoleService, role_authorization_service_1.RoleAuthorizationService, type_orm_role_repository_1.TypeOrmRoleRepository, mikro_orm_role_repository_1.MikroOrmRoleRepository, ...handlers_1.CommandHandlers],
        exports: [role_service_1.RoleService, role_authorization_service_1.RoleAuthorizationService, type_orm_role_repository_1.TypeOrmRoleRepository, mikro_orm_role_repository_1.MikroOrmRoleRepository]
    })
], RoleModule);
//# sourceMappingURL=role.module.js.map