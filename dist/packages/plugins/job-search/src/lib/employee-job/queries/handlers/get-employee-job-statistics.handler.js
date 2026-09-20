"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetEmployeeJobStatisticsHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const get_employee_job_statistics_query_1 = require("../get-employee-job-statistics.query");
let GetEmployeeJobStatisticsHandler = class GetEmployeeJobStatisticsHandler {
    /**
     *
     * @param employeeService
     * @param gauzyAIService
     */
    constructor(employeeService, gauzyAIService) {
        this.employeeService = employeeService;
        this.gauzyAIService = gauzyAIService;
    }
    /**
     * Executes the GetEmployeeJobStatisticsQuery to fetch paginated employee data
     * and augment it with additional statistics.
     *
     * @param query - The query containing options for pagination.
     * @returns A Promise resolving to an IPagination<IEmployee> with augmented data.
     */
    async execute(query) {
        const { options } = query;
        // Check for permission CHANGE_SELECTED_EMPLOYEE
        if (!core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
            // Filter by current employee ID if the permission is not present. A caller with no employee
            // identity sees nothing — assigning null here used to drop the predicate and page through
            // every employee of the tenant.
            const employeeId = core_1.RequestContext.currentEmployeeId();
            if (!employeeId) {
                return { items: [], total: 0 };
            }
            options.where.id = employeeId;
        }
        // Use Promise.all for concurrent requests
        const [paginationResult, employeesStatistics] = await Promise.all([
            this.employeeService.paginate(options),
            this.gauzyAIService.getEmployeesStatistics()
        ]);
        let { items, total } = paginationResult;
        // Create a map for faster lookup
        const employeesStatisticsById = new Map(employeesStatistics.map((statistic) => [statistic.employeeId, statistic]));
        // Combine mappings into a single map function
        items = items.map((employee) => ({
            ...employee,
            ...(employeesStatisticsById.get(employee.id) || {}) // Use empty object if not found
        }));
        return { items, total };
    }
};
exports.GetEmployeeJobStatisticsHandler = GetEmployeeJobStatisticsHandler;
exports.GetEmployeeJobStatisticsHandler = GetEmployeeJobStatisticsHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_employee_job_statistics_query_1.GetEmployeeJobStatisticsQuery),
    tslib_1.__metadata("design:paramtypes", [core_1.EmployeeService, plugin_integration_ai_1.GauzyAIService])
], GetEmployeeJobStatisticsHandler);
//# sourceMappingURL=get-employee-job-statistics.handler.js.map