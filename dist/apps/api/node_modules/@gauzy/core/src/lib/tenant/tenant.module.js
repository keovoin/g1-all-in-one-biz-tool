"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const auth_module_1 = require("../auth/auth.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const role_module_1 = require("../role/role.module");
const stripe_subscription_service_1 = require("../shared/billing/stripe-subscription.service");
const user_module_1 = require("../user/user.module");
const feature_module_1 = require("./../feature/feature.module");
const tenant_controller_1 = require("./tenant.controller");
const tenant_entity_1 = require("./tenant.entity");
const tenant_service_1 = require("./tenant.service");
const handlers_1 = require("./commands/handlers");
const type_orm_tenant_repository_1 = require("./repository/type-orm-tenant.repository");
const mikro_orm_tenant_repository_1 = require("./repository/mikro-orm-tenant.repository");
let TenantModule = class TenantModule {
};
exports.TenantModule = TenantModule;
exports.TenantModule = TenantModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([tenant_entity_1.Tenant]),
            nestjs_1.MikroOrmModule.forFeature([tenant_entity_1.Tenant]),
            auth_module_1.AuthModule,
            cqrs_1.CqrsModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => role_module_1.RoleModule),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => feature_module_1.FeatureModule)
        ],
        controllers: [tenant_controller_1.TenantController],
        providers: [
            tenant_service_1.TenantService,
            type_orm_tenant_repository_1.TypeOrmTenantRepository,
            mikro_orm_tenant_repository_1.MikroOrmTenantRepository,
            // Lets onboardTenant() record the tenant -> Stripe customer link. Inert without a Stripe key.
            stripe_subscription_service_1.StripeSubscriptionService,
            ...handlers_1.CommandHandlers
        ],
        exports: [tenant_service_1.TenantService, type_orm_tenant_repository_1.TypeOrmTenantRepository, mikro_orm_tenant_repository_1.MikroOrmTenantRepository]
    })
], TenantModule);
//# sourceMappingURL=tenant.module.js.map