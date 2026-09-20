import { DataSource } from 'typeorm';
import { IEmployee, IEmployeeNotification, IOrganization, ITenant } from '@gauzy/contracts';
/**
 * Generates default employee notifications for each employee within the provided tenants and organizations.
 *
 * @param dataSource - The DataSource instance to interact with the database.
 * @param tenant - The tenant object for which notifications are being created.
 * @param organizations - An array of organizations within the tenant.
 * @param organizationEmployees - An array of employees within the organization.
 * @returns A promise that resolves to an array of created employee notifications.
 */
export declare const createDefaultEmployeeNotifications: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, organizationEmployees: IEmployee[]) => Promise<IEmployeeNotification[]>;
/**
 * Generates random employee notifications for each employee within the provided tenants and organizations.
 *
 * @param dataSource - The DataSource instance to interact with the database.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating each tenant with its corresponding organizations.
 * @param organizationEmployeesMap - A map associating each organization with its corresponding employees.
 * @returns A promise that resolves to an array of created employee notifications.
 */
export declare const createRandomEmployeeNotifications: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<IEmployeeNotification[]>;
