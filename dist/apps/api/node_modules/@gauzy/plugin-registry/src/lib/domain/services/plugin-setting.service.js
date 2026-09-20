"use strict";
var PluginSettingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSettingService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const mikro_orm_plugin_setting_repository_1 = require("../repositories/mikro-orm-plugin-setting.repository");
const type_orm_plugin_setting_repository_1 = require("../repositories/type-orm-plugin-setting.repository");
let PluginSettingService = PluginSettingService_1 = class PluginSettingService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginSettingRepository, mikroOrmPluginSettingRepository) {
        super(typeOrmPluginSettingRepository, mikroOrmPluginSettingRepository);
        this.typeOrmPluginSettingRepository = typeOrmPluginSettingRepository;
        this.mikroOrmPluginSettingRepository = mikroOrmPluginSettingRepository;
        this.logger = new common_1.Logger(PluginSettingService_1.name);
    }
    /**
     * Create a new plugin setting with validation
     */
    async createSetting(input) {
        this.validateCreateInput(input);
        try {
            // Check for duplicate key within the same plugin and tenant context
            const existingSetting = await this.findByKey(input.pluginId, input.key, input.pluginTenantId);
            if (existingSetting) {
                throw new common_1.BadRequestException(`Setting with key "${input.key}" already exists for this plugin`);
            }
            const setting = await this.create(input);
            this.logger.log(`Plugin setting created: ${setting.id}`);
            return setting;
        }
        catch (error) {
            this.logger.error(`Failed to create plugin setting: ${error.message}`, error.stack);
            throw error;
        }
    }
    /**
     * Update plugin setting with validation
     */
    async updateSetting(id, input) {
        try {
            const existingSetting = await this.findOneByIdString(id);
            if (!existingSetting) {
                throw new common_1.NotFoundException(`Plugin setting with ID "${id}" not found`);
            }
            await this.update(id, input);
            const updatedSetting = await this.findOneByIdString(id);
            this.logger.log(`Plugin setting updated: ${id}`);
            return updatedSetting;
        }
        catch (error) {
            this.logger.error(`Failed to update plugin setting: ${error.message}`, error.stack);
            throw error;
        }
    }
    /**
     * Find plugin settings by plugin ID with enhanced filtering
     */
    async findByPluginId(pluginId, relations = [], tenantId, organizationId) {
        this.validatePluginId(pluginId);
        const where = { pluginId };
        if (tenantId)
            where.tenantId = tenantId;
        if (organizationId)
            where.organizationId = organizationId;
        const result = await this.findAll({
            where,
            relations: (0, core_1.parseFindOptionsRelations)(relations),
            order: {
                category: {
                    name: 'ASC'
                },
                order: 'ASC',
                key: 'ASC'
            }
        });
        return result.items || [];
    }
    /**
     * Find plugin settings by plugin tenant ID with enhanced filtering
     */
    async findByPluginTenantId(pluginTenantId, relations = [], tenantId, organizationId) {
        if (!pluginTenantId) {
            throw new common_1.BadRequestException('Plugin tenant ID is required');
        }
        const where = { pluginTenantId };
        if (tenantId)
            where.tenantId = tenantId;
        if (organizationId)
            where.organizationId = organizationId;
        const result = await this.findAll({
            where,
            relations: (0, core_1.parseFindOptionsRelations)(relations),
            order: {
                category: {
                    name: 'ASC'
                },
                order: 'ASC',
                key: 'ASC'
            }
        });
        return result.items || [];
    }
    /**
     * Find a specific plugin setting by key with validation
     */
    async findByKey(pluginId, key, pluginTenantId, relations = []) {
        this.validatePluginId(pluginId);
        this.validateKey(key);
        const where = { pluginId, key };
        if (pluginTenantId) {
            where.tenantId = pluginTenantId;
        }
        try {
            const result = await this.findOneOrFailByWhereOptions(where);
            return result.record;
        }
        catch {
            return null;
        }
    }
    /**
     * Get plugin settings by category with enhanced validation
     */
    async findByCategory(pluginId, categoryId, pluginTenantId, relations = [], tenantId, organizationId) {
        this.validatePluginId(pluginId);
        this.validateCategory(categoryId);
        const where = { pluginId, categoryId };
        if (pluginTenantId)
            where.tenantId = pluginTenantId;
        if (tenantId)
            where.tenantId = tenantId;
        if (organizationId)
            where.organizationId = organizationId;
        const result = await this.findAll({
            where,
            relations: (0, core_1.parseFindOptionsRelations)(relations),
            order: { order: 'ASC', key: 'ASC' }
        });
        return result.items || [];
    }
    /**
     * Get setting value with type safety
     */
    async getSettingValue(pluginId, key, pluginTenantId, defaultValue) {
        const setting = await this.findByKey(pluginId, key, pluginTenantId);
        if (!setting) {
            return defaultValue ?? null;
        }
        try {
            // Try to parse JSON if the value is a string that looks like JSON
            if (typeof setting.value === 'string' && (setting.value.startsWith('{') || setting.value.startsWith('['))) {
                return JSON.parse(setting.value);
            }
            return setting.value;
        }
        catch {
            // If JSON parsing fails, return the raw value
            return setting.value;
        }
    }
    /**
     * Set setting value with type conversion
     */
    async setSettingValue(pluginId, key, value, pluginTenantId, tenantId, organizationId) {
        let setting = await this.findByKey(pluginId, key, pluginTenantId);
        const processedValue = this.processSettingValue(value);
        if (setting) {
            await this.update(setting.id, { value: processedValue });
            setting = await this.findOneByIdString(setting.id);
        }
        else {
            setting = await this.create({
                pluginId,
                key,
                value: processedValue,
                tenantId,
                organizationId
            });
        }
        return setting;
    }
    /**
     * Bulk update settings with transaction support
     */
    async bulkUpdateSettings(pluginId, settings, pluginTenantId, tenantId, organizationId) {
        this.validatePluginId(pluginId);
        if (!settings || settings.length === 0) {
            throw new common_1.BadRequestException('Settings array cannot be empty');
        }
        const updatedSettings = [];
        for (const settingData of settings) {
            const { key, value, categoryId } = settingData;
            this.validateKey(key);
            const setting = await this.setSettingValue(pluginId, key, value, pluginTenantId, tenantId, organizationId);
            // Update category if provided
            if (categoryId && setting.categoryId !== categoryId) {
                await this.update(setting.id, { categoryId });
                const updatedSetting = await this.findOneByIdString(setting.id);
                updatedSettings.push(updatedSetting);
            }
            else {
                updatedSettings.push(setting);
            }
        }
        this.logger.log(`Bulk updated ${updatedSettings.length} settings for plugin: ${pluginId}`);
        return updatedSettings;
    }
    /**
     * Delete setting by key
     */
    async deleteByKey(pluginId, key, pluginTenantId) {
        const setting = await this.findByKey(pluginId, key, pluginTenantId);
        if (!setting) {
            throw new common_1.NotFoundException(`Setting with key "${key}" not found for plugin "${pluginId}"`);
        }
        await this.delete(setting.id);
        this.logger.log(`Plugin setting deleted: ${setting.id}`);
    }
    /**
     * Check if a setting exists
     */
    async exists(pluginId, key, pluginTenantId) {
        const setting = await this.findByKey(pluginId, key, pluginTenantId);
        return !!setting;
    }
    /**
     * Validate setting value against its configuration
     */
    async validateSetting(setting, value) {
        if (!setting) {
            return false;
        }
        // Basic validation based on data type
        switch (setting.dataType) {
            case 'string':
                return typeof value === 'string';
            case 'number':
                return typeof value === 'number' && !isNaN(value);
            case 'boolean':
                return typeof value === 'boolean';
            case 'json':
                try {
                    if (typeof value === 'object')
                        return true;
                    JSON.parse(value);
                    return true;
                }
                catch {
                    return false;
                }
            default:
                return true;
        }
    }
    // Private validation methods
    validateCreateInput(input) {
        if (!input.pluginId) {
            throw new common_1.BadRequestException('Plugin ID is required');
        }
        if (!input.key) {
            throw new common_1.BadRequestException('Setting key is required');
        }
        this.validateKey(input.key);
    }
    validatePluginId(pluginId) {
        if (!pluginId || pluginId.trim().length === 0) {
            throw new common_1.BadRequestException('Plugin ID is required and cannot be empty');
        }
    }
    validateKey(key) {
        if (!key || key.trim().length === 0) {
            throw new common_1.BadRequestException('Setting key is required and cannot be empty');
        }
        // Validate key format (alphanumeric, dots, dashes, underscores)
        const keyRegex = /^[a-zA-Z0-9._-]+$/;
        if (!keyRegex.test(key)) {
            throw new common_1.BadRequestException('Setting key can only contain alphanumeric characters, dots, dashes, and underscores');
        }
    }
    validateCategory(category) {
        if (!category || category.trim().length === 0) {
            throw new common_1.BadRequestException('Category is required and cannot be empty');
        }
    }
    processSettingValue(value) {
        // Convert objects and arrays to JSON strings for storage
        if (typeof value === 'object' && value !== null) {
            return JSON.stringify(value);
        }
        return value;
    }
};
exports.PluginSettingService = PluginSettingService;
exports.PluginSettingService = PluginSettingService = PluginSettingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_setting_repository_1.TypeOrmPluginSettingRepository,
        mikro_orm_plugin_setting_repository_1.MikroOrmPluginSettingRepository])
], PluginSettingService);
//# sourceMappingURL=plugin-setting.service.js.map