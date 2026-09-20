"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSendEmailHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_send_email_command_1 = require("../invoice.send.email.command");
let InvoiceSendEmailHandler = class InvoiceSendEmailHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        const { languageCode, email, params, origin } = command;
        const { invoiceNumber, invoiceId, isEstimate, organizationId } = params;
        return await this.invoiceService.sendEmail(languageCode, email, invoiceNumber, invoiceId, isEstimate, origin, organizationId);
    }
};
exports.InvoiceSendEmailHandler = InvoiceSendEmailHandler;
exports.InvoiceSendEmailHandler = InvoiceSendEmailHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_send_email_command_1.InvoiceSendEmailCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceSendEmailHandler);
//# sourceMappingURL=invoice.send.email.handler.js.map