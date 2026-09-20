"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const task_module_1 = require("../tasks/task.module");
const handlers_1 = require("./commands/handlers");
const handlers_2 = require("./queries/handlers");
const employee_recurring_expense_controller_1 = require("./employee-recurring-expense.controller");
const employee_recurring_expense_entity_1 = require("./employee-recurring-expense.entity");
const employee_recurring_expense_service_1 = require("./employee-recurring-expense.service");
const type_orm_employee_recurring_expense_repository_1 = require("./repository/type-orm-employee-recurring-expense.repository");
const mikro_orm_employee_recurring_expense_repository_1 = require("./repository/mikro-orm-employee-recurring-expense.repository");
let EmployeeRecurringExpenseModule = class EmployeeRecurringExpenseModule {
};
exports.EmployeeRecurringExpenseModule = EmployeeRecurringExpenseModule;
exports.EmployeeRecurringExpenseModule = EmployeeRecurringExpenseModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([employee_recurring_expense_entity_1.EmployeeRecurringExpense]),
            nestjs_1.MikroOrmModule.forFeature([employee_recurring_expense_entity_1.EmployeeRecurringExpense]),
            role_permission_module_1.RolePermissionModule,
            task_module_1.TaskModule,
            cqrs_1.CqrsModule
        ],
        controllers: [employee_recurring_expense_controller_1.EmployeeRecurringExpenseController],
        providers: [
            employee_recurring_expense_service_1.EmployeeRecurringExpenseService,
            type_orm_employee_recurring_expense_repository_1.TypeOrmEmployeeRecurringExpenseRepository, mikro_orm_employee_recurring_expense_repository_1.MikroOrmEmployeeRecurringExpenseRepository,
            ...handlers_2.QueryHandlers,
            ...handlers_1.CommandHandlers
        ],
        exports: [employee_recurring_expense_service_1.EmployeeRecurringExpenseService]
    })
], EmployeeRecurringExpenseModule);
//# sourceMappingURL=employee-recurring-expense.module.js.map