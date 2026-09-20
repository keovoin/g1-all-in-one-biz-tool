"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollRun = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const pipes_1 = require("./../shared/pipes");
const payroll_item_entity_1 = require("./../payroll-item/payroll-item.entity");
const mikro_orm_payroll_run_repository_1 = require("./repository/mikro-orm-payroll-run.repository");
/**
 * One payroll run — a single pay period for an organization (issue #2453).
 *
 * The three totals are derived from the run's items and are recomputed by the server when the run
 * is processed. They are stored rather than computed on read so a paid run keeps the numbers it
 * was actually paid with, even if an item is later corrected.
 */
let PayrollRun = class PayrollRun extends internal_1.TenantOrganizationBaseEntity {
};
exports.PayrollRun = PayrollRun;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'date' }),
    tslib_1.__metadata("design:type", Date)
], PayrollRun.prototype, "periodStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ type: 'date' }),
    tslib_1.__metadata("design:type", Date)
], PayrollRun.prototype, "periodEnd", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ type: 'date' }),
    tslib_1.__metadata("design:type", Date)
], PayrollRun.prototype, "payDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollFrequencyEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollFrequencyEnum),
    (0, entity_1.MultiORMColumn)({ type: 'varchar' }),
    tslib_1.__metadata("design:type", String)
], PayrollRun.prototype, "frequency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollRunStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollRunStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', default: contracts_1.PayrollRunStatusEnum.DRAFT }),
    tslib_1.__metadata("design:type", String)
], PayrollRun.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(3, 3),
    (0, entity_1.MultiORMColumn)({ length: 3 }),
    tslib_1.__metadata("design:type", String)
], PayrollRun.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollRun.prototype, "totalGross", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollRun.prototype, "totalDeductions", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollRun.prototype, "totalNet", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PayrollRun.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PayrollRun.prototype, "approvedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PayrollRun.prototype, "paidAt", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PayrollRun.prototype, "approvedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.approvedBy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PayrollRun.prototype, "approvedByUserId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => payroll_item_entity_1.PayrollItem, (it) => it.payrollRun, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], PayrollRun.prototype, "items", void 0);
exports.PayrollRun = PayrollRun = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('payroll_run', { mikroOrmRepository: () => mikro_orm_payroll_run_repository_1.MikroOrmPayrollRunRepository })
], PayrollRun);
//# sourceMappingURL=payroll-run.entity.js.map