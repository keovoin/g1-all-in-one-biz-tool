import { DataSource } from 'typeorm';
import { IDashboard, IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
/**
 * Creates default dashboards for a list of employees within a specific tenant and organization.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenant - The tenant object.
 * @param organization - The organization object.
 * @param employees - An array of employee objects.
 * @returns A promise that resolves to an array of created Dashboard entities.
 */
export declare const createDefaultEmployeeDashboards: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, employees: IEmployee[]) => Promise<IDashboard[]>;
/**
 * Creates random dashboards for employees across multiple tenants and organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map where each tenant maps to an array of its organizations.
 * @param organizationEmployeesMap - A map where each organization maps to an array of its employees.
 * @returns A promise that resolves to an array of created Dashboard entities.
 */
export declare const createRandomEmployeeDashboards: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<IDashboard[]>;
