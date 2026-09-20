"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const organization_recurring_expense_service_1 = require("../../organization-recurring-expense.service");
const organization_recurring_expense_create_command_1 = require("../organization-recurring-expense.create.command");
let OrganizationRecurringExpenseCreateHandler = class OrganizationRecurringExpenseCreateHandler {
    constructor(organizationRecurringExpenseService) {
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
    }
    async execute(command) {
        const { input } = command;
        const createdExpense = await this.organizationRecurringExpenseService.create(input);
        await this.organizationRecurringExpenseService.update(createdExpense.id, {
            parentRecurringExpenseId: createdExpense.id
        });
        return {
            ...createdExpense,
            parentRecurringExpenseId: createdExpense.id
        };
    }
};
exports.OrganizationRecurringExpenseCreateHandler = OrganizationRecurringExpenseCreateHandler;
exports.OrganizationRecurringExpenseCreateHandler = OrganizationRecurringExpenseCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_recurring_expense_create_command_1.OrganizationRecurringExpenseCreateCommand),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], OrganizationRecurringExpenseCreateHandler);
//# sourceMappingURL=organization-recurring-expense.create.handler.js.map