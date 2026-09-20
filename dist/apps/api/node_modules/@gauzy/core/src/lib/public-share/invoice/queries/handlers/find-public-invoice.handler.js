"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindPublicInvoiceHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const find_public_invoice_query_1 = require("../find-public-invoice.query");
const public_invoice_service_1 = require("./../../public-invoice.service");
let FindPublicInvoiceHandler = class FindPublicInvoiceHandler {
    constructor(publicInvoiceService) {
        this.publicInvoiceService = publicInvoiceService;
    }
    async execute(query) {
        const { params, relations = [] } = query;
        return await this.publicInvoiceService.findOneByConditions(params, relations);
    }
};
exports.FindPublicInvoiceHandler = FindPublicInvoiceHandler;
exports.FindPublicInvoiceHandler = FindPublicInvoiceHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_public_invoice_query_1.FindPublicInvoiceQuery),
    tslib_1.__metadata("design:paramtypes", [public_invoice_service_1.PublicInvoiceService])
], FindPublicInvoiceHandler);
//# sourceMappingURL=find-public-invoice.handler.js.map