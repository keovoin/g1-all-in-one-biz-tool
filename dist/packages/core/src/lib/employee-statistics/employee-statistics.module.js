"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeStatisticsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const employee_recurring_expense_module_1 = require("../employee-recurring-expense/employee-recurring-expense.module");
const expense_module_1 = require("../expense/expense.module");
const income_module_1 = require("../income/income.module");
const organization_module_1 = require("../organization/organization.module");
const organization_recurring_expense_module_1 = require("../organization-recurring-expense/organization-recurring-expense.module");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const employee_module_1 = require("../employee/employee.module");
const employee_statistics_controller_1 = require("./employee-statistics.controller");
const employee_statistics_service_1 = require("./employee-statistics.service");
const handlers_1 = require("./queries/handlers");
let EmployeeStatisticsModule = class EmployeeStatisticsModule {
};
exports.EmployeeStatisticsModule = EmployeeStatisticsModule;
exports.EmployeeStatisticsModule = EmployeeStatisticsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            role_permission_module_1.RolePermissionModule,
            employee_module_1.EmployeeModule,
            organization_module_1.OrganizationModule,
            organization_recurring_expense_module_1.OrganizationRecurringExpenseModule,
            employee_recurring_expense_module_1.EmployeeRecurringExpenseModule,
            (0, common_1.forwardRef)(() => income_module_1.IncomeModule),
            (0, common_1.forwardRef)(() => expense_module_1.ExpenseModule),
            cqrs_1.CqrsModule
        ],
        controllers: [employee_statistics_controller_1.EmployeeStatisticsController],
        providers: [employee_statistics_service_1.EmployeeStatisticsService, ...handlers_1.QueryHandlers],
        exports: [employee_statistics_service_1.EmployeeStatisticsService]
    })
], EmployeeStatisticsModule);
//# sourceMappingURL=employee-statistics.module.js.map