import { DataSource } from 'typeorm';
import { IOrganization, ITagType, ITenant } from '@gauzy/contracts';
import { Tag } from './../core/entities/internal';
export declare const createDefaultTags: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[], organizationTagTypes: ITagType[]) => Promise<Tag[]>;
export declare const createTags: (dataSource: DataSource) => Promise<Tag[]>;
/**
 * Creates random organization tags for given tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source instance for database operations.
 * @param tenants - An array of tenant entities.
 * @param tenantOrganizationsMap - A map linking each tenant to its organizations.
 * @returns A promise that resolves to an array of created Tag entities.
 */
export declare const createRandomOrganizationTags: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationTagTypes: ITagType[]) => Promise<Tag[]>;
