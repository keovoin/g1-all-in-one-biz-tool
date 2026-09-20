"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpCenterArticleVersionSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const help_center_article_version_entity_1 = require("./help-center-article-version.entity");
let HelpCenterArticleVersionSubscriber = class HelpCenterArticleVersionSubscriber extends core_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listens to HelpCenterArticleVersion events.
     */
    listenTo() {
        return help_center_article_version_entity_1.HelpCenterArticleVersion;
    }
    /**
     * Serializes JSON fields for SQLite databases.
     *
     * @param entity The HelpCenterArticleVersion entity that is about to be serialized.
     */
    async serializeJsonFieldsForSQLite(entity) {
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Serialize the `descriptionJson` field if it's an object
            if (entity.descriptionJson && typeof entity.descriptionJson === 'object') {
                try {
                    entity.descriptionJson = JSON.stringify(entity.descriptionJson);
                }
                catch (error) {
                    console.error('HelpCenterArticleVersionSubscriber: Error serializing descriptionJson:', error.message);
                }
            }
        }
    }
    /**
     * Called before a HelpCenterArticleVersion entity is inserted.
     */
    async beforeEntityCreate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Called before a HelpCenterArticleVersion entity is updated.
     */
    async beforeEntityUpdate(entity) {
        await this.serializeJsonFieldsForSQLite(entity);
    }
    /**
     * Handles parsing of JSON data after entity is loaded.
     */
    async afterEntityLoad(entity) {
        if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
            // Parse the `descriptionJson` field if it's a string
            if (entity.descriptionJson && typeof entity.descriptionJson === 'string') {
                try {
                    entity.descriptionJson = JSON.parse(entity.descriptionJson);
                }
                catch (error) {
                    console.warn('HelpCenterArticleVersionSubscriber: descriptionJson is not valid JSON:', error.message);
                }
            }
        }
    }
};
exports.HelpCenterArticleVersionSubscriber = HelpCenterArticleVersionSubscriber;
exports.HelpCenterArticleVersionSubscriber = HelpCenterArticleVersionSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], HelpCenterArticleVersionSubscriber);
//# sourceMappingURL=help-center-article-version.subscriber.js.map