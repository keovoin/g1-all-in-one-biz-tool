"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInvoiceUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const public_invoice_update_command_1 = require("../public-invoice-update.command");
const public_invoice_service_1 = require("./../../public-invoice.service");
let PublicInvoiceUpdateHandler = class PublicInvoiceUpdateHandler {
    constructor(publicInvoiceService) {
        this.publicInvoiceService = publicInvoiceService;
    }
    async execute(command) {
        const { params, entity } = command;
        return await this.publicInvoiceService.updateInvoice(params, entity);
    }
};
exports.PublicInvoiceUpdateHandler = PublicInvoiceUpdateHandler;
exports.PublicInvoiceUpdateHandler = PublicInvoiceUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(public_invoice_update_command_1.PublicInvoiceUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [public_invoice_service_1.PublicInvoiceService])
], PublicInvoiceUpdateHandler);
//# sourceMappingURL=public-invoice-update.handler.js.map