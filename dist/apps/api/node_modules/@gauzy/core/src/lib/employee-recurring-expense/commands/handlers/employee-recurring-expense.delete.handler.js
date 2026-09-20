"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../../shared");
const employee_recurring_expense_service_1 = require("../../employee-recurring-expense.service");
const employee_recurring_expense_delete_command_1 = require("../employee-recurring-expense.delete.command");
/**
 * Deletes a EmployeeRecurringExpense based on command.deleteInput.deletionType:
 *
 * 1. ALL: Delete all entries for an expense (By actually deleting it from the db)
 * 2. FUTURE : Delete only current and future events (By reducing the end date)
 * 3. CURRENT : Delete only one month (By splitting the expense into two)
 *
 */
let EmployeeRecurringExpenseDeleteHandler = class EmployeeRecurringExpenseDeleteHandler extends shared_1.RecurringExpenseDeleteHandler {
    constructor(employeeRecurringExpenseService) {
        super(employeeRecurringExpenseService);
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
    }
    async execute(command) {
        const { id, deleteInput } = command;
        return await this.executeCommand(id, deleteInput);
    }
};
exports.EmployeeRecurringExpenseDeleteHandler = EmployeeRecurringExpenseDeleteHandler;
exports.EmployeeRecurringExpenseDeleteHandler = EmployeeRecurringExpenseDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_recurring_expense_delete_command_1.EmployeeRecurringExpenseDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService])
], EmployeeRecurringExpenseDeleteHandler);
//# sourceMappingURL=employee-recurring-expense.delete.handler.js.map