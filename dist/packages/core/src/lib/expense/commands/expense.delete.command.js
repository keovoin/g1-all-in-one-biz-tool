"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseDeleteCommand = void 0;
class ExpenseDeleteCommand {
    constructor(employeeId, expenseId) {
        this.employeeId = employeeId;
        this.expenseId = expenseId;
    }
}
exports.ExpenseDeleteCommand = ExpenseDeleteCommand;
ExpenseDeleteCommand.type = '[Expense] Delete';
//# sourceMappingURL=expense.delete.command.js.map