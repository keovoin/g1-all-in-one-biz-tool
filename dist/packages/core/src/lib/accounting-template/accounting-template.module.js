"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const accounting_template_entity_1 = require("./accounting-template.entity");
const accounting_template_controller_1 = require("./accounting-template.controller");
const accounting_template_service_1 = require("./accounting-template.service");
const handlers_1 = require("./queries/handlers");
const type_orm_accounting_template_repository_1 = require("./repository/type-orm-accounting-template.repository");
const mikro_orm_accounting_template_repository_1 = require("./repository/mikro-orm-accounting-template.repository");
let AccountingTemplateModule = class AccountingTemplateModule {
};
exports.AccountingTemplateModule = AccountingTemplateModule;
exports.AccountingTemplateModule = AccountingTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([accounting_template_entity_1.AccountingTemplate]),
            nestjs_1.MikroOrmModule.forFeature([accounting_template_entity_1.AccountingTemplate]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [accounting_template_controller_1.AccountingTemplateController],
        providers: [accounting_template_service_1.AccountingTemplateService, type_orm_accounting_template_repository_1.TypeOrmAccountingTemplateRepository, mikro_orm_accounting_template_repository_1.MikroOrmAccountingTemplateRepository, ...handlers_1.QueryHandlers]
    })
], AccountingTemplateModule);
//# sourceMappingURL=accounting-template.module.js.map