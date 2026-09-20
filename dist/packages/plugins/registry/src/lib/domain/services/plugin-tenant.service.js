"use strict";
var PluginTenantService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const plugin_tenant_entity_1 = require("../entities/plugin-tenant.entity");
const mikro_orm_plugin_tenant_repository_1 = require("../repositories/tenant/mikro-orm-plugin-tenant.repository");
const type_orm_plugin_tenant_repository_1 = require("../repositories/tenant/type-orm-plugin-tenant.repository");
let PluginTenantService = PluginTenantService_1 = class PluginTenantService extends core_1.TenantAwareCrudService {
    constructor(typeOrmPluginTenantRepository, mikroOrmPluginTenantRepository) {
        super(typeOrmPluginTenantRepository, mikroOrmPluginTenantRepository);
        this.typeOrmPluginTenantRepository = typeOrmPluginTenantRepository;
        this.mikroOrmPluginTenantRepository = mikroOrmPluginTenantRepository;
        this.logger = new common_1.Logger(PluginTenantService_1.name);
    }
    /**
     * Find or create a plugin tenant relationship
     * This ensures that a plugin tenant exists for the given plugin, tenant, and organization
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns The plugin tenant ID
     */
    async findOrCreate(input) {
        const { pluginId, tenantId, organizationId, scope } = input;
        this.validatePluginTenantInput(pluginId, tenantId);
        // First try to find existing plugin tenant
        const existingPluginTenant = await this.findByPluginAndTenant(pluginId, tenantId, organizationId);
        if (existingPluginTenant) {
            this.logger.debug(`Found existing plugin tenant: ${existingPluginTenant.id}`);
            if (scope && scope !== existingPluginTenant.scope) {
                existingPluginTenant.scope = scope;
                await this.save(existingPluginTenant);
            }
            return existingPluginTenant.id;
        }
        // Get current user Id from context
        const currentUser = core_1.RequestContext.currentUser();
        // Create new plugin tenant if not found
        const data = {
            enabled: true,
            autoInstall: false,
            requiresApproval: true,
            isMandatory: false,
            maxInstallations: null,
            maxActiveUsers: null,
            currentInstallations: 0,
            currentActiveUsers: 0,
            isDataCompliant: true,
            approvedById: currentUser?.id,
            approvedAt: new Date(),
            scope,
            ...input
        };
        if (organizationId) {
            data.organizationId = organizationId;
        }
        try {
            const tenant = plugin_tenant_entity_1.PluginTenant.create(data);
            tenant.allowUser(currentUser);
            this.logger.log(`Created new plugin tenant: ${tenant.id} for plugin ${pluginId} and tenant ${tenantId}`);
            const { id } = await this.save(tenant);
            return id;
        }
        catch (error) {
            this.logger.error(`Failed to create plugin tenant for plugin ${pluginId} and tenant ${tenantId}`, error);
            throw new common_1.BadRequestException(`Failed to create plugin tenant relationship: ${error.message}`);
        }
    }
    /**
     * Find plugin tenant by plugin ID and tenant ID
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns The plugin tenant or null if not found
     */
    async findByPluginAndTenant(pluginId, tenantId, organizationId) {
        this.validatePluginTenantInput(pluginId, tenantId);
        const where = {
            pluginId,
            tenantId
        };
        if (organizationId) {
            where.organizationId = organizationId;
        }
        try {
            const result = await this.findOneOrFailByWhereOptions(where);
            // Check if the result was successful before accessing the record
            if (result.success && result.record) {
                return result.record;
            }
            return null;
        }
        catch {
            return null;
        }
    }
    /**
     * Find all plugin tenants for a specific plugin
     *
     * @param pluginId - The plugin ID
     * @param relations - Optional relations to include
     * @param skip - Number of records to skip (for pagination)
     * @param take - Number of records to take (for pagination)
     * @returns IPagination of plugin tenants
     */
    async findByPluginId(pluginId, relations = [], skip, take) {
        this.validatePluginId(pluginId);
        const result = await this.findAll({
            where: { pluginId },
            relations: (0, core_1.parseFindOptionsRelations)(relations),
            order: { createdAt: 'DESC' },
            ...(skip !== undefined && { skip }),
            ...(take !== undefined && { take })
        });
        return result;
    }
    /**
     * Find all plugin tenants for a specific tenant
     *
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @param relations - Optional relations to include
     * @param skip - Number of records to skip (for pagination)
     * @param take - Number of records to take (for pagination)
     * @returns IPagination of plugin tenants
     */
    async findByTenantId(tenantId, organizationId, relations = [], skip, take) {
        this.validateTenantId(tenantId);
        const where = { tenantId };
        if (organizationId) {
            where.organizationId = organizationId;
        }
        const result = await this.findAll({
            where,
            relations: (0, core_1.parseFindOptionsRelations)(relations),
            order: { createdAt: 'DESC' },
            ...(skip !== undefined && { skip }),
            ...(take !== undefined && { take })
        });
        return result;
    }
    /**
     * Enable plugin for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @returns Updated plugin tenant
     */
    async enablePlugin(pluginTenantId) {
        const pluginTenant = await this.findOneByIdString(pluginTenantId);
        if (!pluginTenant) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        if (pluginTenant.enabled) {
            this.logger.debug(`Plugin tenant ${pluginTenantId} is already enabled`);
            return pluginTenant;
        }
        await this.update(pluginTenantId, { enabled: true });
        const updated = await this.findOneByIdString(pluginTenantId);
        this.logger.log(`Plugin tenant enabled: ${pluginTenantId}`);
        return updated;
    }
    /**
     * Disable plugin for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @returns Updated plugin tenant
     */
    async disablePlugin(pluginTenantId) {
        const { success, record: pluginTenant } = await this.findOneOrFailByIdString(pluginTenantId);
        if (!success) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        if (!pluginTenant.enabled) {
            this.logger.debug(`Plugin tenant ${pluginTenantId} is already disabled`);
            return pluginTenant;
        }
        await this.update(pluginTenantId, { enabled: false });
        const { record: updated } = await this.findOneOrFailByIdString(pluginTenantId);
        this.logger.log(`Plugin tenant disabled: ${pluginTenantId}`);
        return updated;
    }
    /**
     * Update plugin scope for a tenant
     *
     * @param pluginTenantId - The plugin tenant ID
     * @param scope - The new scope
     * @returns Updated plugin tenant
     */
    async updateScope(pluginTenantId, scope) {
        const { success } = await this.findOneOrFailByIdString(pluginTenantId);
        if (!success) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        await this.update(pluginTenantId, { scope });
        const { record: updated } = await this.findOneOrFailByIdString(pluginTenantId);
        this.logger.log(`Plugin tenant scope updated: ${pluginTenantId} to ${scope}`);
        return updated;
    }
    /**
     * Check if plugin is enabled for a tenant
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     * @param organizationId - Optional organization ID
     * @returns True if plugin is enabled, false otherwise
     */
    async isPluginEnabled(pluginId, tenantId, organizationId) {
        const pluginTenant = await this.findByPluginAndTenant(pluginId, tenantId, organizationId);
        return pluginTenant ? pluginTenant.enabled : false;
    }
    /**
     * Delete plugin tenant relationship
     *
     * @param pluginTenantId - The plugin tenant ID
     */
    async deletePluginTenant(pluginTenantId) {
        const { success } = await this.findOneOrFailByIdString(pluginTenantId);
        if (!success) {
            throw new common_1.NotFoundException(`Plugin tenant with ID "${pluginTenantId}" not found`);
        }
        await this.delete(pluginTenantId);
        this.logger.log(`Plugin tenant deleted: ${pluginTenantId}`);
    }
    /**
     * Validate plugin tenant input
     *
     * @param pluginId - The plugin ID
     * @param tenantId - The tenant ID
     */
    validatePluginTenantInput(pluginId, tenantId) {
        this.validatePluginId(pluginId);
        this.validateTenantId(tenantId);
    }
    /**
     * Validate plugin ID
     *
     * @param pluginId - The plugin ID
     */
    validatePluginId(pluginId) {
        if (!pluginId || pluginId.trim().length === 0) {
            throw new common_1.BadRequestException('Plugin ID is required and cannot be empty');
        }
    }
    /**
     * Validate tenant ID
     *
     * @param tenantId - The tenant ID
     */
    validateTenantId(tenantId) {
        if (!tenantId || tenantId.trim().length === 0) {
            throw new common_1.BadRequestException('Tenant ID is required and cannot be empty');
        }
    }
    exists(pluginTenantId) {
        return this.exists(pluginTenantId);
    }
};
exports.PluginTenantService = PluginTenantService;
exports.PluginTenantService = PluginTenantService = PluginTenantService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_plugin_tenant_repository_1.TypeOrmPluginTenantRepository,
        mikro_orm_plugin_tenant_repository_1.MikroOrmPluginTenantRepository])
], PluginTenantService);
//# sourceMappingURL=plugin-tenant.service.js.map