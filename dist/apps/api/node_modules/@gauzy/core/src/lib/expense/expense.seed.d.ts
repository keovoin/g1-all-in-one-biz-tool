import { DataSource } from 'typeorm';
import { IOrganization, IEmployee, IExpenseCategory, IOrganizationVendor, ITenant } from '@gauzy/contracts';
import { Expense } from './../core/entities/internal';
/**
 * Creates default expenses for the provided organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param organizations - An array of organization objects.
 * @param tenant - The tenant object.
 * @param employees - An array of employee objects.
 * @param categories - An array of expense categories.
 * @param organizationVendors - An array of organization vendors.
 * @returns A promise that resolves to an array of created Expense entities.
 */
export declare const createDefaultExpenses: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[], employees: IEmployee[], categories: IExpenseCategory[] | void, organizationVendors: IOrganizationVendor[] | void) => Promise<Expense[]>;
/**
 * Creates random expenses for employees across multiple tenants and organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map of tenants to their organizations.
 * @param organizationEmployeesMap - A map of organizations to their employees.
 * @param organizationVendorsMap - A map of organizations to their vendors.
 * @param categoriesMap - A map of organizations to their expense categories.
 * @returns A promise that resolves when the random expenses have been created and inserted.
 */
export declare const createRandomExpenses: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, organizationVendorsMap: Map<IOrganization, IOrganizationVendor[]> | void, categoriesMap: Map<IOrganization, IExpenseCategory[]> | void) => Promise<void>;
/**
 * Inserts an array of Expense entities into the database in batches.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param expenses - An array of Expense entities to insert.
 * @param batchSize - (Optional) The number of records to insert per batch (default is 100).
 * @returns A promise that resolves to an array of inserted Expense entities.
 */
export declare const insertExpenses: (dataSource: DataSource, expenses: Expense[], batchSize?: number) => Promise<Expense[]>;
