import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
import { Organization } from '../core/entities/internal';
/**
 * Retrieves the default organization for a given tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which the default organization is retrieved.
 * @returns A promise that resolves to the default organization if it exists, otherwise `null`.
 */
export declare const getDefaultOrganization: (dataSource: DataSource, tenant: ITenant) => Promise<IOrganization | null>;
/**
 * Retrieves all organizations for a given tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which the organizations are retrieved.
 * @returns A promise that resolves to an array of organizations for the specified tenant.
 * @throws Error if the tenant ID is not provided or invalid.
 */
export declare const getDefaultOrganizations: (dataSource: DataSource, tenant: ITenant) => Promise<IOrganization[]>;
/**
 * Creates default organizations for a tenant.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant to associate the organizations with.
 * @param organizations - An array of organization input data.
 * @returns A promise that resolves to the created organizations.
 */
export declare const createDefaultOrganizations: (dataSource: DataSource, tenant: ITenant, organizations: any) => Promise<Organization[]>;
/**
 * Creates random organizations for multiple tenants.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The list of tenants for which organizations will be created.
 * @param organizationsPerTenant - The number of organizations to create per tenant.
 * @returns A promise that resolves to a map of tenants and their corresponding organizations.
 */
export declare const createRandomOrganizations: (dataSource: DataSource, tenants: ITenant[], organizationsPerTenant: number) => Promise<Map<ITenant, IOrganization[]>>;
