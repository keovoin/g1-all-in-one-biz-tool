"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseUpdateCommand = void 0;
class ExpenseUpdateCommand {
    constructor(id, entity) {
        this.id = id;
        this.entity = entity;
    }
}
exports.ExpenseUpdateCommand = ExpenseUpdateCommand;
ExpenseUpdateCommand.type = '[Expense] Update';
//# sourceMappingURL=expense.update.command.js.map