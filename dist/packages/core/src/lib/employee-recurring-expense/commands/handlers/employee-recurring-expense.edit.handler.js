"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRecurringExpenseEditHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const cqrs_1 = require("@nestjs/cqrs");
const context_1 = require("../../../core/context");
const shared_1 = require("../../../shared");
const employee_recurring_expense_service_1 = require("../../employee-recurring-expense.service");
const employee_recurring_expense_update_type_query_1 = require("../../queries/employee-recurring-expense.update-type.query");
const employee_recurring_expense_edit_command_1 = require("../employee-recurring-expense.edit.command");
/**
 * This edits the value of a recurring expense.
 * To edit a recurring expense
 * 1. Change the end date of the original expense so that old value is not modified for previous expense.
 * 2. Create a new expense to have new values for all future dates.
 */
let EmployeeRecurringExpenseEditHandler = class EmployeeRecurringExpenseEditHandler extends shared_1.RecurringExpenseEditHandler {
    constructor(employeeRecurringExpenseService, queryBus) {
        super(employeeRecurringExpenseService);
        this.employeeRecurringExpenseService = employeeRecurringExpenseService;
        this.queryBus = queryBus;
    }
    /**
     * Employee recurring expenses are the only flavour with an `employeeId` column, so this is
     * where the assignment is resolved (the shared base class deliberately does nothing — see
     * `RecurringExpenseEditHandler.assignEmployeeId`).
     *
     * Three distinct inputs, three distinct meanings (#8889):
     * - `undefined` — the caller never mentioned the field, so leave the assignment as it is.
     * - `null` — a deliberate switch to "All Employees"; it must be persisted, not dropped.
     *   The UI sends exactly this: `RecurringExpensesEmployeeComponent` maps the
     *   ALL_EMPLOYEES_SELECTED sentinel (whose `id` is `null`) to `employeeId: null`.
     * - `''` — not a valid id and not the "untouched" signal. `EmployeeFeatureDTO` types
     *   `employeeId` with `@IsString()`, which accepts an empty string, so it can actually
     *   reach here; treat it as "untouched" rather than persist it.
     *
     * A caller without `CHANGE_SELECTED_EMPLOYEE` does not get to choose any of that: their own
     * employee id is the only assignment they may write, exactly as
     * `EmployeeRecurringExpenseCreateHandler` already enforces on create. That guard has to live
     * here because `TenantAwareCrudService.update()` does not apply one — it only scopes the row to
     * the caller's tenant. Until #8889 the edit path never wrote `employeeId` at all, so honoring
     * the caller's value without this check would newly let an unprivileged user reassign an
     * expense to a colleague, or to "All Employees" — an option the employee selector only offers
     * when this permission is present.
     *
     * @param target The update/create object being assembled.
     * @param input The caller's edit input.
     * @param originalExpense The expense being edited. Only supplied on the replacement-row path,
     * where the new row should inherit the original's employee if the caller did not pick one.
     */
    assignEmployeeId(target, input, originalExpense) {
        if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            target.employeeId = context_1.RequestContext.currentEmployeeId();
            return;
        }
        if (input.employeeId !== undefined && input.employeeId !== '') {
            target.employeeId = input.employeeId;
        }
        else if (originalExpense?.employeeId) {
            target.employeeId = originalExpense.employeeId;
        }
    }
    async execute(command) {
        const { id, input } = command;
        //TODO: Remove this, RecurringExpenseEditHandler should not need startDateUpdateType
        const updateType = await this.queryBus.execute(new employee_recurring_expense_update_type_query_1.EmployeeRecurringExpenseStartDateUpdateTypeQuery({
            newStartDate: new Date(input.startYear, input.startMonth, input.startDay),
            recurringExpenseId: id
        }));
        return await this.executeCommand(id, {
            ...input,
            startDateUpdateType: updateType.value
        });
    }
};
exports.EmployeeRecurringExpenseEditHandler = EmployeeRecurringExpenseEditHandler;
exports.EmployeeRecurringExpenseEditHandler = EmployeeRecurringExpenseEditHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(employee_recurring_expense_edit_command_1.EmployeeRecurringExpenseEditCommand),
    tslib_1.__metadata("design:paramtypes", [employee_recurring_expense_service_1.EmployeeRecurringExpenseService,
        cqrs_1.QueryBus])
], EmployeeRecurringExpenseEditHandler);
//# sourceMappingURL=employee-recurring-expense.edit.handler.js.map