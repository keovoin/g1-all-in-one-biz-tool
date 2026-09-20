import { GlobalStats } from './stats.types';
import { EmployeeService } from '../employee/employee.service';
import { OrganizationService } from '../organization/organization.service';
import { TenantService } from '../tenant/tenant.service';
import { UserService } from '../user/user.service';
import { TaskService } from '../tasks/task.service';
import { InvoiceService } from '../invoice/invoice.service';
import { PaymentService } from '../payment/payment.service';
import { StatisticService } from '../time-tracking/statistic/statistic.service';
import { OrganizationTeamService } from '../organization-team/organization-team.service';
export declare class StatsService {
    readonly _employeeService: EmployeeService;
    readonly _organizationService: OrganizationService;
    readonly _organizationTeamService: OrganizationTeamService;
    readonly _tenantService: TenantService;
    readonly _userService: UserService;
    readonly _taskService: TaskService;
    readonly _invoiceService: InvoiceService;
    readonly _paymentService: PaymentService;
    readonly _statisticService: StatisticService;
    constructor(_employeeService: EmployeeService, _organizationService: OrganizationService, _organizationTeamService: OrganizationTeamService, _tenantService: TenantService, _userService: UserService, _taskService: TaskService, _invoiceService: InvoiceService, _paymentService: PaymentService, _statisticService: StatisticService);
    /**
     * Retrieves global statistics including the number of tenants, users, employees, organizations,
     * teams, invoice and payment statistics, overall tracked time, and more.
     *
     * This method aggregates various statistics from different services and returns them in a unified format.
     *
     * @returns {Promise<GlobalStats>} - A promise that resolves to an object containing global statistics.
     * @throws {Error} - Throws an error if there is an issue fetching any of the statistics.
     */
    getGlobalStats(): Promise<GlobalStats>;
}
