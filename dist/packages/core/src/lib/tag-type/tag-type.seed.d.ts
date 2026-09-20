import { DataSource } from 'typeorm';
import { IOrganization, ITagType, ITenant } from '@gauzy/contracts';
/**
 * Creates and inserts tag types into the database for a specified tenant and organizations.
 *
 * @function createTagTypes
 * @async
 * @param {DataSource} dataSource - The TypeORM `DataSource` instance used for database operations.
 * @param {ITenant} tenant - The tenant for which the tag types are being created.
 * @param {IOrganization[]} organizations - An array of organizations associated with the tag types.
 * @returns {Promise<ITagType[]>} - A promise that resolves to the array of created and inserted `ITagType` entities.
 *
 * @description
 * This function iterates over the predefined `DEFAULT_TAG_TYPES` and creates `TagType` entities
 * for each organization provided. It assigns the `type` from `DEFAULT_TAG_TYPES`, associates the
 * organization and tenant, and saves the resulting entities into the database.
 *
 * @example
 * const organizations = [
 *   { id: 'org1', name: 'Org 1' },
 *   { id: 'org2', name: 'Org 2' },
 * ];
 *
 * const tenant = { id: 'tenant1', name: 'Tenant 1' };
 *
 * const createdTags = await createTagTypes(dataSource, tenant, organizations);
 * console.log(createdTags);
 *
 * @throws Will throw an error if the database save operation fails.
 */
export declare const createTagTypes: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<ITagType[]>;
/**
 * Creates random organization tag types for given tenants and their organizations.
 *
 * @function createRandomOrganizationTagTypes
 * @async
 * @param {DataSource} dataSource - The TypeORM `DataSource` instance used for database operations.
 * @param {ITenant[]} tenants - An array of tenant entities for which random tag types are being created.
 * @param {Map<ITenant, IOrganization[]>} tenantOrganizationsMap - A map linking each tenant to its associated organizations.
 * @returns {Promise<ITagType[]>} - A promise that resolves to an array of created and saved `ITagType` entities.
 *
 * @description
 * This function generates random tag types for multiple tenants and their organizations.
 * For each tenant, it retrieves the associated organizations from the `tenantOrganizationsMap`.
 * It iterates over the organizations and creates `TagType` entities based on predefined
 * `DEFAULT_TAG_TYPES`. The generated entities are saved in bulk into the database.
 *
 * If a tenant does not have any organizations, the function logs a warning and skips the tenant.
 *
 * @throws Will throw an error if the database save operation fails.
 */
export declare const createRandomOrganizationTagTypes: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>) => Promise<ITagType[]>;
