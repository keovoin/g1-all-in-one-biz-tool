"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPluginTagRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_1 = require("@gauzy/core");
const plugin_tag_entity_1 = require("../entities/plugin-tag.entity");
/**
 * TypeORM repository for PluginTag entity.
 *
 * This repository provides TypeORM-specific data access methods for plugin-tag relationships.
 * It extends the TypeORM Repository class to provide database operations for managing
 * the many-to-many relationship between plugins and tags.
 *
 * Business Logic Capabilities:
 * - CRUD operations on plugin-tag associations
 * - Complex queries for plugin discovery by tags
 * - Bulk operations for tag management
 * - Performance-optimized queries with proper indexing
 */
let TypeOrmPluginTagRepository = class TypeOrmPluginTagRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
    /**
     * Find all plugin-tag relationships for a specific plugin
     *
     * @param pluginId - The plugin ID to find tags for
     * @param relations - Optional relations to include
     * @returns Promise<PluginTag[]>
     */
    async findByPluginId(pluginId, relations = ['tag']) {
        return this.find({
            where: { pluginId },
            relations: (0, core_1.parseFindOptionsRelations)(relations)
        });
    }
    /**
     * Find all plugin-tag relationships for a specific tag
     *
     * @param tagId - The tag ID to find plugins for
     * @param relations - Optional relations to include
     * @returns Promise<PluginTag[]>
     */
    async findByTagId(tagId, relations = ['plugin']) {
        return this.find({
            where: { tagId },
            relations: (0, core_1.parseFindOptionsRelations)(relations)
        });
    }
    /**
     * Check if a plugin-tag relationship exists
     *
     * @param pluginId - The plugin ID
     * @param tagId - The tag ID
     * @returns Promise<boolean>
     */
    async existsByPluginAndTag(pluginId, tagId) {
        const count = await this.count({
            where: { pluginId, tagId }
        });
        return count > 0;
    }
    /**
     * Remove all tags from a plugin
     *
     * @param pluginId - The plugin ID to remove tags from
     * @returns Promise<void>
     */
    async removeAllTagsFromPlugin(pluginId) {
        await this.delete({ pluginId });
    }
    /**
     * Remove all plugins from a tag
     *
     * @param tagId - The tag ID to remove plugins from
     * @returns Promise<void>
     */
    async removeAllPluginsFromTag(tagId) {
        await this.delete({ tagId });
    }
    /**
     * Get plugins count by tag
     *
     * @param tagId - The tag ID
     * @returns Promise<number>
     */
    async getPluginCountByTag(tagId) {
        return this.count({
            where: { tagId }
        });
    }
    /**
     * Get tags count by plugin
     *
     * @param pluginId - The plugin ID
     * @returns Promise<number>
     */
    async getTagCountByPlugin(pluginId) {
        return this.count({
            where: { pluginId }
        });
    }
};
exports.TypeOrmPluginTagRepository = TypeOrmPluginTagRepository;
exports.TypeOrmPluginTagRepository = TypeOrmPluginTagRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(plugin_tag_entity_1.PluginTag)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPluginTagRepository);
//# sourceMappingURL=type-orm-plugin-tag.repository.js.map