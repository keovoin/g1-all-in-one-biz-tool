"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const employee_service_1 = require("../employee/employee.service");
const organization_service_1 = require("../organization/organization.service");
const tenant_service_1 = require("../tenant/tenant.service");
const user_service_1 = require("../user/user.service");
const task_service_1 = require("../tasks/task.service");
const invoice_service_1 = require("../invoice/invoice.service");
const payment_service_1 = require("../payment/payment.service");
const statistic_service_1 = require("../time-tracking/statistic/statistic.service");
const organization_team_service_1 = require("../organization-team/organization-team.service");
let StatsService = class StatsService {
    constructor(_employeeService, _organizationService, _organizationTeamService, _tenantService, _userService, _taskService, _invoiceService, _paymentService, _statisticService) {
        this._employeeService = _employeeService;
        this._organizationService = _organizationService;
        this._organizationTeamService = _organizationTeamService;
        this._tenantService = _tenantService;
        this._userService = _userService;
        this._taskService = _taskService;
        this._invoiceService = _invoiceService;
        this._paymentService = _paymentService;
        this._statisticService = _statisticService;
    }
    /**
     * Retrieves global statistics including the number of tenants, users, employees, organizations,
     * teams, invoice and payment statistics, overall tracked time, and more.
     *
     * This method aggregates various statistics from different services and returns them in a unified format.
     *
     * @returns {Promise<GlobalStats>} - A promise that resolves to an object containing global statistics.
     * @throws {Error} - Throws an error if there is an issue fetching any of the statistics.
     */
    async getGlobalStats() {
        try {
            // Fetch statistics from different services
            const [employeeCount, taskCount, organizationCount, teamCount, tenantCount, invoiceStats, paymentStats, userStats, totalTrackedTime] = await Promise.all([
                this._employeeService.count(), // Count the number of employees
                this._taskService.count(), // Count the number of tasks
                this._organizationService.count(), // Count the number of organizations
                this._organizationTeamService.count(), // Count the number of teams
                this._tenantService.count(), // Count the number of tenants
                this._invoiceService.getInvoiceStats(), // Get invoice stats
                this._paymentService.getPaymentStats(), // Get payment stats
                this._userService.getUserStats(), // Total users and last month’s active users
                this._statisticService.getOverallTrackedTime() // Fetch the overall tracked time
            ]);
            // Return the global stats as an object
            return {
                employees: employeeCount,
                tasks: taskCount,
                organizations: organizationCount,
                teams: teamCount,
                tenants: tenantCount,
                invoices: invoiceStats,
                payments: paymentStats,
                users: userStats,
                hours: totalTrackedTime
            };
        }
        catch (error) {
            // Log the error and throw a custom error message
            console.error('Error fetching global stats:', error);
            throw new Error(`Failed to retrieve global statistics: ${error.message}`);
        }
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [employee_service_1.EmployeeService,
        organization_service_1.OrganizationService,
        organization_team_service_1.OrganizationTeamService,
        tenant_service_1.TenantService,
        user_service_1.UserService,
        task_service_1.TaskService,
        invoice_service_1.InvoiceService,
        payment_service_1.PaymentService,
        statistic_service_1.StatisticService])
], StatsService);
//# sourceMappingURL=stats.service.js.map