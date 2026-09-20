"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginVersionCommandHandler = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const update_plugin_version_command_1 = require("../update-plugin-version.command");
let UpdatePluginVersionCommandHandler = class UpdatePluginVersionCommandHandler {
    constructor(versionService, sourceService, dataSource) {
        this.versionService = versionService;
        this.sourceService = sourceService;
        this.dataSource = dataSource;
    }
    /**
     * Updates a plugin version and its associated source
     *
     * @param command - The update plugin version command with input data and plugin ID
     * @returns The updated plugin
     * @throws NotFoundException if source, or version is not found
     */
    async execute(command) {
        const { input, pluginId, versionId } = command;
        if (!pluginId) {
            throw new common_1.BadRequestException('Plugin version ID is required');
        }
        // Start a transaction for updating the plugin version and related entities
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Check if plugin version exists
            const found = await this.versionService.findOneOrFailByIdString(versionId, {
                where: {
                    pluginId
                }
            });
            if (!found.success) {
                throw new common_1.NotFoundException(`Plugin version with ID ${versionId} not found`);
            }
            // Update source and version
            if (input) {
                await this.updateVersion(input, pluginId);
                if (input.sources.length) {
                    await Promise.all(input.sources.map((source) => this.updateSource(source, versionId)));
                }
            }
            await queryRunner.commitTransaction();
            // Return the updated plugin with relations
            return this.versionService.findOneByIdString(versionId, {
                relations: ['sources', 'plugin']
            });
        }
        catch (error) {
            // Roll back transaction on error
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to update plugin: ${error.message}`);
        }
        finally {
            // Release resources
            await queryRunner.release();
        }
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
        const found = await this.sourceService.findOneOrFailByWhereOptions({
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
        await this.sourceService.update(data.id, source);
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
        const found = await this.versionService.findOneOrFailByWhereOptions({
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
        await this.versionService.update(data.id, version);
    }
};
exports.UpdatePluginVersionCommandHandler = UpdatePluginVersionCommandHandler;
exports.UpdatePluginVersionCommandHandler = UpdatePluginVersionCommandHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(update_plugin_version_command_1.UpdatePluginVersionCommand),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginVersionService,
        domain_1.PluginSourceService,
        typeorm_1.DataSource])
], UpdatePluginVersionCommandHandler);
//# sourceMappingURL=update-plugin-version-command.handler.js.map