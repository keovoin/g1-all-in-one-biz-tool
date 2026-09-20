"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const invoice_item_entity_1 = require("./invoice-item.entity");
const invoice_item_controller_1 = require("./invoice-item.controller");
const invoice_item_service_1 = require("./invoice-item.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const handlers_1 = require("./commands/handlers");
const task_module_1 = require("../tasks/task.module");
const type_orm_invoice_item_repository_1 = require("./repository/type-orm-invoice-item.repository");
const mikro_orm_invoice_item_repository_1 = require("./repository/mikro-orm-invoice-item.repository");
let InvoiceItemModule = class InvoiceItemModule {
};
exports.InvoiceItemModule = InvoiceItemModule;
exports.InvoiceItemModule = InvoiceItemModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([invoice_item_entity_1.InvoiceItem]),
            nestjs_1.MikroOrmModule.forFeature([invoice_item_entity_1.InvoiceItem]),
            role_permission_module_1.RolePermissionModule,
            task_module_1.TaskModule,
            cqrs_1.CqrsModule
        ],
        controllers: [invoice_item_controller_1.InvoiceItemController],
        providers: [invoice_item_service_1.InvoiceItemService, type_orm_invoice_item_repository_1.TypeOrmInvoiceItemRepository, mikro_orm_invoice_item_repository_1.MikroOrmInvoiceItemRepository, ...handlers_1.CommandHandlers],
        exports: [invoice_item_service_1.InvoiceItemService]
    })
], InvoiceItemModule);
//# sourceMappingURL=invoice-item.module.js.map