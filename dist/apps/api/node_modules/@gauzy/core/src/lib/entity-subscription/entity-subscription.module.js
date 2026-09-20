"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntitySubscriptionModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./events/handlers");
const entity_subscription_service_1 = require("./entity-subscription.service");
const entity_subscription_controller_1 = require("./entity-subscription.controller");
const entity_subscription_entity_1 = require("./entity-subscription.entity");
const type_orm_entity_subscription_repository_1 = require("./repository/type-orm-entity-subscription.repository");
const mikro_orm_entity_subscription_repository_1 = require("./repository/mikro-orm-entity-subscription.repository");
let EntitySubscriptionModule = class EntitySubscriptionModule {
};
exports.EntitySubscriptionModule = EntitySubscriptionModule;
exports.EntitySubscriptionModule = EntitySubscriptionModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entity_subscription_entity_1.EntitySubscription]),
            nestjs_1.MikroOrmModule.forFeature([entity_subscription_entity_1.EntitySubscription]),
            role_permission_module_1.RolePermissionModule,
            cqrs_1.CqrsModule
        ],
        controllers: [entity_subscription_controller_1.EntitySubscriptionController],
        providers: [entity_subscription_service_1.EntitySubscriptionService, type_orm_entity_subscription_repository_1.TypeOrmEntitySubscriptionRepository, mikro_orm_entity_subscription_repository_1.MikroOrmEntitySubscriptionRepository, ...handlers_1.CommandHandlers, ...handlers_2.EventHandlers],
        exports: [entity_subscription_service_1.EntitySubscriptionService, type_orm_entity_subscription_repository_1.TypeOrmEntitySubscriptionRepository, mikro_orm_entity_subscription_repository_1.MikroOrmEntitySubscriptionRepository]
    })
], EntitySubscriptionModule);
//# sourceMappingURL=entity-subscription.module.js.map