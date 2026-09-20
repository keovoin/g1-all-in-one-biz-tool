"use strict";
var TaskSizeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSizeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const context_1 = require("../../core/context");
const utils_1 = require("../../core/utils");
const task_metadata_service_1 = require("../task-metadata.service");
const size_entity_1 = require("./size.entity");
const default_global_sizes_1 = require("./default-global-sizes");
const type_orm_task_size_repository_1 = require("./repository/type-orm-task-size.repository");
const mikro_orm_task_size_repository_1 = require("./repository/mikro-orm-task-size.repository");
let TaskSizeService = TaskSizeService_1 = class TaskSizeService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmTaskSizeRepository, mikroOrmTaskSizeRepository, knexConnection) {
        super(typeOrmTaskSizeRepository, mikroOrmTaskSizeRepository, knexConnection);
        this.typeOrmTaskSizeRepository = typeOrmTaskSizeRepository;
        this.mikroOrmTaskSizeRepository = mikroOrmTaskSizeRepository;
        this.knexConnection = knexConnection;
        this.logger = new common_1.Logger(TaskSizeService_1.name);
    }
    /**
     * Few task sizes can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await super.delete(id, {
            where: { isSystem: false }
        });
    }
    /**
     * Find task sizes based on the provided parameters.
     *
     * @param params - The input parameters for the task size search.
     * @returns A promise resolving to the paginated list of task sizes.
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
            this.logger.error('Failed to retrieve task sizes. Ensure that the provided parameters are valid and complete.', error);
            throw new common_1.BadRequestException('Failed to retrieve task sizes. Ensure that the provided parameters are valid and complete.', error);
        }
    }
    /**
     * Create bulk task sizes for tenants.
     * Uses saveManyWithoutEnrichment to preserve each entity's specific tenantId.
     *
     * @param tenants
     */
    async bulkCreateTenantsTaskSizes(tenants) {
        try {
            if (!tenants?.length) {
                return [];
            }
            const sizes = tenants.flatMap((tenant) => default_global_sizes_1.DEFAULT_GLOBAL_SIZES.map((size) => new size_entity_1.TaskSize({
                ...size,
                icon: `ever-icons/${size.icon}`,
                tenant,
                isSystem: false
            })));
            return await this.saveManyWithoutEnrichment(sizes);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Create bulk task sizes for organization.
     *
     * @param organization
     */
    async bulkCreateOrganizationTaskSizes(organization) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId });
            const sizes = items.map((item) => new size_entity_1.TaskSize({
                tenantId,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                organization,
                isSystem: false
            }));
            return await this.saveMany(sizes);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Create bulk task sizes for specific organization entity.
     *
     * @param entity
     * @returns
     */
    async createBulkSizesByEntity(entity) {
        try {
            const { organizationId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId, organizationId });
            const entitiesToCreate = items.map((item) => ({
                ...entity,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                isSystem: false
            }));
            return await this.createMany(entitiesToCreate);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TaskSizeService = TaskSizeService;
exports.TaskSizeService = TaskSizeService = TaskSizeService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_size_repository_1.TypeOrmTaskSizeRepository,
        mikro_orm_task_size_repository_1.MikroOrmTaskSizeRepository, Function])
], TaskSizeService);
//# sourceMappingURL=size.service.js.map