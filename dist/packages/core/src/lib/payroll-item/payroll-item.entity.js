"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollItem = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const pipes_1 = require("./../shared/pipes");
const payroll_run_entity_1 = require("./../payroll-run/payroll-run.entity");
const mikro_orm_payroll_item_repository_1 = require("./repository/mikro-orm-payroll-item.repository");
/**
 * One earning or deduction line within a payroll run (issue #2453).
 *
 * `amount` is always positive; `category` decides whether it adds to or subtracts from net pay.
 * Money is `numeric(14,2)` with a numeric transformer — a bare `decimal` column comes back from
 * PostgreSQL as a string, and a float column silently loses cents.
 */
let PayrollItem = class PayrollItem extends internal_1.TenantOrganizationBaseEntity {
};
exports.PayrollItem = PayrollItem;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollItemTypeEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollItemTypeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar' }),
    tslib_1.__metadata("design:type", String)
], PayrollItem.prototype, "type", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PayrollItemCategoryEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.PayrollItemCategoryEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar' }),
    tslib_1.__metadata("design:type", String)
], PayrollItem.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PayrollItem.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollItem.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 4,
        nullable: true,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollItem.prototype, "quantity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], PayrollItem.prototype, "unitPrice", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], PayrollItem.prototype, "taxable", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => payroll_run_entity_1.PayrollRun, (it) => it.items, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PayrollItem.prototype, "payrollRun", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.payrollRun),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], PayrollItem.prototype, "payrollRunId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PayrollItem.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PayrollItem.prototype, "employeeId", void 0);
exports.PayrollItem = PayrollItem = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('payroll_item', { mikroOrmRepository: () => mikro_orm_payroll_item_repository_1.MikroOrmPayrollItemRepository })
], PayrollItem);
//# sourceMappingURL=payroll-item.entity.js.map