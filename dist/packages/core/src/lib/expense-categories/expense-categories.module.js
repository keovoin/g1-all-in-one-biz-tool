"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseCategoriesModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const expense_category_entity_1 = require("./expense-category.entity");
const expense_categories_service_1 = require("./expense-categories.service");
const expense_categories_controller_1 = require("./expense-categories.controller");
const handlers_1 = require("./commands/handlers");
const type_orm_expense_category_repository_1 = require("./repository/type-orm-expense-category.repository");
const mikro_orm_expense_category_repository_1 = require("./repository/mikro-orm-expense-category.repository");
let ExpenseCategoriesModule = class ExpenseCategoriesModule {
};
exports.ExpenseCategoriesModule = ExpenseCategoriesModule;
exports.ExpenseCategoriesModule = ExpenseCategoriesModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([expense_category_entity_1.ExpenseCategory]),
            nestjs_1.MikroOrmModule.forFeature([expense_category_entity_1.ExpenseCategory]),
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            cqrs_1.CqrsModule
        ],
        controllers: [expense_categories_controller_1.ExpenseCategoriesController],
        providers: [
            expense_categories_service_1.ExpenseCategoriesService,
            type_orm_expense_category_repository_1.TypeOrmExpenseCategoryRepository,
            mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [expense_categories_service_1.ExpenseCategoriesService, type_orm_expense_category_repository_1.TypeOrmExpenseCategoryRepository, mikro_orm_expense_category_repository_1.MikroOrmExpenseCategoryRepository]
    })
], ExpenseCategoriesModule);
//# sourceMappingURL=expense-categories.module.js.map