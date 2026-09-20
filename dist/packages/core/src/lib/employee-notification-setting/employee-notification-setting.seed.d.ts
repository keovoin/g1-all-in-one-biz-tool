import { DataSource } from 'typeorm';
import { IEmployee, IEmployeeNotificationSetting, IOrganization, ITenant } from '@gauzy/contracts';
import { EmployeeNotificationSetting } from './employee-notification-setting.entity';
/**
 * Creates default notification settings for each employee in the provided list.
 *
 * @param dataSource - The DataSource instance representing the database connection.
 * @param tenant - The tenant associated with the notification settings.
 * @param organization - The organization associated with the notification settings.
 * @param employees - An array of Employee entities for whom the notification settings are to be created.
 * @returns A promise that resolves to an array of created EmployeeNotificationSetting entities.
 */
export declare const createDefaultEmployeeNotificationSettings: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, employees: IEmployee[]) => Promise<EmployeeNotificationSetting[]>;
/**
 * Creates random notification settings for each employee across multiple tenants and organizations.
 *
 * @param dataSource - The DataSource instance representing the database connection.
 * @param tenants - An array of Tenant entities.
 * @param tenantOrganizationsMap - A map associating each tenant with its organizations.
 * @param organizationEmployeesMap - A map associating each organization with its employees.
 * @returns A promise that resolves to an array of created EmployeeNotificationSetting entities.
 */
export declare const createRandomEmployeeNotificationSettings: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<IEmployeeNotificationSetting[]>;
