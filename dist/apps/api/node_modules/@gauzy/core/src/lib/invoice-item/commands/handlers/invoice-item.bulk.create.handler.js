"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceItemBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_item_bulk_create_command_1 = require("../invoice-item.bulk.create.command");
const invoice_item_service_1 = require("../../invoice-item.service");
let InvoiceItemBulkCreateHandler = class InvoiceItemBulkCreateHandler {
    constructor(invoiceItemService) {
        this.invoiceItemService = invoiceItemService;
    }
    async execute(command) {
        const { invoiceId, input } = command;
        return await this.invoiceItemService.createBulk(invoiceId, input);
    }
};
exports.InvoiceItemBulkCreateHandler = InvoiceItemBulkCreateHandler;
exports.InvoiceItemBulkCreateHandler = InvoiceItemBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_item_bulk_create_command_1.InvoiceItemBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_item_service_1.InvoiceItemService])
], InvoiceItemBulkCreateHandler);
//# sourceMappingURL=invoice-item.bulk.create.handler.js.map