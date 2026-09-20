"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../../shared");
const organization_recurring_expense_service_1 = require("../../organization-recurring-expense.service");
const organization_recurring_expense_delete_command_1 = require("../organization-recurring-expense.delete.command");
/**
 * Deletes a OrganizationRecurringExpense based on RecurringExpenseDeleteHandler
 */
let OrganizationRecurringExpenseDeleteHandler = class OrganizationRecurringExpenseDeleteHandler extends shared_1.RecurringExpenseDeleteHandler {
    constructor(organizationRecurringExpenseService) {
        super(organizationRecurringExpenseService);
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
    }
    //TODO: Fix typescript return <any>
    async execute(command) {
        const { id, deleteInput } = command;
        return await this.executeCommand(id, deleteInput);
    }
};
exports.OrganizationRecurringExpenseDeleteHandler = OrganizationRecurringExpenseDeleteHandler;
exports.OrganizationRecurringExpenseDeleteHandler = OrganizationRecurringExpenseDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_recurring_expense_delete_command_1.OrganizationRecurringExpenseDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], OrganizationRecurringExpenseDeleteHandler);
//# sourceMappingURL=organization-recurring-expense.delete.handler.js.map