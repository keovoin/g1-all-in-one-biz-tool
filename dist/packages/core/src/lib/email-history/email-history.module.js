"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHistoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_history_entity_1 = require("./email-history.entity");
const email_history_controller_1 = require("./email-history.controller");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const email_history_service_1 = require("./email-history.service");
const handler_1 = require("./commands/handler");
const email_send_module_1 = require("./../email-send/email-send.module");
const type_orm_email_history_repository_1 = require("./repository/type-orm-email-history.repository");
const mikro_orm_email_history_repository_1 = require("./repository/mikro-orm-email-history.repository");
let EmailHistoryModule = class EmailHistoryModule {
};
exports.EmailHistoryModule = EmailHistoryModule;
exports.EmailHistoryModule = EmailHistoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_history_entity_1.EmailHistory]),
            nestjs_1.MikroOrmModule.forFeature([email_history_entity_1.EmailHistory]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => email_send_module_1.EmailSendModule),
            cqrs_1.CqrsModule
        ],
        controllers: [email_history_controller_1.EmailHistoryController],
        providers: [email_history_service_1.EmailHistoryService, type_orm_email_history_repository_1.TypeOrmEmailHistoryRepository, mikro_orm_email_history_repository_1.MikroOrmEmailHistoryRepository, ...handler_1.CommandHandlers],
        exports: [email_history_service_1.EmailHistoryService, type_orm_email_history_repository_1.TypeOrmEmailHistoryRepository, mikro_orm_email_history_repository_1.MikroOrmEmailHistoryRepository]
    })
], EmailHistoryModule);
//# sourceMappingURL=email-history.module.js.map