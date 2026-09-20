"use strict";
var PluginSourceSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSourceSubscriber = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_source_entity_1 = require("../../domain/entities/plugin-source.entity");
let PluginSourceSubscriber = PluginSourceSubscriber_1 = class PluginSourceSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor(dataSource) {
        super();
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PluginSourceSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    listenTo() {
        return plugin_source_entity_1.PluginSource;
    }
    async beforeInsert(event) {
        const entity = event.entity;
        if (entity.type !== contracts_1.PluginSourceType.GAUZY) {
            return;
        }
        try {
            const { storageProvider, fileKey } = entity;
            if (!storageProvider || !fileKey) {
                this.logger.warn(`Missing storageProvider or fileKey for PluginSource entity with ID ${entity.id ?? 'N/A'}`);
                return;
            }
            const provider = this.getFileStorageProvider(storageProvider);
            entity.url = await provider.url(fileKey);
            this.logger.log(`Generated URL for PluginSource entity with ID ${entity.id ?? 'N/A'}`);
        }
        catch (error) {
            this.logger.error(`Error generating URL for PluginSource entity with ID ${entity.id ?? 'N/A'}: ${error.message}`);
        }
    }
    async afterRemove(event) {
        const entity = event.entity;
        if (!entity || !(entity instanceof plugin_source_entity_1.PluginSource)) {
            return;
        }
        if (entity.type !== contracts_1.PluginSourceType.GAUZY) {
            return;
        }
        try {
            const { id: entityId, storageProvider, fileKey } = entity;
            if (!storageProvider || !fileKey) {
                this.logger.warn(`Missing storageProvider or fileKey for PluginSource entity with ID ${entityId}`);
                return;
            }
            const provider = this.getFileStorageProvider(storageProvider);
            await provider.deleteFile(fileKey);
            this.logger.log(`Successfully deleted file for PluginSource entity with ID ${entityId}`);
        }
        catch (error) {
            this.logger.error(`Error deleting file for PluginSource entity with ID ${entity.id}: ${error.message}`);
        }
    }
    async afterLoad(entity) {
        if (!entity || !entity.id) {
            return;
        }
        entity.fullName = this.generateFullName(entity);
    }
    /**
     * Generates a full name for a plugin source based on its type and properties
     * @param pluginSource The plugin source to generate the full name for
     * @returns A descriptive full name for the plugin source
     */
    generateFullName(source) {
        const { type, operatingSystem, architecture, version } = source;
        // Base parts that are common to all types
        const baseParts = [`${version ? 'v' + version.number : undefined}`, operatingSystem, architecture];
        // Type-specific parts
        let typeSpecificPart = '';
        switch (type) {
            case contracts_1.PluginSourceType.CDN:
                if (source.url) {
                    try {
                        const url = new URL(source.url);
                        typeSpecificPart = `cdn-${url.hostname}`;
                    }
                    catch {
                        typeSpecificPart = 'cdn-source';
                    }
                }
                else {
                    typeSpecificPart = 'cdn-source';
                }
                break;
            case contracts_1.PluginSourceType.NPM:
                typeSpecificPart = source.scope ? `npm-${source.scope}/${source.name}` : `npm-${source.name}`;
                if (source.registry) {
                    try {
                        const registryUrl = new URL(source.registry);
                        typeSpecificPart += `-${registryUrl.hostname}`;
                    }
                    catch {
                        // Ignore invalid registry URLs
                    }
                }
                break;
            case contracts_1.PluginSourceType.GAUZY:
                typeSpecificPart = source.fileName ? `file-${source.fileName.replace('.zip', '')}` : 'uploaded-file';
                break;
            default:
                typeSpecificPart = 'unknown-source';
        }
        // Combine all parts and clean up any undefined/null values
        const allParts = [...baseParts, typeSpecificPart].filter((part) => !!part);
        // Join with underscores and convert to lowercase for consistency
        return allParts.join('_').toLowerCase();
    }
    getFileStorageProvider(storageProvider) {
        return new core_1.FileStorage().setProvider(storageProvider).getProviderInstance();
    }
};
exports.PluginSourceSubscriber = PluginSourceSubscriber;
exports.PluginSourceSubscriber = PluginSourceSubscriber = PluginSourceSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], PluginSourceSubscriber);
//# sourceMappingURL=plugin-source.subscriber.js.map