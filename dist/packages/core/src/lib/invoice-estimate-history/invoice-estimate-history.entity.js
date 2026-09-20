"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceEstimateHistory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_invoice_estimate_history_repository_1 = require("./repository/mikro-orm-invoice-estimate-history.repository");
let InvoiceEstimateHistory = class InvoiceEstimateHistory extends internal_1.TenantOrganizationBaseEntity {
};
exports.InvoiceEstimateHistory = InvoiceEstimateHistory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], InvoiceEstimateHistory.prototype, "action", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ type: () => String, required: false }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], InvoiceEstimateHistory.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.User }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        onDelete: 'SET NULL',
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.User)
], InvoiceEstimateHistory.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], InvoiceEstimateHistory.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Invoice }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Invoice, (invoice) => invoice.invoiceItems, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", Object)
], InvoiceEstimateHistory.prototype, "invoice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.invoice),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], InvoiceEstimateHistory.prototype, "invoiceId", void 0);
exports.InvoiceEstimateHistory = InvoiceEstimateHistory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('invoice_estimate_history', { mikroOrmRepository: () => mikro_orm_invoice_estimate_history_repository_1.MikroOrmInvoiceEstimateHistoryRepository })
], InvoiceEstimateHistory);
//# sourceMappingURL=invoice-estimate-history.entity.js.map