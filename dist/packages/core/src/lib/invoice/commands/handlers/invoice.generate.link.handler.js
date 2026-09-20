"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceGenerateLinkHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const invoice_service_1 = require("../../invoice.service");
const invoice_generate_link_command_1 = require("../invoice.generate.link.command");
let InvoiceGenerateLinkHandler = class InvoiceGenerateLinkHandler {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async execute(command) {
        try {
            const { invoiceId } = command;
            return await this.invoiceService.generateLink(invoiceId);
        }
        catch (error) {
            console.error('Error while genrating public link for invoice/estimate');
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.InvoiceGenerateLinkHandler = InvoiceGenerateLinkHandler;
exports.InvoiceGenerateLinkHandler = InvoiceGenerateLinkHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invoice_generate_link_command_1.InvoiceGenerateLinkCommand),
    tslib_1.__metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], InvoiceGenerateLinkHandler);
//# sourceMappingURL=invoice.generate.link.handler.js.map