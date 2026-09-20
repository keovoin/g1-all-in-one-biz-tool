import { DataSource } from 'typeorm';
import { Proposal } from './proposal.entity';
import { IEmployee, IOrganization, ITenant } from '@gauzy/contracts';
/**
 * Creates default proposals for organizations.
 *
 * @param connection The database connection.
 * @param tenant The tenant information.
 * @param employees The list of employees.
 * @param organizations The list of organizations.
 * @param noOfProposalsPerOrganization The number of proposals to create per organization.
 * @returns A promise that resolves to an array of created proposals.
 */
export declare const createDefaultProposals: (connection: DataSource, tenant: ITenant, employees: IEmployee[], organizations: IOrganization[], noOfProposalsPerOrganization: number) => Promise<Proposal[]>;
/**
 * Creates random proposals for organizations across multiple tenants.
 *
 * @param connection The database connection.
 * @param tenants An array of tenants.
 * @param tenantOrganizationsMap A map containing organizations for each tenant.
 * @param organizationEmployeesMap A map containing employees for each organization.
 * @param noOfProposalsPerOrganization The number of proposals to create per organization.
 * @returns A Promise that resolves with the created proposals.
 */
export declare const createRandomProposals: (connection: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, noOfProposalsPerOrganization: number) => Promise<Proposal[]>;
