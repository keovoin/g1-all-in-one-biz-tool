"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindRecurringExpenseByMonthHandler = void 0;
const typeorm_1 = require("typeorm");
const moment = require("moment");
const utils_1 = require("./../../core/utils");
const context_1 = require("./../../core/context");
/**
 * Finds income, expense, profit and bonus for all organizations for the given month.
 *
 * (start date) < (input date) < (end date, null for end date is treated as infinity)
 *
 * If year is different, only company year.
 * If year is same, compare month
 */
class FindRecurringExpenseByMonthHandler {
    //TODO: Change CrudService<any> to be more specific
    constructor(crudService) {
        this.crudService = crudService;
    }
    async executeCommand(input, relations) {
        const { organizationId, employeeId, startDate, endDate } = input;
        const tenantId = context_1.RequestContext.currentTenantId();
        let where = {
            organizationId,
            tenantId
        };
        where = employeeId ? { employeeId, ...where } : { ...where };
        if (input.parentRecurringExpenseId) {
            where = {
                ...where,
                parentRecurringExpenseId: input.parentRecurringExpenseId
            };
        }
        const { start, end } = (0, utils_1.getDateRangeFormat)(moment.utc(startDate), moment.utc(endDate));
        const expenses = await this.crudService.findAll({
            where: [
                {
                    ...where,
                    startDate: (0, typeorm_1.Between)(start, end),
                    endDate: (0, typeorm_1.IsNull)()
                },
                {
                    ...where,
                    startDate: (0, typeorm_1.LessThanOrEqual)(start),
                    endDate: (0, typeorm_1.MoreThanOrEqual)(end)
                }
            ],
            relations
        });
        return expenses;
    }
}
exports.FindRecurringExpenseByMonthHandler = FindRecurringExpenseByMonthHandler;
//# sourceMappingURL=recurring-expense.find-by-month.handler.js.map