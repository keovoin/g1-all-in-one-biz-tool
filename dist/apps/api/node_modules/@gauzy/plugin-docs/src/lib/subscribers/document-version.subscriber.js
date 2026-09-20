"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentVersionSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const document_version_entity_1 = require("../entities/document-version.entity");
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
let DocumentVersionSubscriber = class DocumentVersionSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor() {
        super(...arguments);
        this.logger = new common_1.Logger('DocumentVersionSubscriber');
    }
    /**
     * Indicates that this subscriber only listens to DocumentVersion events.
     */
    listenTo() {
        return document_version_entity_1.DocumentVersion;
    }
    /**
     * Serializes JSON fields for SQLite databases.
     *
     * @param entity The DocumentVersion entity that is about to be persisted.
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
        }
    }
    /**
     * Called before a DocumentVersion entity is inserted.
     */
    async beforeEntityCreate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Called before a DocumentVersion entity is updated.
     */
    async beforeEntityUpdate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Handles parsing of JSON data after the entity is loaded.
     */
    async afterEntityLoad(entity) {
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Parse the `contentJson` field if it's a string
            if (entity.contentJson && typeof entity.contentJson === 'string') {
                try {
                    entity.contentJson = JSON.parse(entity.contentJson);
                }
                catch (error) {
                    this.logger.warn('contentJson is not valid JSON:', error.message);
                }
            }
        }
    }
};
exports.DocumentVersionSubscriber = DocumentVersionSubscriber;
exports.DocumentVersionSubscriber = DocumentVersionSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], DocumentVersionSubscriber);
//# sourceMappingURL=document-version.subscriber.js.map