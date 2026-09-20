"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpense = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const pipes_1 = require("./../shared/pipes");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_recurring_expense_repository_1 = require("./repository/mikro-orm-organization-recurring-expense.repository");
let OrganizationRecurringExpense = class OrganizationRecurringExpense extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationRecurringExpense = OrganizationRecurringExpense;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 31 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "startDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "startMonth", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "startYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], OrganizationRecurringExpense.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 31 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "endDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "endMonth", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "endYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationRecurringExpense.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationRecurringExpense.prototype, "categoryName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], OrganizationRecurringExpense.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CurrenciesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationRecurringExpense.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationRecurringExpense.prototype, "splitExpense", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationRecurringExpense.prototype, "parentRecurringExpenseId", void 0);
exports.OrganizationRecurringExpense = OrganizationRecurringExpense = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_recurring_expense', { mikroOrmRepository: () => mikro_orm_organization_recurring_expense_repository_1.MikroOrmOrganizationRecurringExpenseRepository })
], OrganizationRecurringExpense);
//# sourceMappingURL=organization-recurring-expense.entity.js.map