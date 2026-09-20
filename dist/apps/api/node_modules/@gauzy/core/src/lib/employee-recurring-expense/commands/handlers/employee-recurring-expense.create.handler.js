"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseCreateHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("./../../../core/context");
const employee_recurring_expense_service_1 = require("../../employee-recurring-expense.service");
const employee_recurring_expense_create_command_1 = require("../employee-recurring-expense.create.command");
/**
 * Creates a recurring expense for an employee.
 * The parentRecurringExpenseId is it's own id since this is a new expense.
 */
let EmployeeRecurringExpenseCreateHandler = class EmployeeRecurringExpenseCreateHandler {
    constructor(employeeRecurringExpenseService) {
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
    }
    /**
     * Executes the command to create a recurring expense for an employee.
     *
     * @param command - The command containing the input data for creating the recurring expense.
     * @returns A promise that resolves with the created employee recurring expense.
     * @throws BadRequestException if there is an error during the creation process.
     */
    async execute(command) {
        try {
            const { input } = command;
            // If the user does not have permission to change the selected employee, set the current employee's ID
            if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                input.employeeId = context_1.RequestContext.currentEmployeeId();
            }
            // Create the recurring expense
            const recurringExpense = await this.employeeRecurringExpenseService.create(input);
            // Update the parent recurring expense to reference itself
            await this.employeeRecurringExpenseService.update(recurringExpense.id, {
                parentRecurringExpenseId: recurringExpense.id
            });
            // Return the newly created recurring expense
            return await this.employeeRecurringExpenseService.findOneByIdString(recurringExpense.id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.EmployeeRecurringExpenseCreateHandler = EmployeeRecurringExpenseCreateHandler;
exports.EmployeeRecurringExpenseCreateHandler = EmployeeRecurringExpenseCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_recurring_expense_create_command_1.EmployeeRecurringExpenseCreateCommand),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService])
], EmployeeRecurringExpenseCreateHandler);
//# sourceMappingURL=employee-recurring-expense.create.handler.js.map