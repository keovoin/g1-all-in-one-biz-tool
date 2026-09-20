"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffBalance = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const pipes_1 = require("./../shared/pipes");
const mikro_orm_time_off_balance_repository_1 = require("./repository/mikro-orm-time-off-balance.repository");
/**
 * Leave balance of one employee, under one Time Off policy, for one year (issue #314).
 *
 * `(tenantId, organizationId, employeeId, policyId, year)` is UNIQUE. That is a correctness
 * control, not a hint: without it two concurrent "find or create" calls would each insert a row
 * and the employee would end up with two balances, so days deducted from one would still look
 * available on the other.
 *
 * `carriedOut` is what makes the ledger honest across a year boundary: once days are rolled into
 * the next year they stop counting as remaining in this one, instead of being available twice.
 *
 * The day counts are `numeric` with a numeric transformer, matching every other money/quantity
 * column in the codebase — a bare `decimal` column comes back from PostgreSQL as a string, and
 * `'5' + 1` is `'51'`.
 */
let TimeOffBalance = class TimeOffBalance extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimeOffBalance = TimeOffBalance;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Fiscal/calendar year the balance applies to' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1900),
    (0, class_validator_1.Max)(2999),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'int' }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "year", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Days accrued so far this year' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "accrued", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Days taken through approved time off requests' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "taken", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Days carried forward from the previous year' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "carriedForward", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, description: 'Days already rolled into the next year' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "carriedOut", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'accrued + carriedForward - taken - carriedOut' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        precision: 10,
        scale: 2,
        default: 0,
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], TimeOffBalance.prototype, "remaining", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimeOffBalance.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeOffBalance.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TimeOffPolicy, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimeOffBalance.prototype, "policy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.policy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimeOffBalance.prototype, "policyId", void 0);
exports.TimeOffBalance = TimeOffBalance = tslib_1.__decorate([
    (0, entity_1.ColumnIndex)('IDX_time_off_balance_unique', ['tenantId', 'organizationId', 'employeeId', 'policyId', 'year'], {
        unique: true
    }),
    (0, entity_1.MultiORMEntity)('time_off_balance', { mikroOrmRepository: () => mikro_orm_time_off_balance_repository_1.MikroOrmTimeOffBalanceRepository })
], TimeOffBalance);
//# sourceMappingURL=time-off-balance.entity.js.map