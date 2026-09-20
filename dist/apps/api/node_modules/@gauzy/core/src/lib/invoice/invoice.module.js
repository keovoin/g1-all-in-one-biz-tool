"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const invoice_controller_1 = require("./invoice.controller");
const invoice_service_1 = require("./invoice.service");
const invoice_entity_1 = require("./invoice.entity");
const commands_1 = require("./commands");
const email_send_module_1 = require("../email-send/email-send.module");
const estimate_email_module_1 = require("../estimate-email/estimate-email.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const organization_module_1 = require("./../organization/organization.module");
const pdfmaker_service_1 = require("./pdfmaker.service");
const type_orm_invoice_repository_1 = require("./repository/type-orm-invoice.repository");
const mikro_orm_invoice_repository_1 = require("./repository/mikro-orm-invoice.repository");
let InvoiceModule = class InvoiceModule {
};
exports.InvoiceModule = InvoiceModule;
exports.InvoiceModule = InvoiceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoice_entity_1.Invoice]),
            nestjs_1.MikroOrmModule.forFeature([invoice_entity_1.Invoice]),
            cqrs_1.CqrsModule,
            email_send_module_1.EmailSendModule,
            role_permission_module_1.RolePermissionModule,
            organization_module_1.OrganizationModule,
            (0, common_1.forwardRef)(() => estimate_email_module_1.EstimateEmailModule)
        ],
        controllers: [invoice_controller_1.InvoiceController],
        providers: [invoice_service_1.InvoiceService, pdfmaker_service_1.PdfmakerService, type_orm_invoice_repository_1.TypeOrmInvoiceRepository, mikro_orm_invoice_repository_1.MikroOrmInvoiceRepository, ...commands_1.CommandHandlers],
        exports: [invoice_service_1.InvoiceService, pdfmaker_service_1.PdfmakerService, type_orm_invoice_repository_1.TypeOrmInvoiceRepository, mikro_orm_invoice_repository_1.MikroOrmInvoiceRepository]
    })
], InvoiceModule);
//# sourceMappingURL=invoice.module.js.map