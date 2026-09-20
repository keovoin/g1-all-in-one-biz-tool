"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEstimateHistoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_invoice_estimate_history_repository_1 = require("./repository/type-orm-invoice-estimate-history.repository");
const mikro_orm_invoice_estimate_history_repository_1 = require("./repository/mikro-orm-invoice-estimate-history.repository");
let InvoiceEstimateHistoryService = class InvoiceEstimateHistoryService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmInvoiceEstimateHistoryRepository, mikroOrmInvoiceEstimateHistoryRepository) {
        super(typeOrmInvoiceEstimateHistoryRepository, mikroOrmInvoiceEstimateHistoryRepository);
    }
};
exports.InvoiceEstimateHistoryService = InvoiceEstimateHistoryService;
exports.InvoiceEstimateHistoryService = InvoiceEstimateHistoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_invoice_estimate_history_repository_1.TypeOrmInvoiceEstimateHistoryRepository,
        mikro_orm_invoice_estimate_history_repository_1.MikroOrmInvoiceEstimateHistoryRepository])
], InvoiceEstimateHistoryService);
//# sourceMappingURL=invoice-estimate-history.service.js.map