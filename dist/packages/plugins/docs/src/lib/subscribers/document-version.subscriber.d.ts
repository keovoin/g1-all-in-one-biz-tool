import { BaseEntityEventSubscriber } from '@gauzy/core';
import { DocumentVersion } from '../entities/document-version.entity';
/**
 * Owns the SQLite JSON round-trip for `DocumentVersion` snapshot rows.
 *
 * NOTE on the debounced PAGE snapshot capture: the platform subscriber abstraction
 * (`BaseEntityEventSubscriber.beforeEntityUpdate`) receives only the incoming payload — not the
 * loaded database entity — so the pre-update content needed for a snapshot is not available here.
 * The debounced capture (default window 10 minutes, env `GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES`)
 * therefore lives in `DocumentVersionService.captureSnapshotIfNeeded(...)`, invoked from the one
 * code path that changes PAGE content (`UpdateDocumentContentCommand`) and from version restore.
 */
export declare class DocumentVersionSubscriber extends BaseEntityEventSubscriber<DocumentVersion> {
    private readonly logger;
    /**
     * Indicates that this subscriber only listens to DocumentVersion events.
     */
    listenTo(): typeof DocumentVersion;
    /**
     * Serializes JSON fields for SQLite databases.
     *
     * @param entity The DocumentVersion entity that is about to be persisted.
     */
    private serializeJsonFieldsForSQLite;
    /**
     * Called before a DocumentVersion entity is inserted.
     */
    beforeEntityCreate(entity: DocumentVersion): Promise<void>;
    /**
     * Called before a DocumentVersion entity is updated.
     */
    beforeEntityUpdate(entity: DocumentVersion): Promise<void>;
    /**
     * Handles parsing of JSON data after the entity is loaded.
     */
    afterEntityLoad(entity: DocumentVersion): Promise<void>;
}
