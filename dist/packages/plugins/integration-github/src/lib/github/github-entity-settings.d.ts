import { IntegrationEntity } from '@gauzy/contracts';
/**
 * Default settings for entities that will be synchronized.
 * This constant defines the default configuration for entities that are integrated with external systems.
 * By default, issues are set to be synchronized.
 */
export declare const DEFAULT_ENTITY_SETTINGS: {
    entity: IntegrationEntity;
    sync: boolean;
}[];
/**
 * Entities that are tied to issues and should be synchronized together.
 * This constant defines additional entities that are associated with issues and should be synchronized
 * when issues are synchronized. Labels are set to be synchronized by default.
 */
export declare const ISSUE_TIED_ENTITIES: {
    entity: IntegrationEntity;
    sync: boolean;
}[];
