"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskVersionService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const task_metadata_service_1 = require("../task-metadata.service");
const context_1 = require("../../core/context");
const utils_1 = require("../../core/utils");
const version_entity_1 = require("./version.entity");
const default_global_versions_1 = require("./default-global-versions");
const mikro_orm_task_version_repository_1 = require("./repository/mikro-orm-task-version.repository");
const type_orm_task_version_repository_1 = require("./repository/type-orm-task-version.repository");
let TaskVersionService = class TaskVersionService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmTaskVersionRepository, mikroOrmTaskVersionRepository, knexConnection) {
        super(typeOrmTaskVersionRepository, mikroOrmTaskVersionRepository, knexConnection);
        this.typeOrmTaskVersionRepository = typeOrmTaskVersionRepository;
        this.mikroOrmTaskVersionRepository = mikroOrmTaskVersionRepository;
        this.knexConnection = knexConnection;
    }
    /**
     * GET versions by filters
     * If parameters not match, retrieve global versions
     *
     * @param params
     * @returns
     */
    async fetchAll(params) {
        try {
            if (this.ormType == utils_1.MultiORMEnum.TypeORM && (0, config_1.isPostgres)()) {
                return await super.fetchAllByKnex(params);
            }
            else {
                return await super.fetchAll(params);
            }
        }
        catch (error) {
            console.log('Failed to retrieve task versions. Ensure that the provided parameters are valid and complete.', error);
            throw new common_1.BadRequestException('Failed to retrieve task versions. Ensure that the provided parameters are valid and complete.', error);
        }
    }
    /**
     * Few Versions can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await super.delete(id, {
            where: {
                isSystem: false
            }
        });
    }
    /**
     * Creates default task versions for multiple tenants.
     *
     * @param tenants Array of tenants for which task versions should be created.
     * @returns Promise resolving to an array of created task versions.
     */
    async bulkCreateTenantsVersions(tenants) {
        if (!tenants?.length) {
            return [];
        }
        const versions = tenants.flatMap((tenant) => default_global_versions_1.DEFAULT_GLOBAL_VERSIONS.map((version) => new version_entity_1.TaskVersion({
            ...version,
            icon: `ever-icons/${version.icon}`,
            isSystem: false,
            tenant
        })));
        return await this.saveManyWithoutEnrichment(versions);
    }
    /**
     * Creates default task versions for a specific organization.
     *
     * @param organization The organization for which task versions will be created.
     * @returns A promise that resolves to an array of created task versions.
     */
    async bulkCreateOrganizationVersions(organization) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const { items = [] } = await super.fetchAll({ tenantId });
        const versions = items.map((item) => new version_entity_1.TaskVersion({
            tenantId: item.tenantId,
            name: item.name,
            value: item.value,
            description: item.description,
            icon: item.icon,
            color: item.color,
            organization,
            isSystem: false
        }));
        return (await this.saveMany(versions));
    }
    /**
     * Creates bulk task versions for a specific organization entity.
     *
     * @param entity Base entity input to use as a template for each version.
     * @returns A promise that resolves to an array of created task versions.
     */
    async createBulkVersionsByEntity(entity) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? entity.tenantId;
        const organizationId = entity.organizationId;
        const { items = [] } = await this.fetchAll({ tenantId, organizationId });
        const versions = items.map((item) => ({
            ...entity,
            name: item.name,
            value: item.value,
            description: item.description,
            icon: item.icon,
            color: item.color,
            isSystem: false
        }));
        return await this.createMany(versions);
    }
};
exports.TaskVersionService = TaskVersionService;
exports.TaskVersionService = TaskVersionService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_version_repository_1.TypeOrmTaskVersionRepository,
        mikro_orm_task_version_repository_1.MikroOrmTaskVersionRepository, Function])
], TaskVersionService);
//# sourceMappingURL=version.service.js.map