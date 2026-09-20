import { BaseEntityEventSubscriber } from '@gauzy/core';
import { Document } from '../entities/document.entity';
export declare class DocumentSubscriber extends BaseEntityEventSubscriber<Document> {
    private readonly logger;
    /**
     * Indicates that this subscriber only listens to Document events.
     */
    listenTo(): typeof Document;
    /**
     * Serializes the `json`-shorthand columns for SQLite databases, where they are plain text.
     *
     * @param entity The Document entity that is about to be persisted.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before a Document entity is inserted.
     */
    beforeEntityCreate(entity: Document): Promise<void>;
    /**
     * Called before a Document entity is updated.
     */
    beforeEntityUpdate(entity: Document): Promise<void>;
    /**
     * Called after a Document entity is loaded from the database:
     * - parses the `json`-shorthand columns back into objects on SQLite;
     * - resolves the virtual `fileUrl`/`thumbUrl` from the storage provider
     *   (signed URL where the provider supports it). Errors degrade to `null`, never throw.
     *
     * @param entity The Document entity that was loaded.
     */
    afterEntityLoad(entity: Document): Promise<void>;
    /**
     * Parses the `json`-shorthand columns back into objects on SQLite, where they are stored as
     * plain text by `serializeJsonFieldsForSQLite`. Invalid JSON is left as-is (warn only) —
     * a malformed cache must never fail an entity load.
     *
     * @param entity The Document entity that was loaded.
     */
    private parseJsonFieldsForSQLite;
    /**
     * Resolves the virtual `fileUrl`/`thumbUrl` from the storage provider (signed URL where the
     * provider supports it), for FILE documents only. Errors degrade to `null`, never throw.
     *
     * @param entity The Document entity that was loaded.
     */
    private resolveVirtualUrls;
}
