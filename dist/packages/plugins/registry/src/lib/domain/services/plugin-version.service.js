"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVersionService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_version_entity_1 = require("../entities/plugin-version.entity");
const mikro_orm_plugin_version_repository_1 = require("../repositories/mikro-orm-plugin-version.repository");
const type_orm_plugin_version_repository_1 = require("../repositories/type-orm-plugin-version.repository");
let PluginVersionService = class PluginVersionService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginVersionRepository, mikroOrmPluginVersionRepository) {
        super(typeOrmPluginVersionRepository, mikroOrmPluginVersionRepository);
        this.typeOrmPluginVersionRepository = typeOrmPluginVersionRepository;
        this.mikroOrmPluginVersionRepository = mikroOrmPluginVersionRepository;
    }
    async getTotalDownloadCount(pluginId) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmPluginVersionRepository.getKnex();
                const result = await knex('plugin_versions')
                    .where({ pluginId })
                    .sum('downloadCount as total')
                    .first();
                return Number(result?.total ?? 0);
            }
            case core_1.MultiORMEnum.TypeORM:
            default:
                return this.typeOrmRepository.sum('downloadCount', {
                    pluginId
                });
        }
    }
    /**
     * Creates and saves a new plugin version entity.
     *
     * @param {IPluginVersion} versionData - The plugin version data.
     * @param {IPlugin} plugin - The associated plugin.
     * @param {IPluginSource[]} sources - The associated plugin sources.
     * @returns {Promise<IPluginVersion>} - The created plugin version.
     * @throws {BadRequestException} - If version data is missing.
     */
    async createVersion(versionData, plugin, sources) {
        if (!versionData) {
            throw new common_1.BadRequestException('Version data is required.');
        }
        const version = Object.assign(new plugin_version_entity_1.PluginVersion(), {
            ...versionData,
            plugin,
            sources
        });
        return this.save(version);
    }
    /**
     * Updates a plugin version using the version service
     *
     * @param data - Version data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if version is not found
     */
    async updateVersion(data, pluginId) {
        if (!data || !data.id) {
            throw new common_1.BadRequestException('Version data and ID are required');
        }
        const found = await this.findOneOrFailByWhereOptions({
            pluginId,
            id: data.id
        });
        if (!found.success) {
            throw new common_1.NotFoundException(`Version with ID ${data.id} not found for plugin ${pluginId}`);
        }
        const version = {
            changelog: data.changelog,
            number: data.number,
            releaseDate: data.releaseDate
        };
        await this.update(data.id, version);
    }
};
exports.PluginVersionService = PluginVersionService;
exports.PluginVersionService = PluginVersionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_version_repository_1.TypeOrmPluginVersionRepository,
        mikro_orm_plugin_version_repository_1.MikroOrmPluginVersionRepository])
], PluginVersionService);
//# sourceMappingURL=plugin-version.service.js.map