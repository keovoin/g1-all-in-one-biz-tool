import { ApplicationPluginConfig, RelationCustomEmbeddedFieldConfig } from '@gauzy/common';
import { MultiORM } from '../../../core/utils';
/**
 * Registers a custom field for an entity based on the custom field configuration.
 * Uses MultiORM* decorators for relations (which already have ORM-type guards)
 * but ORM-specific decorators for columns and indexes.
 *
 * @param config - The application configuration.
 * @param customField - The custom field configuration.
 * @param name - The name of the custom field.
 * @param instance - The entity instance to which the field is being registered.
 * @param ormType - The ORM type ('typeorm' or 'mikro-orm') to apply decorators for.
 */
export declare const registerFields: (config: ApplicationPluginConfig, customField: RelationCustomEmbeddedFieldConfig, name: string, instance: any, ormType: MultiORM) => Promise<void>;
/**
 * Registers custom fields for TypeORM entities based on a given configuration.
 *
 * @param config The configuration for the application plugins.
 * @throws Error if there's a failure during the registration process.
 */
export declare function registerTypeOrmCustomFields(config: ApplicationPluginConfig): Promise<void>;
/**
 * Registers custom fields for MikroORM entities based on a given configuration.
 *
 * @param config The configuration for the application plugins.
 * @throws Error if there's a failure during the registration process.
 */
export declare function registerMikroOrmCustomFields(config: ApplicationPluginConfig): Promise<void>;
