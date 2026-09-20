"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const typeorm_1 = require("@nestjs/typeorm");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const mention_service_1 = require("./mention.service");
const entity_subscription_module_1 = require("../entity-subscription/entity-subscription.module");
const mention_controller_1 = require("./mention.controller");
const mention_entity_1 = require("./mention.entity");
const handlers_1 = require("./events/handlers");
const type_orm_mention_repository_1 = require("./repository/type-orm-mention.repository");
const mikro_orm_mention_repository_1 = require("./repository/mikro-orm-mention.repository");
const employee_notification_module_1 = require("../employee-notification/employee-notification.module");
let MentionModule = class MentionModule {
};
exports.MentionModule = MentionModule;
exports.MentionModule = MentionModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([mention_entity_1.Mention]),
            nestjs_1.MikroOrmModule.forFeature([mention_entity_1.Mention]),
            cqrs_1.CqrsModule,
            role_permission_module_1.RolePermissionModule,
            entity_subscription_module_1.EntitySubscriptionModule,
            employee_notification_module_1.EmployeeNotificationModule
        ],
        controllers: [mention_controller_1.MentionController],
        providers: [mention_service_1.MentionService, type_orm_mention_repository_1.TypeOrmMentionRepository, mikro_orm_mention_repository_1.MikroOrmMentionRepository, ...handlers_1.EventHandlers],
        exports: [mention_service_1.MentionService]
    })
], MentionModule);
//# sourceMappingURL=mention.module.js.map