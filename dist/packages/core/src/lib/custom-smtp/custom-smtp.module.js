"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpModule = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const custom_smtp_entity_1 = require("./custom-smtp.entity");
const custom_smtp_controller_1 = require("./custom-smtp.controller");
const custom_smtp_service_1 = require("./custom-smtp.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const commands_1 = require("./commands");
const type_orm_custom_smtp_repository_1 = require("./repository/type-orm-custom-smtp.repository");
const mikro_orm_custom_smtp_repository_1 = require("./repository/mikro-orm-custom-smtp.repository");
let CustomSmtpModule = class CustomSmtpModule {
};
exports.CustomSmtpModule = CustomSmtpModule;
exports.CustomSmtpModule = CustomSmtpModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([custom_smtp_entity_1.CustomSmtp]),
            nestjs_1.MikroOrmModule.forFeature([custom_smtp_entity_1.CustomSmtp]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            cqrs_1.CqrsModule
        ],
        controllers: [custom_smtp_controller_1.CustomSmtpController],
        providers: [custom_smtp_service_1.CustomSmtpService, type_orm_custom_smtp_repository_1.TypeOrmCustomSmtpRepository, mikro_orm_custom_smtp_repository_1.MikroOrmCustomSmtpRepository, ...commands_1.CommandHandlers],
        exports: [custom_smtp_service_1.CustomSmtpService, type_orm_custom_smtp_repository_1.TypeOrmCustomSmtpRepository, mikro_orm_custom_smtp_repository_1.MikroOrmCustomSmtpRepository]
    })
], CustomSmtpModule);
//# sourceMappingURL=custom-smtp.module.js.map