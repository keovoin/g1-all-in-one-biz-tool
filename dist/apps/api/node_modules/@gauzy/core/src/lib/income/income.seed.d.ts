import { DataSource } from 'typeorm';
import { IOrganization, IEmployee, ITenant } from '@gauzy/contracts';
import { Income } from './../core/entities/internal';
/**
 * Creates default incomes for a list of organizations and employees for a given tenant.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenant - The tenant object.
 * @param organizations - An array of organization objects.
 * @param employees - An array of employee objects.
 * @returns A promise that resolves to an array of created Income entities.
 */
export declare const createDefaultIncomes: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, employees: IEmployee[]) => Promise<Income[]>;
/**
 * Creates random incomes for employees across multiple tenants and organizations.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map associating each tenant with an array of its organizations.
 * @param organizationEmployeesMap - A map associating each organization with an array of its employees.
 * @returns A promise that resolves when all incomes have been created and inserted.
 */
export declare const createRandomIncomes: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<void>;
/**
 * Inserts an array of Income entities into the database.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @param incomes - An array of Income entities to insert.
 * @returns A promise that resolves when the incomes have been successfully inserted.
 */
export declare const insertIncomes: (dataSource: DataSource, incomes: Income[], batchSize?: number) => Promise<Income[]>;
