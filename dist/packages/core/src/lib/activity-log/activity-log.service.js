"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const config_1 = require("@gauzy/config");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const utils_2 = require("../core/utils");
const activity_log_helper_1 = require("./activity-log.helper");
const activity_log_event_1 = require("./events/activity-log.event");
const get_activity_logs_dto_1 = require("./dto/get-activity-logs.dto");
const type_orm_activity_log_repository_1 = require("./repository/type-orm-activity-log.repository");
const mikro_orm_activity_log_repository_1 = require("./repository/mikro-orm-activity-log.repository");
let ActivityLogService = class ActivityLogService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmActivityLogRepository, mikroOrmActivityLogRepository, _eventBus) {
        super(typeOrmActivityLogRepository, mikroOrmActivityLogRepository);
        this.typeOrmActivityLogRepository = typeOrmActivityLogRepository;
        this.mikroOrmActivityLogRepository = mikroOrmActivityLogRepository;
        this._eventBus = _eventBus;
    }
    /**
     * Creates a new activity log entry with the provided input, while associating it with the current employee and tenant.
     *
     * @param input - The data required to create an activity log entry.
     * @returns The created activity log entry.
     * @throws BadRequestException when the log creation fails.
     */
    async create(input) {
        try {
            // Retrieve the current tenant ID from the request context or use the provided tenantId
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Retrieve the current employee's ID from the request context
            const employeeId = context_1.RequestContext.currentEmployeeId() ?? input.employeeId;
            // Prepare input data - serialize JSON fields for SQLite to prevent "Too many parameter values" error
            let preparedInput = { ...input, employeeId, tenantId };
            if ((0, config_1.isSqlite)() || (0, config_1.isBetterSqlite3)()) {
                preparedInput = (0, activity_log_helper_1.serializeActivityLogForSqlite)(preparedInput);
            }
            // Create the activity log entry using the prepared input
            return await super.create(preparedInput);
        }
        catch (error) {
            console.log('Error while creating activity log:', error);
            throw new common_1.BadRequestException('Error while creating activity log', error);
        }
    }
    /**
     * Finds and retrieves activity logs based on the given filters criteria.
     *
     * @param {GetActivityLogsDTO} filters - Filter criteria to find activity logs, including entity, entityId, action, actorType, isActive, isArchived, orderBy, and order.
     * @returns {Promise<IPagination<IActivityLog>>} - A promise that resolves to a paginated list of activity logs.
     *
     * Example usage:
     * ```
     * const logs = await findActivityLogs({
     *     entity: 'User',
     *     action: 'CREATE',
     *     orderBy: 'updatedAt',
     *     order: 'ASC'
     * });
     * ```
     */
    async findActivityLogs(filters) {
        const { organizationId, entity, entityId, action, actorType, isActive = true, isArchived = false, orderBy = 'createdAt', order = 'DESC', relations = [] } = filters;
        // Fallback to default if invalid orderBy/order values are provided
        const orderField = get_activity_logs_dto_1.allowedOrderFields.includes(orderBy) ? orderBy : 'createdAt';
        const orderDirection = get_activity_logs_dto_1.allowedOrderDirections.includes(order.toUpperCase()) ? order.toUpperCase() : 'DESC';
        // Define order option
        const orderOption = { [orderField]: orderDirection };
        // Build the 'where' condition using concise syntax
        const where = {
            ...(organizationId && { organizationId }),
            ...(entity && { entity }),
            ...(entityId && { entityId }),
            ...(action && { action }),
            ...((0, utils_1.isNotNullOrUndefined)(actorType) && { actorType }),
            isActive,
            isArchived
        };
        const take = filters.take ? filters.take : 100; // Default take value if not provided
        // Pagination: ensure `filters.skip` is a positive integer starting from 1
        const skip = filters.skip && Number.isInteger(filters.skip) && filters.skip > 0 ? filters.skip : 1;
        // Ensure that filters are properly defined
        const queryOptions = {
            where,
            ...(relations && { relations: (0, utils_2.parseFindOptionsRelations)(relations) }),
            take: take,
            skip: take * (skip - 1) // Calculate offset (skip) based on validated skip value
        };
        // Apply sorting options (if provided)
        queryOptions.order = orderOption;
        // Retrieve activity logs using the base class method
        return await super.findAll(queryOptions);
    }
    /**
     * @description Create or Update Activity Log
     * @template T
     * @param {BaseEntityEnum} entity - Entity type for whom creating activity log (E.g : Task, OrganizationProject, etc.)
     * @param {string} entityName - Name or Title of the entity
     * @param {ActorTypeEnum} actor - The actor type performing the action (User or System)
     * @param {ID} organizationId
     * @param {ID} tenantId
     * @param {ActionTypeEnum} actionType - Action performed (Created or Updated)
     * @param {T} data - Entity data (for Created action) or Updated entity data (for Updated action)
     * @param {Partial<T>} [originalValues] - Entity data before update (optional for Update action)
     * @param {Partial<T>} [newValues] - Entity updated data per field (optional for Update action)
     */
    logActivity(entity, actionType, actor, entityId, entityName, data, organizationId, tenantId, originalValues, newValues) {
        let jsonFields = new Object();
        // If it's an update action, add updated fields and values
        if (actionType === contracts_1.ActionTypeEnum.Updated && originalValues && newValues) {
            const { updatedFields, previousValues, updatedValues } = (0, activity_log_helper_1.activityLogUpdatedFieldsAndValues)(originalValues, newValues);
            // Add updated fields and values to the log
            jsonFields = Object.assign({}, { updatedFields, previousValues, updatedValues });
        }
        // Emit the event to log the activity
        this._eventBus.publish(new activity_log_event_1.ActivityLogEvent({
            entity,
            entityId,
            action: actionType,
            actorType: actor,
            description: (0, activity_log_helper_1.generateActivityLogDescription)(actionType, entity, entityName),
            data,
            organizationId,
            tenantId,
            ...jsonFields
        }));
    }
};
exports.ActivityLogService = ActivityLogService;
exports.ActivityLogService = ActivityLogService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_activity_log_repository_1.TypeOrmActivityLogRepository,
        mikro_orm_activity_log_repository_1.MikroOrmActivityLogRepository,
        cqrs_1.EventBus])
], ActivityLogService);
//# sourceMappingURL=activity-log.service.js.map