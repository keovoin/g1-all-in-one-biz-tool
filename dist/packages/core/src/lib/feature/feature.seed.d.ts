import { DataSource } from 'typeorm';
import { ApplicationPluginConfig } from '@gauzy/common';
import { IFeature, ITenant } from '@gauzy/contracts';
/**
 * Creates default feature toggles and their hierarchical relationships.
 *
 * This function initializes the default features for a given tenant by cleaning up
 * existing features, creating parent and child features, and saving them in the database.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {Partial<ApplicationPluginConfig>} config - Application configuration for features.
 * @param {ITenant} tenant - The tenant for which the features will be created.
 * @returns {Promise<IFeature[]>} - A promise resolving to a list of created features.
 */
export declare const createDefaultFeatureToggle: (dataSource: DataSource, config: Partial<ApplicationPluginConfig>, tenant: ITenant) => Promise<IFeature[]>;
/**
 * Creates random feature toggles for multiple tenants.
 *
 * This function assigns random feature toggles to organizations associated with multiple tenants.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source.
 * @param {ITenant[]} tenants - A list of tenants for which random feature toggles will be created.
 * @returns {Promise<IFeature[]>} - A promise resolving to a list of all features in the database.
 */
export declare const createRandomFeatureToggle: (dataSource: DataSource, tenants: ITenant[]) => Promise<IFeature[]>;
