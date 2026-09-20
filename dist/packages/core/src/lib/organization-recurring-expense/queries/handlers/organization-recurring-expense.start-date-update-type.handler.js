"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationRecurringExpenseUpdateTypeHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const recurring_expense_find_update_type_handler_1 = require("../../../shared/handlers/recurring-expense.find-update-type.handler");
const organization_recurring_expense_service_1 = require("../../organization-recurring-expense.service");
const organization_recurring_expense_update_type_query_1 = require("../organization-recurring-expense.update-type.query");
let OrganizationRecurringExpenseUpdateTypeHandler = class OrganizationRecurringExpenseUpdateTypeHandler extends recurring_expense_find_update_type_handler_1.FindRecurringExpenseStartDateUpdateTypeHandler {
    constructor(organizationRecurringExpenseService) {
        super(organizationRecurringExpenseService);
        this.organizationRecurringExpenseService = organizationRecurringExpenseService;
    }
    async execute(command) {
        return await this.executeQuery(command.input);
    }
};
exports.OrganizationRecurringExpenseUpdateTypeHandler = OrganizationRecurringExpenseUpdateTypeHandler;
exports.OrganizationRecurringExpenseUpdateTypeHandler = OrganizationRecurringExpenseUpdateTypeHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(organization_recurring_expense_update_type_query_1.OrganizationRecurringExpenseStartDateUpdateTypeQuery),
    tslib_1.__metadata("design:paramtypes", [organization_recurring_expense_service_1.OrganizationRecurringExpenseService])
], OrganizationRecurringExpenseUpdateTypeHandler);
//# sourceMappingURL=organization-recurring-expense.start-date-update-type.handler.js.map