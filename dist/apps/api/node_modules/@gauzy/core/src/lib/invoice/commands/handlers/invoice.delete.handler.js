"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_delete_command_1 = require("../invoice.delete.command");
let InvoiceDeleteHandler = class InvoiceDeleteHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { invoiceId } = command;
        return this.invoiceService.delete(invoiceId);
    }
};
exports.InvoiceDeleteHandler = InvoiceDeleteHandler;
exports.InvoiceDeleteHandler = InvoiceDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_delete_command_1.InvoiceDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceDeleteHandler);
//# sourceMappingURL=invoice.delete.handler.js.map