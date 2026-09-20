"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantApiKeyModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const user_module_1 = require("../user/user.module");
const tenant_api_key_controller_1 = require("./tenant-api-key.controller");
const tenant_api_key_entity_1 = require("./tenant-api-key.entity");
const tenant_api_key_service_1 = require("./tenant-api-key.service");
const type_orm_tenant_api_key_repository_1 = require("./repository/type-orm-tenant-api-key.repository");
const mikro_orm_tenant_api_key_repository_1 = require("./repository/mikro-orm-tenant-api-key.repository");
let TenantApiKeyModule = class TenantApiKeyModule {
};
exports.TenantApiKeyModule = TenantApiKeyModule;
exports.TenantApiKeyModule = TenantApiKeyModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tenant_api_key_entity_1.TenantApiKey]),
            nestjs_1.MikroOrmModule.forFeature([tenant_api_key_entity_1.TenantApiKey]),
            role_permission_module_1.RolePermissionModule,
            user_module_1.UserModule
        ],
        controllers: [tenant_api_key_controller_1.TenantApiKeyController],
        providers: [tenant_api_key_service_1.TenantApiKeyService, type_orm_tenant_api_key_repository_1.TypeOrmTenantApiKeyRepository, mikro_orm_tenant_api_key_repository_1.MikroOrmTenantApiKeyRepository],
        exports: [tenant_api_key_service_1.TenantApiKeyService, type_orm_tenant_api_key_repository_1.TypeOrmTenantApiKeyRepository, mikro_orm_tenant_api_key_repository_1.MikroOrmTenantApiKeyRepository]
    })
], TenantApiKeyModule);
//# sourceMappingURL=tenant-api-key.module.js.map