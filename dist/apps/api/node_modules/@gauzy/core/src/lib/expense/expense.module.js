"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const expense_entity_1 = require("./expense.entity");
const expense_service_1 = require("./expense.service");
const expense_controller_1 = require("./expense.controller");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const employee_statistics_module_1 = require("./../employee-statistics/employee-statistics.module");
const employee_recurring_expense_module_1 = require("./../employee-recurring-expense/employee-recurring-expense.module");
const income_module_1 = require("./../income/income.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const expense_map_service_1 = require("./expense.map.service");
const employee_module_1 = require("./../employee/employee.module");
const organization_recurring_expense_module_1 = require("./../organization-recurring-expense/organization-recurring-expense.module");
const type_orm_expense_repository_1 = require("./repository/type-orm-expense.repository");
const mikro_orm_expense_repository_1 = require("./repository/mikro-orm-expense.repository");
let ExpenseModule = class ExpenseModule {
};
exports.ExpenseModule = ExpenseModule;
exports.ExpenseModule = ExpenseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([expense_entity_1.Expense]),
            nestjs_1.MikroOrmModule.forFeature([expense_entity_1.Expense]),
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            (0, common_1.forwardRef)(() => employee_statistics_module_1.EmployeeStatisticsModule),
            (0, common_1.forwardRef)(() => employee_recurring_expense_module_1.EmployeeRecurringExpenseModule),
            (0, common_1.forwardRef)(() => organization_recurring_expense_module_1.OrganizationRecurringExpenseModule),
            (0, common_1.forwardRef)(() => income_module_1.IncomeModule),
            cqrs_1.CqrsModule
        ],
        controllers: [expense_controller_1.ExpenseController],
        providers: [expense_service_1.ExpenseService, expense_map_service_1.ExpenseMapService, type_orm_expense_repository_1.TypeOrmExpenseRepository, mikro_orm_expense_repository_1.MikroOrmExpenseRepository, ...handlers_1.CommandHandlers, ...handlers_2.QueryHandlers],
        exports: [expense_service_1.ExpenseService, expense_map_service_1.ExpenseMapService]
    })
], ExpenseModule);
//# sourceMappingURL=expense.module.js.map