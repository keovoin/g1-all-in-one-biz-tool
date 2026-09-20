"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const utils_1 = require("@gauzy/utils");
const income_service_1 = require("../../income.service");
const employee_service_1 = require("../../../employee/employee.service");
const employee_statistics_1 = require("../../../employee-statistics");
const income_update_command_1 = require("../income.update.command");
let IncomeUpdateHandler = class IncomeUpdateHandler {
    constructor(incomeService, employeeService, employeeStatisticsService) {
        this.incomeService = incomeService;
        this.employeeService = employeeService;
        this.employeeStatisticsService = employeeStatisticsService;
    }
    async execute(command) {
        const { id, entity } = command;
        try {
            await this.incomeService.findOneByIdString(id);
            const income = await this.incomeService.create({ ...entity, id });
            let averageIncome = 0;
            let averageBonus = 0;
            if ((0, utils_1.isNotEmpty)(income.employeeId)) {
                const { employeeId } = income;
                const stat = await this.employeeStatisticsService.getStatisticsByEmployeeId(income.employeeId);
                averageIncome = this.incomeService.countStatistic(stat.incomeStatistics);
                averageBonus = this.incomeService.countStatistic(stat.bonusStatistics);
                await this.employeeService.create({
                    id: employeeId,
                    averageIncome: averageIncome,
                    averageBonus: averageBonus
                });
            }
            return income;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.IncomeUpdateHandler = IncomeUpdateHandler;
exports.IncomeUpdateHandler = IncomeUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(income_update_command_1.IncomeUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [income_service_1.IncomeService,
        employee_service_1.EmployeeService,
        employee_statistics_1.EmployeeStatisticsService])
], IncomeUpdateHandler);
//# sourceMappingURL=income.update.handler.js.map