"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const zapier_service_1 = require("./zapier.service");
const zapier_controller_1 = require("./zapier.controller");
const zapier_authorization_controller_1 = require("./zapier-authorization.controller");
const zapier_webhook_service_1 = require("./zapier-webhook.service");
const zapier_webhook_controller_1 = require("./zapier-webhook.controller");
const zapier_webhook_subscription_entity_1 = require("./zapier-webhook-subscription.entity");
const mikro_orm_zapier_webhook_subscription_repository_1 = require("./repository/mikro-orm-zapier-webhook-subscription.repository");
const type_orm_zapier_webhook_subscription_repository_1 = require("./repository/type-orm-zapier-webhook-subscription.repository");
const handlers_1 = require("./handlers");
let ZapierModule = class ZapierModule {
};
exports.ZapierModule = ZapierModule;
exports.ZapierModule = ZapierModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            axios_1.HttpModule.register({ baseURL: config_1.environment.baseUrl }),
            cqrs_1.CqrsModule,
            config_1.ConfigModule,
            core_1.IntegrationEntitySettingModule,
            core_1.IntegrationMapModule,
            core_1.IntegrationModule,
            core_1.RolePermissionModule,
            core_1.IntegrationSettingModule,
            core_1.IntegrationTenantModule,
            core_1.UserModule,
            core_1.TimerModule,
            typeorm_1.TypeOrmModule.forFeature([zapier_webhook_subscription_entity_1.ZapierWebhookSubscription]),
            nestjs_1.MikroOrmModule.forFeature([zapier_webhook_subscription_entity_1.ZapierWebhookSubscription])
        ],
        controllers: [zapier_authorization_controller_1.ZapierAuthorizationController, zapier_controller_1.ZapierController, zapier_webhook_controller_1.ZapierWebhookController],
        providers: [
            zapier_service_1.ZapierService,
            zapier_webhook_service_1.ZapierWebhookService,
            mikro_orm_zapier_webhook_subscription_repository_1.MikroOrmZapierWebhookSubscriptionRepository,
            type_orm_zapier_webhook_subscription_repository_1.TypeOrmZapierWebhookSubscriptionRepository,
            ...handlers_1.EventHandlers
        ],
        exports: [zapier_service_1.ZapierService, zapier_webhook_service_1.ZapierWebhookService]
    })
], ZapierModule);
//# sourceMappingURL=zapier.module.js.map