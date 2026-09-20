"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenantService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const request_context_1 = require("../core/context/request-context");
const tenant_aware_crud_service_1 = require("../core/crud/tenant-aware-crud.service");
const mikro_orm_integration_tenant_repository_1 = require("./repository/mikro-orm-integration-tenant.repository");
const type_orm_integration_tenant_repository_1 = require("./repository/type-orm-integration-tenant.repository");
let IntegrationTenantService = class IntegrationTenantService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmIntegrationTenantRepository, mikroOrmIntegrationTenantRepository) {
        super(typeOrmIntegrationTenantRepository, mikroOrmIntegrationTenantRepository);
    }
    /**
     * Find and return a paginated list of IntegrationTenant entities.
     *
     * @param options - Optional query and pagination options.
     * @returns A Promise that resolves to a paginated list of IntegrationTenant entities.
     */
    async findAll(options) {
        // Define where conditions by merging provided options with a condition for non-null integrationId.
        const whereConditions = {
            ...options?.where,
            integrationId: (0, typeorm_1.Not)((0, typeorm_1.IsNull)())
        };
        // Call the superclass's findAll method with merged options and where conditions.
        return await super.findAll({
            ...options,
            where: whereConditions
        });
    }
    /**
     * Create a new integration tenant with the provided input.
     *
     * @param input The data for creating the integration tenant.
     * @returns A promise that resolves to the created integration tenant.
     */
    async create(input) {
        const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const { organizationId } = input;
        const settings = (input.settings || []).map((item) => ({
            ...item,
            tenantId,
            organizationId
        }));
        const entitySettings = (input.entitySettings || []).map((item) => ({
            ...item,
            tenantId,
            organizationId
        }));
        return await super.create({
            ...input,
            settings,
            entitySettings,
            tenantId,
            organizationId
        });
    }
    /**
     * Retrieve an integration tenant by specified options.
     * @param input - The input options for finding the integration tenant.
     * @returns The integration tenant if found, or `false` if not found or an error occurs.
     */
    async getIntegrationByOptions(input) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const { organizationId, name } = input;
            const integration = await super.findOneByOptions({
                where: {
                    tenantId,
                    organizationId,
                    isActive: true,
                    isArchived: false,
                    integration: {
                        provider: name,
                        isActive: true,
                        isArchived: false
                    }
                },
                order: { updatedAt: 'DESC' },
                relations: typeof input.relations === 'string' ? [input.relations] : input.relations
            });
            return integration || false;
        }
        catch (error) {
            console.error('Error occurred while retrieving integration tenant settings:', error?.message);
            return false;
        }
    }
    /**
     * Get integration tenant settings by specified options.
     * @param input - The input options for finding the integration tenant settings.
     * @returns The integration tenant settings if found. null if not found or an error occurs.
     */
    async getIntegrationTenantSettings(input) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const { organizationId, name } = input;
            return await super.findOneByOptions({
                where: {
                    tenantId,
                    organizationId,
                    name,
                    isActive: true,
                    isArchived: false,
                    integration: {
                        provider: name,
                        isActive: true,
                        isArchived: false
                    }
                },
                relations: {
                    settings: true
                }
            });
        }
        catch (error) {
            console.error('Error occurred while retrieving integration tenant settings:', error?.message);
            return null;
        }
    }
    /**
     * Find an IntegrationTenant by entity type.
     *
     * @param param0 - Destructured parameters object.
     *   @param organizationId - The ID of the organization.
     *   @param integrationId - The ID of the integration.
     *   @param entityType - The entity type for which to find the IntegrationTenant.
     * @returns A promise that resolves to the found IntegrationTenant or null if not found.
     */
    async findIntegrationTenantByEntity({ organizationId, integrationId, entityType }) {
        // Callers may run outside a request (event-bus subscribers such as the AI screenshot analysis);
        // only pin the tenant when one is known — the organization + integration ids already scope the
        // lookup, and a null tenantId must not enter the where.
        const tenantId = request_context_1.RequestContext.currentTenantId();
        return await super.findOneByOptions({
            where: {
                ...(tenantId ? { tenantId } : {}),
                organizationId,
                integrationId,
                isActive: true,
                isArchived: false,
                entitySettings: {
                    entity: entityType,
                    organizationId,
                    sync: true,
                    isActive: true,
                    isArchived: false
                }
            }
        });
    }
};
exports.IntegrationTenantService = IntegrationTenantService;
exports.IntegrationTenantService = IntegrationTenantService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_integration_tenant_repository_1.TypeOrmIntegrationTenantRepository,
        mikro_orm_integration_tenant_repository_1.MikroOrmIntegrationTenantRepository])
], IntegrationTenantService);
//# sourceMappingURL=integration-tenant.service.js.map