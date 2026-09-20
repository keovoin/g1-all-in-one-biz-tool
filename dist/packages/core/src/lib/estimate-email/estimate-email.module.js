"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateEmailModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const invoice_module_1 = require("../invoice/invoice.module");
const estimate_email_controller_1 = require("./estimate-email.controller");
const estimate_email_service_1 = require("./estimate-email.service");
const estimate_email_entity_1 = require("./estimate-email.entity");
const type_orm_estimate_email_repository_1 = require("./repository/type-orm-estimate-email.repository");
const mikro_orm_estimate_email_repository_1 = require("./repository/mikro-orm-estimate-email.repository");
let EstimateEmailModule = class EstimateEmailModule {
};
exports.EstimateEmailModule = EstimateEmailModule;
exports.EstimateEmailModule = EstimateEmailModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([estimate_email_entity_1.EstimateEmail]),
            nestjs_1.MikroOrmModule.forFeature([estimate_email_entity_1.EstimateEmail]),
            role_permission_module_1.RolePermissionModule,
            (0, common_1.forwardRef)(() => invoice_module_1.InvoiceModule)
        ],
        controllers: [estimate_email_controller_1.EstimateEmailController],
        providers: [estimate_email_service_1.EstimateEmailService, type_orm_estimate_email_repository_1.TypeOrmEstimateEmailRepository, mikro_orm_estimate_email_repository_1.MikroOrmEstimateEmailRepository],
        exports: [estimate_email_service_1.EstimateEmailService]
    })
], EstimateEmailModule);
//# sourceMappingURL=estimate-email.module.js.map