"use strict";
var TaskPriorityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriorityService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const context_1 = require("../../core/context");
const utils_1 = require("../../core/utils");
const task_metadata_service_1 = require("../task-metadata.service");
const priority_entity_1 = require("./priority.entity");
const default_global_priorities_1 = require("./default-global-priorities");
const mikro_orm_task_priority_repository_1 = require("./repository/mikro-orm-task-priority.repository");
const type_orm_task_priority_repository_1 = require("./repository/type-orm-task-priority.repository");
let TaskPriorityService = TaskPriorityService_1 = class TaskPriorityService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmTaskPriorityRepository, mikroOrmTaskPriorityRepository, knexConnection) {
        super(typeOrmTaskPriorityRepository, mikroOrmTaskPriorityRepository, knexConnection);
        this.typeOrmTaskPriorityRepository = typeOrmTaskPriorityRepository;
        this.mikroOrmTaskPriorityRepository = mikroOrmTaskPriorityRepository;
        this.knexConnection = knexConnection;
        this.logger = new common_1.Logger(TaskPriorityService_1.name);
    }
    /**
     * Few task priorities can't be removed/delete because they are global
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
     * GET priorities by filters.
     * If parameters not match, retrieve global task priorities.
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
            this.logger.error('Failed to retrieve task priorities. Ensure that the provided parameters are valid and complete.', error);
            throw new common_1.BadRequestException('Failed to retrieve task priorities. Ensure that the provided parameters are valid and complete.', error);
        }
    }
    /**
     * Create bulk task priorities for tenants.
     * Uses saveManyWithoutEnrichment to preserve each entity's specific tenantId.
     *
     * @param tenants
     */
    async bulkCreateTenantsTaskPriorities(tenants) {
        try {
            if (!tenants?.length) {
                return [];
            }
            const priorities = tenants.flatMap((tenant) => default_global_priorities_1.DEFAULT_GLOBAL_PRIORITIES.map((priority) => new priority_entity_1.TaskPriority({
                ...priority,
                icon: `ever-icons/${priority.icon}`,
                tenant,
                isSystem: false
            })));
            return await this.saveManyWithoutEnrichment(priorities);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Create bulk task priorities for organization.
     *
     * @param organization
     */
    async bulkCreateOrganizationTaskPriorities(organization) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId });
            const priorities = items.map((item) => new priority_entity_1.TaskPriority({
                tenantId,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                organization,
                isSystem: false
            }));
            return await this.saveMany(priorities);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Create bulk task priorities for specific organization entity.
     *
     * @param entity
     * @returns
     */
    async createBulkPrioritiesByEntity(entity) {
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
exports.TaskPriorityService = TaskPriorityService;
exports.TaskPriorityService = TaskPriorityService = TaskPriorityService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_priority_repository_1.TypeOrmTaskPriorityRepository,
        mikro_orm_task_priority_repository_1.MikroOrmTaskPriorityRepository, Function])
], TaskPriorityService);
//# sourceMappingURL=priority.service.js.map