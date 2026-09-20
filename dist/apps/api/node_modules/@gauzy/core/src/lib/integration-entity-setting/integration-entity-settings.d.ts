import { IntegrationEntity } from '@gauzy/contracts';
/**
 * Interface for entity synchronization settings.
 */
interface IEntitySyncSetting {
    entity: IntegrationEntity;
    sync: boolean;
}
/**
 * Default settings for entities to be synchronized.
 */
export declare const DEFAULT_ENTITY_SETTINGS: IEntitySyncSetting[];
export {};
