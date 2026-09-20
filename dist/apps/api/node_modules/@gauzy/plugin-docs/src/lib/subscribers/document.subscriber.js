"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const document_entity_1 = require("../entities/document.entity");
let DocumentSubscriber = class DocumentSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('DocumentSubscriber');
    }
    /**
     * Indicates that this subscriber only listens to Document events.
     */
    listenTo() {
        return document_entity_1.Document;
    }
    /**
     * Serializes the `json`-shorthand columns for SQLite databases, where they are plain text.
     *
     * @param entity The Document entity that is about to be persisted.
     */
    async serializeJsonFieldsForSQLite(entity) {
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Serialize the `contentJson` field if it's an object
            if (entity.contentJson && typeof entity.contentJson === 'object') {
                try {
                    entity.contentJson = JSON.stringify(entity.contentJson);
                }
                catch (error) {
                    this.logger.error('Error serializing contentJson:', error.message);
                }
            }
            // Serialize the `metadata` field if it's an object
            if (entity.metadata && typeof entity.metadata === 'object') {
                try {
                    entity.metadata = JSON.stringify(entity.metadata);
                }
                catch (error) {
                    this.logger.error('Error serializing metadata:', error.message);
                }
            }
        }
    }
    /**
     * Called before a Document entity is inserted.
     */
    async beforeEntityCreate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Called before a Document entity is updated.
     */
    async beforeEntityUpdate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Called after a Document entity is loaded from the database:
     * - parses the `json`-shorthand columns back into objects on SQLite;
     * - resolves the virtual `fileUrl`/`thumbUrl` from the storage provider
     *   (signed URL where the provider supports it). Errors degrade to `null`, never throw.
     *
     * @param entity The Document entity that was loaded.
     */
    async afterEntityLoad(entity) {
        if (!(entity instanceof document_entity_1.Document)) {
            return; // Exit if the entity is not a Document instance
        }
        this.parseJsonFieldsForSQLite(entity);
        await this.resolveVirtualUrls(entity);
    }
    /**
     * Parses the `json`-shorthand columns back into objects on SQLite, where they are stored as
     * plain text by `serializeJsonFieldsForSQLite`. Invalid JSON is left as-is (warn only) —
     * a malformed cache must never fail an entity load.
     *
     * @param entity The Document entity that was loaded.
     */
    parseJsonFieldsForSQLite(entity) {
        if (!(0, config_1.isSqlite)() && !(0, config_1.isBetterSqlite3)()) {
            return;
        }
        // Parse the `contentJson` field if it's a string
        if (entity.contentJson && typeof entity.contentJson === 'string') {
            try {
                entity.contentJson = JSON.parse(entity.contentJson);
            }
            catch (error) {
                this.logger.warn('contentJson is not valid JSON:', error.message);
            }
        }
        // Parse the `metadata` field if it's a string
        if (entity.metadata && typeof entity.metadata === 'string') {
            try {
                entity.metadata = JSON.parse(entity.metadata);
            }
            catch (error) {
                this.logger.warn('metadata is not valid JSON:', error.message);
            }
        }
    }
    /**
     * Resolves the virtual `fileUrl`/`thumbUrl` from the storage provider (signed URL where the
     * provider supports it), for FILE documents only. Errors degrade to `null`, never throw.
     *
     * @param entity The Document entity that was loaded.
     */
    async resolveVirtualUrls(entity) {
        try {
            const { storageProvider, storageKey, thumbKey } = entity;
            if (storageProvider && storageKey) {
                const provider = new core_1.FileStorage().setProvider(storageProvider).getProviderInstance();
                entity.fileUrl = await provider.url(storageKey);
                if (thumbKey) {
                    entity.thumbUrl = await provider.url(thumbKey);
                }
            }
        }
        catch (error) {
            this.logger.error('Error resolving file URLs during afterEntityLoad:', error.message);
            entity.fileUrl = null;
            entity.thumbUrl = null;
        }
    }
};
exports.DocumentSubscriber = DocumentSubscriber;
exports.DocumentSubscriber = DocumentSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], DocumentSubscriber);
//# sourceMappingURL=document.subscriber.js.map