import { DataSource } from 'typeorm';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
import { Payment } from './payment.entity';
/**
 * Creates default payments for a tenant and its organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which payments are created.
 * @param employees - The list of employees associated with the tenant.
 * @param organizations - The list of organizations associated with the tenant.
 * @returns A promise that resolves to an array of created payments.
 */
export declare const createDefaultPayment: (dataSource: DataSource, tenant: ITenant, employees: IEmployee[], organizations: IOrganization[]) => Promise<Payment[]>;
/**
 * Creates random payments for multiple tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The list of tenants for which payments are created.
 * @param tenantOrganizationsMap - A map of tenants and their organizations.
 * @param organizationEmployeesMap - A map of organizations and their employees.
 * @returns A promise that resolves to an array of created payments.
 */
export declare const createRandomPayment: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<Payment[]>;
