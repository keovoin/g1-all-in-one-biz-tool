"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceGeneratePdfHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_generate_pdf_command_1 = require("../invoice.generate.pdf.command");
let InvoiceGeneratePdfHandler = class InvoiceGeneratePdfHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { invoiceId, locale } = command;
        return await this.invoiceService.generateInvoicePdf(invoiceId, locale);
    }
};
exports.InvoiceGeneratePdfHandler = InvoiceGeneratePdfHandler;
exports.InvoiceGeneratePdfHandler = InvoiceGeneratePdfHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_generate_pdf_command_1.InvoiceGeneratePdfCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceGeneratePdfHandler);
//# sourceMappingURL=invoice.generate.pdf.handler.js.map