"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_create_command_1 = require("../invoice.create.command");
let InvoiceCreateHandler = class InvoiceCreateHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { input } = command;
        return await this.invoiceService.create(input);
    }
};
exports.InvoiceCreateHandler = InvoiceCreateHandler;
exports.InvoiceCreateHandler = InvoiceCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_create_command_1.InvoiceCreateCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceCreateHandler);
//# sourceMappingURL=invoice.create.handler.js.map