import { BaseEntityEventSubscriber } from '@gauzy/core';
import { HelpCenterArticleVersion } from './help-center-article-version.entity';
export declare class HelpCenterArticleVersionSubscriber extends BaseEntityEventSubscriber<HelpCenterArticleVersion> {
    /**
     * Indicates that this subscriber only listens to HelpCenterArticleVersion events.
     */
    listenTo(): typeof HelpCenterArticleVersion;
    /**
     * Serializes JSON fields for SQLite databases.
     *
     * @param entity The HelpCenterArticleVersion entity that is about to be serialized.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before a HelpCenterArticleVersion entity is inserted.
     */
    beforeEntityCreate(entity: HelpCenterArticleVersion): Promise<void>;
    /**
     * Called before a HelpCenterArticleVersion entity is updated.
     */
    beforeEntityUpdate(entity: HelpCenterArticleVersion): Promise<void>;
    /**
     * Handles parsing of JSON data after entity is loaded.
     */
    afterEntityLoad(entity: HelpCenterArticleVersion): Promise<void>;
}
