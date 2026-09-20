"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategory = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_expense_category_repository_1 = require("./repository/mikro-orm-expense-category.repository");
let ExpenseCategory = class ExpenseCategory extends internal_1.TenantOrganizationBaseEntity {
};
exports.ExpenseCategory = ExpenseCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ExpenseCategory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Expense, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Expense, (expense) => expense.category, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], ExpenseCategory.prototype, "expenses", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Tag, isArray: true }),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.expenseCategories, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_expense_category',
        joinColumn: 'expenseCategoryId',
        inverseJoinColumn: 'tagId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization_expense_category'
    }),
    tslib_1.__metadata("design:type", Array)
], ExpenseCategory.prototype, "tags", void 0);
exports.ExpenseCategory = ExpenseCategory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('expense_category', { mikroOrmRepository: () => mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository })
], ExpenseCategory);
//# sourceMappingURL=expense-category.entity.js.map