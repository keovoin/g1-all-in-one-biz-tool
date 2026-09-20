import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant, IUser } from '@gauzy/contracts';
/**
 * Creates default employees for the given organization.
 *
 * @param dataSource - The data source to interact with the database.
 * @param tenant - The tenant to which the employees belong.
 * @param organization - The organization for the employees.
 * @param users - The users to be converted into employees.
 * @param defaultEmployees - The default employee configurations.
 * @returns The created employees.
 */
export declare const createDefaultEmployees: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, users: IUser[], defaultEmployees: any) => Promise<IEmployee[]>;
/**
 * Creates random employees for each tenant and organization.
 *
 * This function iterates over the provided tenants and their associated organizations,
 * generating random employees for each organization based on the users associated with
 * that organization. The employees are then inserted into the database and returned in
 * a map, associating organizations with their respective employees.
 *
 * @param dataSource - The data source for interacting with the database.
 * @param tenants - A list of tenant entities for which employees will be created.
 * @param tenantOrganizationsMap - A map associating each tenant with their respective organizations.
 * @param organizationUsersMap - A map associating each organization with its users.
 * @returns A promise that resolves to a map associating organizations with their respective employees.
 */
export declare const createRandomEmployees: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationUsersMap: Map<IOrganization, IUser[]>) => Promise<Map<IOrganization, IEmployee[]>>;
/**
 * Fetches default employees for the given tenant.
 */
export declare const getDefaultEmployees: (dataSource: DataSource, tenant: ITenant) => Promise<IEmployee[]>;
