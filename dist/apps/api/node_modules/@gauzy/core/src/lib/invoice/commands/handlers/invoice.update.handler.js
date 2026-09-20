"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_update_command_1 = require("../invoice.update.command");
let InvoiceUpdateHandler = class InvoiceUpdateHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { input } = command;
        const { id } = input;
        return await this.invoiceService.create({
            ...input,
            id
        });
    }
};
exports.InvoiceUpdateHandler = InvoiceUpdateHandler;
exports.InvoiceUpdateHandler = InvoiceUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_update_command_1.InvoiceUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceUpdateHandler);
//# sourceMappingURL=invoice.update.handler.js.map