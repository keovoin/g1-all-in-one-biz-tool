"use strict";
var PluginVersionSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVersionSubscriber = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const plugin_version_entity_1 = require("../../domain/entities/plugin-version.entity");
const plugin_security_service_1 = require("../../domain/services/plugin-security.service");
/**
 * Subscriber that handles security-related operations for PluginVersion entities.
 * Automatically generates checksums and signatures for newly created plugin versions.
 */
let PluginVersionSubscriber = PluginVersionSubscriber_1 = class PluginVersionSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor(pluginSecurityService, dataSource) {
        super();
        this.pluginSecurityService = pluginSecurityService;
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(PluginVersionSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    /**
     * Specifies the entity this subscriber listens to
     */
    listenTo() {
        return plugin_version_entity_1.PluginVersion;
    }
    /**
     * After insert hook to generate and assign security credentials
     * @param event The insert event containing the newly created entity
     */
    async afterInsert(event) {
        try {
            const entity = event.entity;
            // Type guard to ensure we're working with the correct entity
            if (!entity) {
                this.logger.warn(`Expected Plugin Version entity`);
                return;
            }
            // Generate security credentials concurrently for better performance
            const [checksum, signature] = await Promise.all([
                this.pluginSecurityService.generateChecksum(entity.id),
                this.pluginSecurityService.generateSignature(entity.id)
            ]);
            // Update entity with generated security credentials
            entity.checksum = checksum;
            entity.signature = signature;
            // Save the updated entity
            await event.manager.save(entity);
            this.logger.debug(`Generated security credentials for plugin version ID: ${entity.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to generate security credentials for plugin version: ${error.message}`, error.stack);
        }
    }
    /**
     * Prevent signature or checksum modification after creation
     */
    async beforeUpdate(event) {
        const entity = event.entity;
        const existingEntity = await event.manager.findOne(plugin_version_entity_1.PluginVersion, {
            where: { id: entity.id }
        });
        if (!existingEntity)
            return;
        // Prevent modification of security credentials
        if (entity.checksum !== existingEntity.checksum || entity.signature !== existingEntity.signature) {
            this.logger.warn(`Attempt to modify security credentials for plugin version ID: ${entity.id}`);
            entity.checksum = existingEntity.checksum;
            entity.signature = existingEntity.signature;
        }
    }
};
exports.PluginVersionSubscriber = PluginVersionSubscriber;
exports.PluginVersionSubscriber = PluginVersionSubscriber = PluginVersionSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [plugin_security_service_1.PluginSecurityService, typeorm_1.DataSource])
], PluginVersionSubscriber);
//# sourceMappingURL=plugin-version.subscriber.js.map