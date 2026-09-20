import { DataSource } from 'typeorm';
import { ApplicationPluginConfig } from '@gauzy/common';
import { IReport, ITenant } from '@gauzy/contracts';
/**
 * Creates default reports and their categories for a tenant.
 *
 * This function initializes default report categories and their associated reports.
 * It cleans up existing reports and images, creates categories, and links them to
 * predefined reports, saving the entire structure in the database.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for handling assets.
 * @param {ITenant} tenant - The tenant for which reports are being created.
 * @returns {Promise<IReport[]>} - A promise resolving to the list of created reports.
 */
export declare const createDefaultReport: (dataSource: DataSource, config: Partial<ApplicationPluginConfig>, tenant: ITenant) => Promise<IReport[]>;
/**
 * Creates random report-to-organization associations for multiple tenants.
 *
 * This function associates all existing reports with organizations belonging to multiple tenants.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {ITenant[]} tenants - A list of tenants for which associations are created.
 * @returns {Promise<void>} - Resolves when the associations are saved.
 */
export declare function createRandomTenantOrganizationsReport(dataSource: DataSource, tenants: ITenant[]): Promise<void>;
