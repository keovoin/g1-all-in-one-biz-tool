import { UpdateEmployeeJobsStatistics } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
/**
 * Employee Job Statistic DTO
 */
export declare class EmployeeJobStatisticDTO extends TenantOrganizationBaseDTO implements UpdateEmployeeJobsStatistics {
    isJobSearchActive: boolean;
}
