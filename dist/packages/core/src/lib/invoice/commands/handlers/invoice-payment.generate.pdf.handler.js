"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicePaymentGeneratePdfHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_payment_generate_pdf_command_1 = require("../invoice-payment.generate.pdf.command");
let InvoicePaymentGeneratePdfHandler = class InvoicePaymentGeneratePdfHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { invoiceId, locale } = command;
        return await this.invoiceService.generateInvoicePaymentPdf(invoiceId, locale);
    }
};
exports.InvoicePaymentGeneratePdfHandler = InvoicePaymentGeneratePdfHandler;
exports.InvoicePaymentGeneratePdfHandler = InvoicePaymentGeneratePdfHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_payment_generate_pdf_command_1.InvoicePaymentGeneratePdfCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoicePaymentGeneratePdfHandler);
//# sourceMappingURL=invoice-payment.generate.pdf.handler.js.map