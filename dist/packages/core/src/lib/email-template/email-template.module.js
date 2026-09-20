"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplateModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const email_template_entity_1 = require("./email-template.entity");
const email_template_service_1 = require("./email-template.service");
const email_template_reader_service_1 = require("./email-template-reader.service");
const email_template_controller_1 = require("./email-template.controller");
const handlers_1 = require("./queries/handlers");
const handlers_2 = require("./commands/handlers");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_email_template_repository_1 = require("./repository/type-orm-email-template.repository");
const mikro_orm_email_template_repository_1 = require("./repository/mikro-orm-email-template.repository");
let EmailTemplateModule = class EmailTemplateModule {
};
exports.EmailTemplateModule = EmailTemplateModule;
exports.EmailTemplateModule = EmailTemplateModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            cqrs_1.CqrsModule,
            typeorm_1.TypeOrmModule.forFeature([email_template_entity_1.EmailTemplate]),
            nestjs_1.MikroOrmModule.forFeature([email_template_entity_1.EmailTemplate]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [email_template_controller_1.EmailTemplateController],
        providers: [
            email_template_service_1.EmailTemplateService,
            email_template_reader_service_1.EmailTemplateReaderService,
            type_orm_email_template_repository_1.TypeOrmEmailTemplateRepository, mikro_orm_email_template_repository_1.MikroOrmEmailTemplateRepository,
            ...handlers_1.QueryHandlers,
            ...handlers_2.CommandHandlers
        ],
        exports: [email_template_service_1.EmailTemplateService, type_orm_email_template_repository_1.TypeOrmEmailTemplateRepository, mikro_orm_email_template_repository_1.MikroOrmEmailTemplateRepository]
    })
], EmailTemplateModule);
//# sourceMappingURL=email-template.module.js.map