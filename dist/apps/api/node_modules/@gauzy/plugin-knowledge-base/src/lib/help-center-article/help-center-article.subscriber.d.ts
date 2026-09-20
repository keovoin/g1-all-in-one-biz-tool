import { BaseEntityEventSubscriber } from '@gauzy/core';
import { HelpCenterArticle } from './help-center-article.entity';
export declare class HelpCenterArticleSubscriber extends BaseEntityEventSubscriber<HelpCenterArticle> {
    /**
     * Indicates that this subscriber only listens to HelpCenterArticle events.
     */
    listenTo(): typeof HelpCenterArticle;
    /**
     * Serializes JSON fields for SQLite databases.
     *
     * @param entity The HelpCenterArticle entity that is about to be serialized.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before a HelpCenterArticle entity is inserted.
     */
    beforeEntityCreate(entity: HelpCenterArticle): Promise<void>;
    /**
     * Called before a HelpCenterArticle entity is updated.
     */
    beforeEntityUpdate(entity: HelpCenterArticle): Promise<void>;
    /**
     * Handles parsing of JSON data after entity is loaded.
     */
    afterEntityLoad(entity: HelpCenterArticle): Promise<void>;
}
