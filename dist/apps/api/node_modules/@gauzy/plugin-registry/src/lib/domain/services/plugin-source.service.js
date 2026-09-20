"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSourceService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_source_entity_1 = require("../entities/plugin-source.entity");
const mikro_orm_plugin_source_repository_1 = require("../repositories/mikro-orm-plugin-source.repository");
const type_orm_plugin_source_repository_1 = require("../repositories/type-orm-plugin-source.repository");
const contracts_1 = require("@gauzy/contracts");
let PluginSourceService = class PluginSourceService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginSourceRepository, mikroOrmPluginSourceRepository) {
        super(typeOrmPluginSourceRepository, mikroOrmPluginSourceRepository);
        this.typeOrmPluginSourceRepository = typeOrmPluginSourceRepository;
        this.mikroOrmPluginSourceRepository = mikroOrmPluginSourceRepository;
    }
    async saveSources(sources) {
        switch (this.ormType) {
            case core_1.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmPluginSourceRepository.getEntityManager();
                sources.forEach((s) => em.persist(s));
                await em.flush();
                return sources;
            }
            case core_1.MultiORMEnum.TypeORM:
            default:
                return this.typeOrmPluginSourceRepository.save(sources);
        }
    }
    /**
     * Creates and saves multiple plugin source entities.
     *
     * @param {IPluginSource[]} sources - The source data array.
     * @returns {Promise<IPluginSource[]>} - The created plugin sources.
     * @throws {BadRequestException} - If source data is missing.
     */
    async createSources(sources) {
        if (!sources || !Array.isArray(sources) || sources.length === 0) {
            throw new common_1.BadRequestException('Source data array is required and must not be empty.');
        }
        const data = sources.map((source) => Object.assign(new plugin_source_entity_1.PluginSource(), source));
        return this.saveSources(data);
    }
    /**
     * Updates a plugin source using the source service
     *
     * @param data - Source data to update
     * @param pluginId - ID of the plugin
     * @throws NotFoundException if source is not found
     */
    async updateSource(data, versionId) {
        if (!data || !data.id) {
            throw new common_1.BadRequestException('Source data and ID are required');
        }
        const found = await this.findOneOrFailByWhereOptions({
            versionId,
            id: data.id
        });
        if (!found.success) {
            throw new common_1.NotFoundException(`Source with ID ${data.id} not found for version ${versionId}`);
        }
        const source = {
            type: data.type,
            architecture: data.architecture,
            operatingSystem: data.operatingSystem,
            ...(data.type === contracts_1.PluginSourceType.CDN && {
                url: data.url,
                integrity: data.integrity,
                crossOrigin: data.crossOrigin
            }),
            ...(data.type === contracts_1.PluginSourceType.NPM && {
                registry: data.registry,
                name: data.name,
                scope: data.scope,
                private: data.private
            }),
            ...(data.type === contracts_1.PluginSourceType.GAUZY && data)
        };
        await this.update(data.id, source);
    }
};
exports.PluginSourceService = PluginSourceService;
exports.PluginSourceService = PluginSourceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_source_repository_1.TypeOrmPluginSourceRepository,
        mikro_orm_plugin_source_repository_1.MikroOrmPluginSourceRepository])
], PluginSourceService);
//# sourceMappingURL=plugin-source.service.js.map