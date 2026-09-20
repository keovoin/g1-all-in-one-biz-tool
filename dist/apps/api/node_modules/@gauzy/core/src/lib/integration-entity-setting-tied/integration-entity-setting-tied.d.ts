import { IntegrationEntity } from '@gauzy/contracts';
/**
 * Interface for entity synchronization settings.
 */
interface IEntitySyncSetting {
    entity: IntegrationEntity;
    sync: boolean;
}
/**
 * Project-tied entities that need to be synchronized.
 */
export declare const PROJECT_TIED_ENTITIES: IEntitySyncSetting[];
export {};
