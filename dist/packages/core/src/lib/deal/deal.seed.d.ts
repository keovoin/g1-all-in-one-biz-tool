import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { Deal } from './deal.entity';
/**
 * Creates random deals for given tenants and inserts them into the database.
 *
 * @param dataSource - The data source used to access the database.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating tenants with their organizations.
 * @param organizationEmployeesMap - A map associating organizations with their employees.
 * @param batchSize - The number of records to insert per batch. Default is 100.
 * @returns A promise that resolves to an array of inserted deals.
 */
export declare const createRandomDeal: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, batchSize?: number) => Promise<Deal[]>;
