"use strict";
var PluginService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const application_1 = require("../../application");
const repositories_1 = require("../repositories");
let PluginService = PluginService_1 = class PluginService extends core_1.CrudService {
    constructor(typeOrmPluginRepository, mikroOrmPluginRepository, commandBus) {
        super(typeOrmPluginRepository, mikroOrmPluginRepository);
        this.typeOrmPluginRepository = typeOrmPluginRepository;
        this.mikroOrmPluginRepository = mikroOrmPluginRepository;
        this.commandBus = commandBus;
        this.logger = new common_1.Logger(PluginService_1.name);
    }
    /**
     * Create a plugin with auto-tagging functionality
     *
     * @param entity - Plugin creation data
     * @returns Promise<Plugin>
     */
    async createWithAutoTagging(entity) {
        try {
            this.logger.log(`Creating plugin: ${entity.name}`);
            // Create the plugin first
            const plugin = await super.create(entity);
            // Auto-tag the plugin after creation
            try {
                await this.commandBus.execute(new application_1.AutoTagPluginCommand(plugin.id, {
                    name: plugin.name,
                    description: plugin.description,
                    type: plugin.type
                }, {
                    createMissingTags: true,
                    overwriteExisting: false
                }));
                this.logger.log(`Auto-tagging completed for plugin: ${plugin.id}`);
            }
            catch (taggingError) {
                // Log tagging error but don't fail plugin creation
                this.logger.warn(`Auto-tagging failed for plugin ${plugin.id}: ${taggingError.message}`);
            }
            return plugin;
        }
        catch (error) {
            this.logger.error(`Failed to create plugin: ${error.message}`, error.stack);
            throw error;
        }
    }
    async validatePluginOwnership(pluginId, userId) {
        const plugin = await this.findOneOrFailByWhereOptions({ id: pluginId });
        if (!plugin.success) {
            throw new common_1.NotFoundException(`Plugin with ID "${pluginId}" not found.`);
        }
        if (plugin.record.uploadedById !== userId) {
            return false;
        }
        return true;
    }
};
exports.PluginService = PluginService;
exports.PluginService = PluginService = PluginService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TypeOrmPluginRepository,
        repositories_1.MikroOrmPluginRepository,
        cqrs_1.CommandBus])
], PluginService);
//# sourceMappingURL=plugin.service.js.map