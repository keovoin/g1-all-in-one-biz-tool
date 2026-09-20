import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
/**
 * Create random OrganizationTeamEmployee entries for each tenant, organization, and employee.
 *
 * @param dataSource - The data source instance for managing database operations
 * @param tenants - List of tenants to create OrganizationTeamEmployees for
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations
 * @param organizationEmployeesMap - A map linking each organization to its employees
 * @returns void
 */
export declare const createRandomOrganizationTeamEmployee: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<void>;
