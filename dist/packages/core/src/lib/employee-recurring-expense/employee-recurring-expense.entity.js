"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpense = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const internal_1 = require("../core/entities/internal");
const pipes_1 = require("./../shared/pipes");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_employee_recurring_expense_repository_1 = require("./repository/mikro-orm-employee-recurring-expense.repository");
let EmployeeRecurringExpense = class EmployeeRecurringExpense extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmployeeRecurringExpense = EmployeeRecurringExpense;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 31 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "startDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "startMonth", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "startYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], EmployeeRecurringExpense.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 31 }),
    (0, class_validator_1.IsNumber)(),
    (0, common_1.Optional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(31),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "endDay", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1, maximum: 12 }),
    (0, class_validator_1.IsNumber)(),
    (0, common_1.Optional)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "endMonth", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, common_1.Optional)(),
    (0, class_validator_1.Min)(0),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "endYear", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], EmployeeRecurringExpense.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmployeeRecurringExpense.prototype, "categoryName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], EmployeeRecurringExpense.prototype, "value", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.CurrenciesEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmployeeRecurringExpense.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeRecurringExpense.prototype, "parentRecurringExpenseId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        onDelete: 'CASCADE',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], EmployeeRecurringExpense.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, nullable: true }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], EmployeeRecurringExpense.prototype, "employeeId", void 0);
exports.EmployeeRecurringExpense = EmployeeRecurringExpense = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee_recurring_expense', { mikroOrmRepository: () => mikro_orm_employee_recurring_expense_repository_1.MikroOrmEmployeeRecurringExpenseRepository })
], EmployeeRecurringExpense);
//# sourceMappingURL=employee-recurring-expense.entity.js.map