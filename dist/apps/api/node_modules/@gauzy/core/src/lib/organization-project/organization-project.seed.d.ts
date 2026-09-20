import { DataSource } from 'typeorm';
import { IOrganization, IOrganizationProject, ITenant } from '@gauzy/contracts';
import { Tag } from './../core/entities/internal';
/**
 * Creates default organization projects, assigns them to employees, and seeds project member counts.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenant - The tenant information.
 * @param organization - The organization information.
 * @returns A promise that resolves to an array of created organization projects.
 */
export declare const createDefaultOrganizationProjects: (dataSource: DataSource, tenant: ITenant, organization: IOrganization) => Promise<IOrganizationProject[]>;
/**
 * Creates random organization projects for given tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations.
 * @param tags - An array of tag entities to associate with projects.
 * @param maxProjectsPerOrganization - The maximum number of projects to create per organization.
 * @returns A promise that resolves to an array of created OrganizationProject entities.
 */
export declare const createRandomOrganizationProjects: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, tags: Tag[], maxProjectsPerOrganization: number) => Promise<void>;
/**
 * Assigns unique Organization Projects to each Employee within an Organization.
 *
 * @param dataSource - The data source instance for database operations.
 * @param organization - The organization object containing `id` and `tenantId`.
 */
export declare const assignOrganizationProjectToEmployee: (dataSource: DataSource, organization: IOrganization) => Promise<void>;
/**
 * Seeds the members count for each organization project associated with the provided tenants.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 *
 * @returns A promise that resolves when the seeding is complete.
 */
export declare function seedProjectMembersCount(dataSource: DataSource, tenants: ITenant[]): Promise<void>;
