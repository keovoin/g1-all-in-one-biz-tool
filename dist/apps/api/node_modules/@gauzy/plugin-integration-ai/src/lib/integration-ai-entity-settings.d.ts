import { IntegrationEntity } from '@gauzy/contracts';
/**
 * Default entity settings for AI integrations.
 *
 * Each entity setting consists of an entity type and a sync flag.
 * The sync flag determines whether the entity type should be synced with the AI integration.
 */
export declare const DEFAULT_ENTITY_SETTINGS: {
    entity: IntegrationEntity;
    sync: boolean;
}[];
