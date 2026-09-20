"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const cqrs_1 = require("@nestjs/cqrs");
const nestjs_1 = require("@mikro-orm/nestjs");
const income_entity_1 = require("./income.entity");
const income_service_1 = require("./income.service");
const income_controller_1 = require("./income.controller");
const handlers_1 = require("./commands/handlers");
const employee_recurring_expense_module_1 = require("./../employee-recurring-expense/employee-recurring-expense.module");
const employee_statistics_module_1 = require("./../employee-statistics/employee-statistics.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const expense_module_1 = require("./../expense/expense.module");
const employee_module_1 = require("./../employee/employee.module");
const organization_recurring_expense_module_1 = require("./../organization-recurring-expense/organization-recurring-expense.module");
const type_orm_income_repository_1 = require("./repository/type-orm-income.repository");
const mikro_orm_income_repository_1 = require("./repository/mikro-orm-income.repository");
let IncomeModule = class IncomeModule {
};
exports.IncomeModule = IncomeModule;
exports.IncomeModule = IncomeModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([income_entity_1.Income]),
            nestjs_1.MikroOrmModule.forFeature([income_entity_1.Income]),
            cqrs_1.CqrsModule,
            (0, common_1.forwardRef)(() => role_permission_module_1.RolePermissionModule),
            (0, common_1.forwardRef)(() => employee_module_1.EmployeeModule),
            (0, common_1.forwardRef)(() => expense_module_1.ExpenseModule),
            (0, common_1.forwardRef)(() => employee_recurring_expense_module_1.EmployeeRecurringExpenseModule),
            (0, common_1.forwardRef)(() => organization_recurring_expense_module_1.OrganizationRecurringExpenseModule),
            (0, common_1.forwardRef)(() => employee_statistics_module_1.EmployeeStatisticsModule)
        ],
        controllers: [income_controller_1.IncomeController],
        providers: [income_service_1.IncomeService, type_orm_income_repository_1.TypeOrmIncomeRepository, mikro_orm_income_repository_1.MikroOrmIncomeRepository, ...handlers_1.CommandHandlers],
        exports: [income_service_1.IncomeService]
    })
], IncomeModule);
//# sourceMappingURL=income.module.js.map