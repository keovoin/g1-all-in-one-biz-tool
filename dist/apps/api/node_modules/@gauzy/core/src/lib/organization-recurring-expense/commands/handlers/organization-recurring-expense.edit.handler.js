"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseEditHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../../shared");
const organization_recurring_expense_service_1 = require("../../organization-recurring-expense.service");
const organization_recurring_expense_update_type_query_1 = require("../../queries/organization-recurring-expense.update-type.query");
const organization_recurring_expense_edit_command_1 = require("../organization-recurring-expense.edit.command");
/**
 * This edits a recurring expense.
 * To edit a recurring expense
 * 1. Change the end date of the original expense so that old value is not modified for previous expense.
 * 2. Create a new expense to have new values for all future dates.
 */
let OrganizationRecurringExpenseEditHandler = class OrganizationRecurringExpenseEditHandler extends shared_1.RecurringExpenseEditHandler {
    constructor(organizationRecurringExpenseService, queryBus) {
        super(organizationRecurringExpenseService);
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
        this.queryBus = queryBus;
    }
    async execute(command) {
        const { id, input } = command;
        const updateType = await this.queryBus.execute(new organization_recurring_expense_update_type_query_1.OrganizationRecurringExpenseStartDateUpdateTypeQuery({
            newStartDate: new Date(input.startYear, input.startMonth, input.startDay),
            recurringExpenseId: id
        }));
        return await this.executeCommand(id, {
            ...input,
            startDateUpdateType: updateType.value
        });
    }
};
exports.OrganizationRecurringExpenseEditHandler = OrganizationRecurringExpenseEditHandler;
exports.OrganizationRecurringExpenseEditHandler = OrganizationRecurringExpenseEditHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(organization_recurring_expense_edit_command_1.OrganizationRecurringExpenseEditCommand),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_service_1.OrganizationRecurringExpenseService,
        cqrs_1.QueryBus])
], OrganizationRecurringExpenseEditHandler);
//# sourceMappingURL=organization-recurring-expense.edit.handler.js.map