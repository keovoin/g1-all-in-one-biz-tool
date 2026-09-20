"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEstimateHistoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const invoice_estimate_history_controller_1 = require("./invoice-estimate-history.controller");
const invoice_estimate_history_service_1 = require("./invoice-estimate-history.service");
const invoice_estimate_history_entity_1 = require("./invoice-estimate-history.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const task_module_1 = require("../tasks/task.module");
const type_orm_invoice_estimate_history_repository_1 = require("./repository/type-orm-invoice-estimate-history.repository");
const mikro_orm_invoice_estimate_history_repository_1 = require("./repository/mikro-orm-invoice-estimate-history.repository");
let InvoiceEstimateHistoryModule = class InvoiceEstimateHistoryModule {
};
exports.InvoiceEstimateHistoryModule = InvoiceEstimateHistoryModule;
exports.InvoiceEstimateHistoryModule = InvoiceEstimateHistoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoice_estimate_history_entity_1.InvoiceEstimateHistory]),
            nestjs_1.MikroOrmModule.forFeature([invoice_estimate_history_entity_1.InvoiceEstimateHistory]),
            role_permission_module_1.RolePermissionModule,
            task_module_1.TaskModule
        ],
        controllers: [invoice_estimate_history_controller_1.InvoiceEstimateHistoryController],
        providers: [invoice_estimate_history_service_1.InvoiceEstimateHistoryService, type_orm_invoice_estimate_history_repository_1.TypeOrmInvoiceEstimateHistoryRepository, mikro_orm_invoice_estimate_history_repository_1.MikroOrmInvoiceEstimateHistoryRepository]
    })
], InvoiceEstimateHistoryModule);
//# sourceMappingURL=invoice-estimate-history.module.js.map