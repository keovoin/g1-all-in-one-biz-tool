"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const income_service_1 = require("../../income.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
const income_delete_command_1 = require("../income.delete.command");
let IncomeDeleteHandler = class IncomeDeleteHandler {
    constructor(incomeService, employeeService, employeeStatisticsService) {
        this.incomeService = incomeService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    /**
     * Deletes an income record and updates the employee's statistics if necessary.
     *
     * @param command - The command containing the income ID to delete and the optional employee ID.
     * @returns A promise that resolves with the result of the delete operation.
     * @throws BadRequestException if there is an error updating employee statistics.
     */
    async execute(command) {
        const { incomeId, employeeId } = command;
        // Delete the income
        const result = await this.deleteIncome(incomeId);
        try {
            if ((0, utils_1.isNotEmpty)(employeeId)) {
                // Fetch statistics and calculate averages
                const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(employeeId);
                const averageIncome = this.incomeService.countStatistic(stat.incomeStatistics);
                const averageBonus = this.incomeService.countStatistic(stat.bonusStatistics);
                // Update employee with the calculated averages
                await this.employeeService.create({
                    id: employeeId,
                    averageIncome,
                    averageBonus
                });
            }
        }
        catch (error) {
            throw new common_1.BadRequestException('Error while updating employee statistics', error);
        }
        return result;
    }
    /**
     * Deletes income by ID with permission check
     *
     * @param incomeId - The ID of the income to delete
     * @returns Promise<DeleteResult> - The result of the delete operation
     */
    async deleteIncome(incomeId) {
        // Tenant scoping and the "own records only" restriction for callers without
        // CHANGE_SELECTED_EMPLOYEE are injected by TenantAwareCrudService.delete(); an explicit
        // `employeeId: RequestContext.currentEmployeeId()` here was redundant and null for callers
        // without an employee record (a null TypeORM used to drop silently). Keep it to the id.
        const deleteQuery = { id: incomeId };
        try {
            return await this.incomeService.delete(deleteQuery);
        }
        catch (error) {
            throw new common_1.ForbiddenException('You do not have permission to delete this income.');
        }
    }
};
exports.IncomeDeleteHandler = IncomeDeleteHandler;
exports.IncomeDeleteHandler = IncomeDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(income_delete_command_1.IncomeDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [income_service_1.IncomeService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], IncomeDeleteHandler);
//# sourceMappingURL=income.delete.handler.js.map