"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailResetModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const email_reset_entity_1 = require("./email-reset.entity");
const email_reset_service_1 = require("./email-reset.service");
const email_reset_controller_1 = require("./email-reset.controller");
const user_module_1 = require("../user/user.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const email_send_module_1 = require("./../email-send/email-send.module");
const employee_module_1 = require("./../employee/employee.module");
const auth_module_1 = require("./../auth/auth.module");
const type_orm_email_reset_repository_1 = require("./repository/type-orm-email-reset.repository");
const mikro_orm_email_reset_repository_1 = require("./repository/mikro-orm-email-reset.repository");
let EmailResetModule = class EmailResetModule {
};
exports.EmailResetModule = EmailResetModule;
exports.EmailResetModule = EmailResetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([email_reset_entity_1.EmailReset]),
            nestjs_1.MikroOrmModule.forFeature([email_reset_entity_1.EmailReset]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            cqrs_1.CqrsModule,
            user_module_1.UserModule,
            email_send_module_1.EmailSendModule,
            employee_module_1.EmployeeModule,
            auth_module_1.AuthModule
        ],
        controllers: [email_reset_controller_1.EmailResetController],
        providers: [email_reset_service_1.EmailResetService, type_orm_email_reset_repository_1.TypeOrmEmailResetRepository, mikro_orm_email_reset_repository_1.MikroOrmEmailResetRepository, ...handlers_1.CommandHandlers, ...handlers_2.QueryHandlers],
        exports: [email_reset_service_1.EmailResetService]
    })
], EmailResetModule);
//# sourceMappingURL=email-reset.module.js.map