"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthClientModule = void 0;
const tslib_1 = require("tslib");
/**
 * `OAuthClientModule` — registers the multi-app OAuth client registry
 * (entity, dual-ORM repositories, service, admin controller).
 *
 * What changed from the single-app version:
 * Previously there was no module — the one OAuth client was an env var
 * read by `SocialAuthService.getOAuthAppConfig()`. This module exposes
 * the registry so the auth pipeline (Section 3) can inject
 * `OAuthClientService` to resolve clients per-request, and so the admin
 * UI can register Activepieces / n8n / etc. via `/oauth/clients`.
 *
 * `RolePermissionModule` is imported because the controller is guarded
 * with `TenantPermissionGuard` + `PermissionGuard`, both of which depend
 * on the role-permission service.
 */
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../../role-permission/role-permission.module");
const oauth_client_entity_1 = require("./oauth-client.entity");
const oauth_client_service_1 = require("./oauth-client.service");
const oauth_client_controller_1 = require("./oauth-client.controller");
const type_orm_oauth_client_repository_1 = require("./repository/type-orm-oauth-client.repository");
const mikro_orm_oauth_client_repository_1 = require("./repository/mikro-orm-oauth-client.repository");
let OAuthClientModule = class OAuthClientModule {
};
exports.OAuthClientModule = OAuthClientModule;
exports.OAuthClientModule = OAuthClientModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([oauth_client_entity_1.OAuthClient]),
            nestjs_1.MikroOrmModule.forFeature([oauth_client_entity_1.OAuthClient]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [oauth_client_controller_1.OAuthClientController],
        providers: [oauth_client_service_1.OAuthClientService, type_orm_oauth_client_repository_1.TypeOrmOAuthClientRepository, mikro_orm_oauth_client_repository_1.MikroOrmOAuthClientRepository],
        exports: [oauth_client_service_1.OAuthClientService, type_orm_oauth_client_repository_1.TypeOrmOAuthClientRepository, mikro_orm_oauth_client_repository_1.MikroOrmOAuthClientRepository]
    })
], OAuthClientModule);
//# sourceMappingURL=oauth-client.module.js.map