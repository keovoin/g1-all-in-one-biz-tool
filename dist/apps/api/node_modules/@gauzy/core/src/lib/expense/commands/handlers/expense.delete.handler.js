"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const expense_service_1 = require("../../expense.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
const expense_delete_command_1 = require("../expense.delete.command");
let ExpenseDeleteHandler = class ExpenseDeleteHandler {
    constructor(expenseService, employeeService, employeeStatisticsService) {
        this.expenseService = expenseService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    /**
     * Executes the deletion of an expense and updates the employee's average expenses if applicable.
     *
     * @param command - The command containing the expense ID to delete and the optional employee ID.
     * @returns A promise that resolves with the result of the delete operation.
     * @throws BadRequestException if there is an error updating employee average expenses.
     */
    async execute(command) {
        const { expenseId, employeeId } = command;
        // Delete the expense by ID
        const result = await this.deleteExpense(expenseId);
        try {
            // If employeeId exists, update the employee's average expenses
            if ((0, utils_1.isNotEmpty)(employeeId)) {
                const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(employeeId);
                const averageExpense = this.expenseService.countStatistic(stat.expenseStatistics);
                await this.employeeService.create({
                    id: employeeId,
                    averageExpenses: averageExpense
                });
            }
        }
        catch (error) {
            console.error('Error while updating employee average expenses', error);
            throw new common_1.BadRequestException('Error while updating employee average expenses');
        }
        return result;
    }
    /**
     * Delete the expense based on user permissions
     *
     * @param expenseId - The ID of the expense to delete
     * @returns Promise<DeleteResult> - The result of the delete operation
     */
    async deleteExpense(expenseId) {
        // Tenant scoping and the "own records only" restriction for callers without
        // CHANGE_SELECTED_EMPLOYEE are injected by TenantAwareCrudService.delete(). Spelling
        // `employeeId: RequestContext.currentEmployeeId()` out here was redundant — and, because that
        // helper is null for callers without an employee record, put a null into the criteria (which
        // TypeORM used to drop silently). Keep the criteria to the id.
        const query = { id: expenseId };
        try {
            return await this.expenseService.delete(query);
        }
        catch (error) {
            throw new common_1.ForbiddenException('You do not have permission to delete this expense.');
        }
    }
};
exports.ExpenseDeleteHandler = ExpenseDeleteHandler;
exports.ExpenseDeleteHandler = ExpenseDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(expense_delete_command_1.ExpenseDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [expense_service_1.ExpenseService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], ExpenseDeleteHandler);
//# sourceMappingURL=expense.delete.handler.js.map