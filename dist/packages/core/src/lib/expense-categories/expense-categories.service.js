"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoriesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_expense_category_repository_1 = require("./repository/type-orm-expense-category.repository");
const mikro_orm_expense_category_repository_1 = require("./repository/mikro-orm-expense-category.repository");
let ExpenseCategoriesService = class ExpenseCategoriesService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmExpenseCategoryRepository, mikroOrmExpenseCategoryRepository) {
        super(typeOrmExpenseCategoryRepository, mikroOrmExpenseCategoryRepository);
    }
};
exports.ExpenseCategoriesService = ExpenseCategoriesService;
exports.ExpenseCategoriesService = ExpenseCategoriesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_expense_category_repository_1.TypeOrmExpenseCategoryRepository,
        mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository])
], ExpenseCategoriesService);
//# sourceMappingURL=expense-categories.service.js.map