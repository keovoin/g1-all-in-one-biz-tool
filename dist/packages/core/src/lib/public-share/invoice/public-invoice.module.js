"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicInvoiceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const handlers_1 = require("./queries/handlers");
const handlers_2 = require("./commands/handlers");
const internal_1 = require("./../../core/entities/internal");
const public_invoice_controller_1 = require("./public-invoice.controller");
const public_invoice_service_1 = require("./public-invoice.service");
let PublicInvoiceModule = class PublicInvoiceModule {
};
exports.PublicInvoiceModule = PublicInvoiceModule;
exports.PublicInvoiceModule = PublicInvoiceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [cqrs_1.CqrsModule, typeorm_1.TypeOrmModule.forFeature([internal_1.Invoice]), nestjs_1.MikroOrmModule.forFeature([internal_1.Invoice])],
        controllers: [public_invoice_controller_1.PublicInvoiceController],
        providers: [public_invoice_service_1.PublicInvoiceService, ...handlers_1.QueryHandlers, ...handlers_2.CommandHandlers]
    })
], PublicInvoiceModule);
//# sourceMappingURL=public-invoice.module.js.map