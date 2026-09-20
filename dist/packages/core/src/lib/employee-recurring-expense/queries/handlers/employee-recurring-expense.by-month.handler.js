"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseByMonthHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../../shared");
const employee_recurring_expense_service_1 = require("../../employee-recurring-expense.service");
const employee_recurring_expense_by_month_query_1 = require("../employee-recurring-expense.by-month.query");
/**
 * Finds income, expense, profit and bonus for all employees for the given month.
 *
 * (start date) < (input date) < (end date, null for end date is treated as infinity)
 *
 * If year is different, only company year.
 * If year is same, compare month
 */
let EmployeeRecurringExpenseByMonthHandler = class EmployeeRecurringExpenseByMonthHandler extends shared_1.FindRecurringExpenseByMonthHandler {
    constructor(employeeRecurringExpenseService) {
        super(employeeRecurringExpenseService);
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
    }
    async execute(command) {
        const { input, relations = [] } = command;
        return await this.executeCommand(input, relations);
    }
};
exports.EmployeeRecurringExpenseByMonthHandler = EmployeeRecurringExpenseByMonthHandler;
exports.EmployeeRecurringExpenseByMonthHandler = EmployeeRecurringExpenseByMonthHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(employee_recurring_expense_by_month_query_1.EmployeeRecurringExpenseByMonthQuery),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService])
], EmployeeRecurringExpenseByMonthHandler);
//# sourceMappingURL=employee-recurring-expense.by-month.handler.js.map