"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEstimateHistoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const invoice_estimate_history_service_1 = require("./invoice-estimate-history.service");
let InvoiceEstimateHistoryController = class InvoiceEstimateHistoryController extends crud_1.CrudController {
    constructor(invoiceEstimateHistoryService) {
        super(invoiceEstimateHistoryService);
        this.invoiceEstimateHistoryService = invoiceEstimateHistoryService;
    }
    async findAll(data) {
        const { relations = [], findInput = null } = data;
        return this.invoiceEstimateHistoryService.findAll({
            where: findInput,
            relations
        });
    }
};
exports.InvoiceEstimateHistoryController = InvoiceEstimateHistoryController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INVOICES_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], InvoiceEstimateHistoryController.prototype, "findAll", null);
exports.InvoiceEstimateHistoryController = InvoiceEstimateHistoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('InvoiceEstimateHistory'),
    (0, common_1.Controller)('/invoice-estimate-history'),
    tslib_1.__metadata("design:paramtypes", [invoice_estimate_history_service_1.InvoiceEstimateHistoryService])
], InvoiceEstimateHistoryController);
//# sourceMappingURL=invoice-estimate-history.controller.js.map