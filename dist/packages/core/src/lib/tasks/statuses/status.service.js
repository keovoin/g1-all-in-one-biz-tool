"use strict";
var TaskStatusService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatusService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const context_1 = require("../../core/context");
const utils_1 = require("../../core/utils");
const task_metadata_service_1 = require("../task-metadata.service");
const status_entity_1 = require("./status.entity");
const default_global_statuses_1 = require("./default-global-statuses");
const standard_statuses_template_1 = require("./standard-statuses-template");
const type_orm_task_status_repository_1 = require("./repository/type-orm-task-status.repository");
const mikro_orm_task_status_repository_1 = require("./repository/mikro-orm-task-status.repository");
let TaskStatusService = TaskStatusService_1 = class TaskStatusService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmTaskStatusRepository, mikroOrmTaskStatusRepository, knexConnection) {
        super(typeOrmTaskStatusRepository, mikroOrmTaskStatusRepository, knexConnection);
        this.typeOrmTaskStatusRepository = typeOrmTaskStatusRepository;
        this.mikroOrmTaskStatusRepository = mikroOrmTaskStatusRepository;
        this.knexConnection = knexConnection;
        this.logger = new common_1.Logger(TaskStatusService_1.name);
    }
    /**
     * Create task status
     *
     * @param entity - object that contains the input values and template to be used
     * @returns - a promise that resolves after task status created
     */
    async create(entity) {
        try {
            // Extract the template from the entity
            const { template, ...partialEntity } = entity;
            // Get the work flow for the template
            const workFlow = standard_statuses_template_1.TASK_STATUSES_TEMPLATES[template];
            // Save the entity with the work flow
            return await this.save({ ...partialEntity, ...workFlow });
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to add task status: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
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
            this.logger.error('Failed to retrieve task statuses. Ensure that the provided parameters are valid and complete.', error);
            throw new common_1.BadRequestException('Failed to retrieve task statuses. Ensure that the provided parameters are valid and complete.', error);
        }
    }
    /**
     * Few Statuses can't be removed/delete because they are global
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
     * Creates default task statuses for multiple tenants.
     *
     * This method generates a Cartesian product between the provided tenants
     * and the DEFAULT_GLOBAL_STATUSES, creating system-independent task statuses
     * for each tenant.
     *
     * @param tenants Array of tenants for which task statuses should be created
     * @returns Promise resolving to an array of created task statuses
     */
    async bulkCreateTenantsStatus(tenants) {
        if (!tenants?.length) {
            return [];
        }
        // Generate task statuses for each tenant using default global statuses
        const statuses = tenants.flatMap((tenant) => default_global_statuses_1.DEFAULT_GLOBAL_STATUSES.map((status) => new status_entity_1.TaskStatus({
            ...status,
            icon: `ever-icons/${status.icon}`,
            isSystem: false,
            tenant
        })));
        // Save statuses without tenant enrichment to preserve
        // the original tenantId assigned to each entity.
        return await this.saveManyWithoutEnrichment(statuses);
    }
    /**
     * Creates bulk task statuses for a specific organization.
     *
     * @param organization The organization for which the task statuses will be created.
     * @returns A promise that resolves to an array of created task statuses.
     */
    async bulkCreateOrganizationStatus(organization) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId });
            const statuses = items.map((item, index) => new status_entity_1.TaskStatus({
                tenantId: item.tenantId,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                organization,
                isSystem: false,
                order: item.order ?? index,
                isCollapsed: item.isCollapsed
            }));
            return (await this.saveMany(statuses));
        }
        catch (error) {
            this.logger.error('Error while creating task statuses for organization', error.message);
            return [];
        }
    }
    /**
     * Creates bulk task statuses based on the properties of a given entity.
     *
     * @param entity A partial representation of the entity from which properties will be extracted for creating task statuses.
     * @returns A promise that resolves to an array of created task statuses.
     */
    async createBulkStatusesByEntity(entity) {
        try {
            const { organizationId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId, organizationId });
            const entities = items.map((item, index) => ({
                ...entity,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                isSystem: false,
                order: item.order ?? index,
                isCollapsed: item.isCollapsed
            }));
            return await this.createMany(entities);
        }
        catch (error) {
            this.logger.error('Error while creating task statuses', error);
            return [];
        }
    }
    /**
     * Reorders a list of items based on the given ReorderDTO array.
     * @param list - An array of ReorderDTO representing the IDs and their new orders.
     * @returns An object indicating success or failure, along with the updated list.
     * @throws BadRequestException if an error occurs during reordering.
     */
    async reorder(list) {
        try {
            // Loop through the list and update each item's order
            for await (const item of list) {
                this.logger.log(`Updating item with ID: ${item.id} to order: ${item.order}`); // Logging operation
                // Update the entity with the new order value
                if (item.id) {
                    await super.update({ id: item.id, isSystem: false }, { order: item.order });
                }
            }
            // Return a success status and the updated list
            return { success: true, list };
        }
        catch (error) {
            // Handle errors during reordering
            this.logger.error('Error during reordering of task statues:', error); // Log the error for debugging
            throw new common_1.BadRequestException('An error occurred while reordering task statues. Please try again.', error); // Return error
        }
    }
    /**
     * Marks an task status as default and updates other task statuses accordingly.
     *
     * @param id The ID of the task status to mark as default.
     * @param input An object containing input parameters, including organization, team, and project IDs.
     * @returns A Promise that resolves to an array of updated task statuses.
     */
    async markAsDefault(id, input) {
        try {
            const { organizationId, organizationTeamId, projectId } = input;
            const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
            // Find the task status by ID
            const taskStatus = await this.findOneByIdString(id, { where: { isSystem: false } });
            // Update the task status to mark it as default
            taskStatus.isDefault = true;
            // Define options to find task statuses to update
            const findOptions = {
                ...(organizationId ? { organizationId } : {}),
                ...(organizationTeamId ? { organizationTeamId } : {}),
                ...(projectId ? { projectId } : {}),
                tenantId,
                isSystem: false
            };
            // Update other task statuses to mark them as non-default
            await super.update(findOptions, { isDefault: false });
            // Save the updated issue type
            await super.save(taskStatus);
            // Fetch and return all task statuses based on the specified parameters
            const { items = [] } = await super.fetchAll({
                tenantId,
                organizationId,
                organizationTeamId,
                projectId
            });
            return items;
        }
        catch (error) {
            // If an error occurs, throw a BadRequestException
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.TaskStatusService = TaskStatusService;
exports.TaskStatusService = TaskStatusService = TaskStatusService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_status_repository_1.TypeOrmTaskStatusRepository,
        mikro_orm_task_status_repository_1.MikroOrmTaskStatusRepository, Function])
], TaskStatusService);
//# sourceMappingURL=status.service.js.map