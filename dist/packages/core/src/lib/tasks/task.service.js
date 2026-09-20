"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const config_1 = require("@gauzy/config");
const crud_1 = require("./../core/crud");
const html_sanitizer_1 = require("./../core/html-sanitizer");
const utils_2 = require("./../core/utils");
const util_1 = require("./../core/util");
const context_1 = require("../core/context");
const view_service_1 = require("./views/view.service");
const entity_subscription_service_1 = require("../entity-subscription/entity-subscription.service");
const mention_service_1 = require("../mention/mention.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const employee_notification_service_1 = require("../employee-notification/employee-notification.service");
const employee_recent_visit_service_1 = require("../employee-recent-visit/employee-recent-visit.service");
const events_1 = require("../entity-subscription/events");
const type_orm_organization_sprint_task_history_repository_1 = require("./../organization-sprint/repository/type-orm-organization-sprint-task-history.repository");
const database_helper_1 = require("./../database/database.helper");
const type_orm_task_repository_1 = require("./repository/type-orm-task.repository");
const mikro_orm_task_repository_1 = require("./repository/mikro-orm-task.repository");
const decorators_1 = require("../core/decorators");
let TaskService = class TaskService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTaskRepository, mikroOrmTaskRepository, typeOrmOrganizationSprintTaskHistoryRepository, _eventBus, _taskViewService, _entitySubscriptionService, _mentionService, _activityLogService, _employeeNotificationService, _employeeRecentVisitService) {
        super(typeOrmTaskRepository, mikroOrmTaskRepository);
        this.typeOrmTaskRepository = typeOrmTaskRepository;
        this.mikroOrmTaskRepository = mikroOrmTaskRepository;
        this.typeOrmOrganizationSprintTaskHistoryRepository = typeOrmOrganizationSprintTaskHistoryRepository;
        this._eventBus = _eventBus;
        this._taskViewService = _taskViewService;
        this._entitySubscriptionService = _entitySubscriptionService;
        this._mentionService = _mentionService;
        this._activityLogService = _activityLogService;
        this._employeeNotificationService = _employeeNotificationService;
        this._employeeRecentVisitService = _employeeRecentVisitService;
    }
    /**
     * Creates a task, sanitizing the rich-text `description` HTML through the shared
     * server-side allowlist before persisting (see `sanitizeRichHtml`).
     *
     * @param entity - The task creation input
     * @returns The created task
     */
    async create(entity) {
        const input = entity;
        if (typeof input.description === 'string') {
            input.description = (0, html_sanitizer_1.sanitizeRichHtml)(input.description);
        }
        return await super.create(entity);
    }
    /**
     * Update task, if already exist
     *
     * @param id - The ID of the task to update
     * @param input - The data to update the task with
     * @returns The updated task
     */
    async update(id, input) {
        try {
            // Sanitize the rich-text description HTML before it reaches the persistence path below.
            if (typeof input.description === 'string') {
                input.description = (0, html_sanitizer_1.sanitizeRichHtml)(input.description);
            }
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const userId = context_1.RequestContext.currentUserId();
            const user = context_1.RequestContext.currentUser();
            const { mentionEmployeeIds, ...data } = input;
            // Find task relations
            const relations = {
                tags: true,
                members: true,
                teams: true,
                modules: true,
                parent: true,
                project: true,
                organizationSprint: true,
                taskStatus: true,
                taskSize: true,
                taskPriority: true,
                linkedIssues: true,
                dailyPlans: true
            };
            const task = await this.findOneByIdString(id, { relations });
            const taskMembers = task.members;
            // Separate members into removed and new members
            const memberIdSet = new Set((data.members || []).map(({ id }) => id));
            const existingMemberIdSet = new Set((taskMembers || []).map(({ id }) => id));
            const removedMembers = (taskMembers || []).filter((member) => !memberIdSet.has(member.id));
            const newMembers = (data.members || []).filter((member) => !existingMemberIdSet.has(member.id));
            if (data.projectId && data.projectId !== task.projectId) {
                const { organizationId, projectId } = task;
                // Get the maximum task number for the project
                const maxNumber = await this.getMaxTaskNumberByProject({
                    tenantId,
                    organizationId,
                    projectId
                });
                // Update the task with the new project and task number
                await super.update(id, {
                    projectId,
                    number: maxNumber + 1
                });
            }
            // Update the task with the provided data
            const updatedTask = await super.create({
                ...data,
                id
            });
            // Register Task Sprint moving history
            const { organizationSprintId } = data;
            if (organizationSprintId && organizationSprintId !== task.organizationSprintId) {
                await this.typeOrmOrganizationSprintTaskHistoryRepository.save({
                    fromSprintId: task.organizationSprintId || organizationSprintId, // Use incoming sprint ID if the task's organizationSprintId was previously null or undefined
                    toSprintId: organizationSprintId,
                    taskId: updatedTask.id,
                    movedById: userId,
                    reason: data.taskSprintMoveReason,
                    organizationId: data.organizationId,
                    tenantId
                });
            }
            // Synchronize mentions (only if mentionEmployeeIds is provided)
            if (data.description && mentionEmployeeIds) {
                await this.syncTaskMentions(id, mentionEmployeeIds);
            }
            const { organizationId } = updatedTask;
            // Unsubscribe members who were unassigned from task
            await this.unsubscribeRemovedMembers(removedMembers, updatedTask.id, organizationId, tenantId);
            // Subscribe the new assignees to the task
            await this.subscribeNewMembers(newMembers, task, updatedTask.id, organizationId, tenantId, user);
            // Generate the activity log
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.Task, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, // TODO : Since we have Github Integration, make sure we can also store "System" for actor
            updatedTask.id, updatedTask.title, updatedTask, organizationId, tenantId, task, data);
            // Return the updated Task
            return updatedTask;
        }
        catch (error) {
            console.error(`Error while updating task: ${error.message}`, error.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Synchronizes the task's mention records with the employees mentioned in the update.
     *
     * Best-effort by design: the task itself is already persisted by the time this runs, so a
     * mention-sync failure is logged and swallowed instead of failing the update.
     *
     * @param taskId - The ID of the updated task
     * @param mentionEmployeeIds - The IDs of the employees mentioned in the description
     */
    async syncTaskMentions(taskId, mentionEmployeeIds) {
        try {
            await this._mentionService.updateEntityMentions(contracts_1.BaseEntityEnum.Task, taskId, mentionEmployeeIds);
        }
        catch (error) {
            console.error('Error synchronizing mentions:', error);
        }
    }
    /**
     * Unsubscribes the members who were unassigned from the task.
     *
     * Best-effort by design: failures are logged and swallowed so subscription cleanup can never
     * fail an update that already succeeded.
     *
     * @param members - The members that are no longer assigned to the task
     * @param taskId - The ID of the updated task
     * @param organizationId - The organization of the updated task
     * @param tenantId - The tenant of the updated task
     */
    async unsubscribeRemovedMembers(members, taskId, organizationId, tenantId) {
        if (members.length === 0) {
            return;
        }
        try {
            await Promise.all(members.map(async (member) => await this._entitySubscriptionService.delete({
                entity: contracts_1.BaseEntityEnum.Task,
                entityId: taskId,
                employeeId: member.id,
                type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                organizationId,
                tenantId
            })));
        }
        catch (error) {
            console.error('Error unsubscribing members from the task:', error);
        }
    }
    /**
     * Subscribes the newly assigned members to the task and notifies them of the assignment.
     *
     * Best-effort by design: failures are logged and swallowed so the subscription/notification
     * path can never fail an update that already succeeded.
     *
     * @param members - The members newly assigned to the task
     * @param task - The task as loaded BEFORE the update (source of the notified id and title)
     * @param updatedTaskId - The ID of the updated task (subscription target)
     * @param organizationId - The organization of the updated task
     * @param tenantId - The tenant of the updated task
     * @param user - The user performing the update
     */
    async subscribeNewMembers(members, task, updatedTaskId, organizationId, tenantId, user) {
        if (!members.length) {
            return;
        }
        try {
            await Promise.all(members.map((member) => {
                this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.Task,
                    entityId: updatedTaskId,
                    employeeId: member.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }));
                this._employeeNotificationService.publishNotificationEvent({
                    entity: contracts_1.BaseEntityEnum.Task,
                    entityId: task.id,
                    type: contracts_1.EmployeeNotificationTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId,
                    receiverEmployeeId: member.id,
                    sentByEmployeeId: user?.employeeId
                }, contracts_1.NotificationActionTypeEnum.Assigned, task.title, user?.name);
            }));
        }
        catch (error) {
            console.error('Error publishing CreateSubscriptionEvent:', error);
        }
    }
    /**
     * Retrieves a task by its ID and includes optional related data.
     *
     * @param id The unique identifier of the task.
     * @param params Additional parameters for fetching task details, including related entities.
     * @returns A Promise that resolves to the task entity.
     */
    async findById(id, params) {
        const task = await this.findOneByIdString(id, params);
        // Include the root epic if requested
        if (params.includeRootEpic && task) {
            task.rootEpic = await this.findParentUntilEpic(task.id);
        }
        // Register the last visited at date for the current employee
        try {
            await this._employeeRecentVisitService.emitSaveEmployeeRecentVisitEvent(contracts_1.BaseEntityEnum.Task, task.id, task, task.organizationId, task.tenantId);
        }
        catch (error) {
            console.error('[Task] Error emitting employee recent visit event:', error);
        }
        return task;
    }
    /**
     * Retrieves a paginated list of tasks, with optional advanced filters applied.
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A promise that resolves to a paginated list of tasks.
     * @throws If an error occurs during the retrieval process.
     */
    async findAll(options) {
        try {
            const { filters } = options;
            let advancedFilters = {};
            if (filters) {
                advancedFilters = this.buildAdvancedWhereCondition(filters, options.where);
            }
            return super.findAll({ ...options, where: { ...advancedFilters, ...options.where } });
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Recursively searches for the parent epic of a given task (issue) using a SQL recursive query.
     *
     * @param issueId The ID of the task (issue) to start the search from.
     * @returns A Promise that resolves to the epic task if found, otherwise null.
     */
    async findParentUntilEpic(issueId) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const knex = this.mikroOrmRepository.getKnex();
                const result = await knex.raw((0, database_helper_1.prepareSQLQuery)(`
					WITH RECURSIVE IssueHierarchy AS (
						SELECT *
						FROM task
						WHERE id = ?
					UNION ALL
						SELECT i.*
						FROM task i
						INNER JOIN IssueHierarchy ih ON i.id = ih."parentId"
					)
					SELECT *
					FROM IssueHierarchy
					WHERE "issueType" = 'Epic'
					LIMIT 1;
				`), [issueId]);
                const items = result.rows || result;
                return items.length > 0 ? items[0] : null;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // TypeORM's `query()` hands the parameters straight to the driver, so the placeholder
                // syntax is dialect-specific: PostgreSQL uses `$1`, while SQLite/better-sqlite3 and
                // MySQL use `?`. `$1` on better-sqlite3 is parsed as a *named* parameter, so binding
                // a positional array throws "RangeError: Too many parameter values were provided"
                // and every `GET /tasks/:id?includeRootEpic=true` fails on SQLite (demo) instances.
                const idPlaceholder = (0, config_1.isPostgres)() ? '$1' : '?';
                // Define the recursive SQL query to find the parent epic
                const query = (0, database_helper_1.prepareSQLQuery)(`
					WITH RECURSIVE IssueHierarchy AS (
						SELECT *
						FROM task
						WHERE id = ${idPlaceholder}
					UNION ALL
						SELECT i.*
						FROM task i
						INNER JOIN IssueHierarchy ih ON i.id = ih."parentId"
					)
					SELECT *
					FROM IssueHierarchy
					WHERE "issueType" = 'Epic'
					LIMIT 1;
				`);
                // Execute the raw SQL query with the issueId parameter
                const result = await this.typeOrmRepository.query(query, [issueId]);
                // Return the first epic task found or null if no epic is found
                return result.length > 0 ? result[0] : null;
            }
        }
    }
    /**
     * GET my tasks
     *
     * @param options
     * @returns
     */
    async getMyTasks(options) {
        return await this.getEmployeeTasks(options);
    }
    /**
     * Find employee tasks
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    async getEmployeeTasks(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, filters } = options;
                    const { status, title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null } = where;
                    const { organizationId, projectId, members } = where;
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const mikroWhere = { tenantId, organizationId, isScreeningTask };
                    if ((0, utils_1.isNotEmpty)(projectId))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(status))
                        mikroWhere.status = status;
                    if ((0, utils_1.isNotEmpty)(isDraft))
                        mikroWhere.isDraft = isDraft;
                    if ((0, utils_1.isNotEmpty)(title))
                        mikroWhere.title = { $ilike: `%${title}%` };
                    if ((0, utils_1.isNotEmpty)(prefix))
                        mikroWhere.prefix = { $ilike: `%${prefix}%` };
                    if ((0, utils_1.isNotEmpty)(organizationSprintId) && !(0, class_validator_1.isUUID)(organizationSprintId)) {
                        mikroWhere.organizationSprintId = null;
                    }
                    const employeeId = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)
                        ? (0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])
                            ? members['id']
                            : null
                        : context_1.RequestContext.currentEmployeeId();
                    if ((0, utils_1.isNotEmpty)(employeeId)) {
                        mikroWhere.$or = [{ members: { id: employeeId } }, { teams: { members: { employeeId } } }];
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(options.relations ? { populate: Object.keys(options.relations) } : {}),
                        ...('skip' in options
                            ? {
                                offset: (options.take || 10) * (options.skip - 1),
                                limit: options.take || 10
                            }
                            : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const { where, filters } = options;
                    const { status, title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null } = where;
                    const { organizationId, projectId, members } = where;
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.innerJoin(`${query.alias}.members`, 'members');
                    /**
                     * If find options
                     */
                    if ((0, utils_1.isNotEmpty)(options)) {
                        if ('skip' in options) {
                            query.setFindOptions({
                                skip: (options.take || 10) * (options.skip - 1),
                                take: options.take || 10
                            });
                        }
                        query.setFindOptions({
                            ...(options.relations ? { relations: (0, utils_2.parseFindOptionsRelations)(options.relations) } : {})
                        });
                    }
                    // Apply advanced filters
                    if (filters) {
                        const advancedWhere = this.buildAdvancedWhereCondition(filters, where);
                        query.setFindOptions({ where: advancedWhere });
                    }
                    query.andWhere((qb) => {
                        const subQuery = qb.subQuery();
                        subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_employee"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_employee'), (0, database_helper_1.prepareSQLQuery)('task_employee'));
                        // If user have permission to change employee
                        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                            if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                                const employeeId = members['id'];
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_employee"."employeeId" = :employeeId'), { employeeId });
                            }
                        }
                        else {
                            // If employee has login and don't have permission to change employee
                            const employeeId = context_1.RequestContext.currentEmployeeId();
                            if ((0, utils_1.isNotEmpty)(employeeId)) {
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_employee"."employeeId" = :employeeId'), { employeeId });
                            }
                        }
                        return (0, database_helper_1.prepareSQLQuery)('"task_members"."taskId" IN ') + subQuery.distinct(true).getQuery();
                    });
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        const tenantId = context_1.RequestContext.currentTenantId();
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(projectId)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                        }
                        if ((0, utils_1.isNotEmpty)(status)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."status" = :status`), {
                                status
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(isDraft)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isDraft" = :isDraft`), {
                                isDraft
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(title)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title" ${util_1.LIKE_OPERATOR} :title`), {
                                title: `%${title}%`
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(prefix)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."prefix" ${util_1.LIKE_OPERATOR} :prefix`), {
                                prefix: `%${prefix}%`
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(organizationSprintId) && !(0, class_validator_1.isUUID)(organizationSprintId)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationSprintId" IS NULL`));
                        }
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isScreeningTask" = :isScreeningTask`), {
                            isScreeningTask
                        });
                    }));
                    console.log('query.getSql', query.getSql());
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET all tasks by employee
     *
     * @param employeeId - The employee ID for whom retrieve tasks
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    async getAllTasksByEmployee(employeeId, options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { isScreeningTask = false } = options.where;
                    const tenantId = context_1.RequestContext.currentTenantId();
                    // MikroORM: Use members relation filter (simplified vs TypeORM subquery approach)
                    const mikroWhere = {
                        tenantId,
                        isScreeningTask,
                        $or: [{ members: { id: employeeId } }, { teams: { members: { employeeId } } }]
                    };
                    if ((0, utils_1.isNotEmpty)(options.where)) {
                        Object.assign(mikroWhere, options.where);
                    }
                    const items = await this.mikroOrmRepository.find(mikroWhere, {
                        ...(options.relations ? { populate: Object.keys(options.relations) } : {})
                    });
                    return items.map((e) => this.serialize(e));
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.leftJoin(`${query.alias}.members`, 'members');
                    query.leftJoin(`${query.alias}.teams`, 'teams');
                    const { isScreeningTask = false } = options.where;
                    const { filters } = options;
                    // Apply advanced filters
                    if (filters) {
                        const advancedWhere = this.buildAdvancedWhereCondition(filters, options.where);
                        query.setFindOptions({ where: advancedWhere });
                    }
                    /**
                     * If additional options found
                     */
                    query.setFindOptions({
                        ...((0, utils_1.isNotEmpty)(options) &&
                            (0, utils_1.isNotEmpty)(options.where) && {
                            where: options.where
                        }),
                        ...((0, utils_1.isNotEmpty)(options) &&
                            (0, utils_1.isNotEmpty)(options.relations) && {
                            relations: (0, utils_2.parseFindOptionsRelations)(options.relations)
                        })
                    });
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        const tenantId = context_1.RequestContext.currentTenantId();
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), {
                            tenantId
                        });
                    }));
                    query.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery
                                .select((0, database_helper_1.prepareSQLQuery)('"task_employee"."taskId"'))
                                .from((0, database_helper_1.prepareSQLQuery)('task_employee'), (0, database_helper_1.prepareSQLQuery)('task_employee'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_employee"."employeeId" = :employeeId'), { employeeId });
                            return (0, database_helper_1.prepareSQLQuery)(`"task_members"."taskId" IN (${subQuery.distinct(true).getQuery()})`);
                        });
                        web.orWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_team"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_team'), (0, database_helper_1.prepareSQLQuery)('task_team'));
                            subQuery.leftJoin('organization_team_employee', 'organization_team_employee', (0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."organizationTeamId" = "task_team"."organizationTeamId"'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."employeeId" = :employeeId'), {
                                employeeId
                            });
                            return (0, database_helper_1.prepareSQLQuery)(`"task_teams"."taskId" IN (${subQuery.distinct(true).getQuery()})`);
                        });
                    }));
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isScreeningTask" = :isScreeningTask`), {
                        isScreeningTask
                    });
                    return await query.getMany();
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET team tasks
     *
     * @param options - Pagination options including limit, page, and sorting.
     * @param filters - Optional filters for advanced task filtering.
     * @returns
     */
    async findTeamTasks(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, filters } = options;
                    const { status, teams = [], title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null } = where;
                    const { organizationId, projectId, members } = where;
                    const tenantId = context_1.RequestContext.currentTenantId();
                    const mikroWhere = { tenantId, organizationId, isScreeningTask };
                    if ((0, utils_1.isNotEmpty)(projectId))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(status))
                        mikroWhere.status = status;
                    if ((0, utils_1.isNotEmpty)(isDraft))
                        mikroWhere.isDraft = isDraft;
                    if ((0, utils_1.isNotEmpty)(title))
                        mikroWhere.title = { $ilike: `%${title}%` };
                    if ((0, utils_1.isNotEmpty)(prefix))
                        mikroWhere.prefix = { $ilike: `%${prefix}%` };
                    if ((0, utils_1.isNotEmpty)(organizationSprintId) && !(0, class_validator_1.isUUID)(organizationSprintId)) {
                        mikroWhere.organizationSprintId = null;
                    }
                    if ((0, utils_1.isNotEmpty)(teams)) {
                        mikroWhere.teams = { id: { $in: teams } };
                    }
                    if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                        mikroWhere.teams = { ...mikroWhere.teams, members: { employeeId: members['id'] } };
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(options.relations ? { populate: Object.keys(options.relations) } : {}),
                        ...(options.order ? { orderBy: options.order } : {}),
                        ...('skip' in options
                            ? {
                                offset: (options.take || 10) * (options.skip - 1),
                                limit: options.take || 10
                            }
                            : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const { where, filters } = options;
                    const { status, teams = [], title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null } = where;
                    const { organizationId, projectId, members } = where;
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.leftJoin(`${query.alias}.teams`, 'teams');
                    /**
                     * If find options
                     */
                    if ((0, utils_1.isNotEmpty)(options)) {
                        if ('skip' in options) {
                            query.setFindOptions({
                                skip: (options.take || 10) * (options.skip - 1),
                                take: options.take || 10
                            });
                        }
                        query.setFindOptions({
                            ...(options.select ? { select: (0, utils_2.parseFindOptionsSelect)(options.select) } : {}),
                            ...(options.relations ? { relations: (0, utils_2.parseFindOptionsRelations)(options.relations) } : {}),
                            ...(options.order ? { order: options.order } : {})
                        });
                    }
                    // Apply advanced filters
                    if (filters) {
                        const advancedWhere = this.buildAdvancedWhereCondition(filters, options.where);
                        query.setFindOptions({ where: advancedWhere });
                    }
                    query.andWhere((qb) => {
                        const subQuery = qb.subQuery();
                        subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_team"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_team'), (0, database_helper_1.prepareSQLQuery)('task_team'));
                        subQuery.leftJoin('organization_team_employee', 'organization_team_employee', (0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."organizationTeamId" = "task_team"."organizationTeamId"'));
                        // If user have permission to change employee
                        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                            if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                                const employeeId = members['id'];
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."employeeId" = :employeeId'), {
                                    employeeId
                                });
                            }
                        }
                        else {
                            // If employee has login and don't have permission to change employee
                            const employeeId = context_1.RequestContext.currentEmployeeId();
                            if ((0, utils_1.isNotEmpty)(employeeId)) {
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."employeeId" = :employeeId'), {
                                    employeeId
                                });
                            }
                        }
                        if ((0, utils_1.isNotEmpty)(teams)) {
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."organizationTeamId" IN (:...teams)`), {
                                teams
                            });
                        }
                        return (0, database_helper_1.prepareSQLQuery)(`"task_teams"."taskId" IN `) + subQuery.distinct(true).getQuery();
                    });
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        const tenantId = context_1.RequestContext.currentTenantId();
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isNotEmpty)(teams)) {
                        query.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                    }
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isEmpty)(teams)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                        }
                        if ((0, utils_1.isNotEmpty)(status)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."status" = :status`), {
                                status
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(isDraft)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isDraft" = :isDraft`), {
                                isDraft
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(title)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title" ${util_1.LIKE_OPERATOR} :title`), {
                                title: `%${title}%`
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(prefix)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."prefix" ${util_1.LIKE_OPERATOR} :prefix`), {
                                prefix: `%${prefix}%`
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(organizationSprintId) && !(0, class_validator_1.isUUID)(organizationSprintId)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationSprintId" IS NULL`));
                        }
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isScreeningTask" = :isScreeningTask`), {
                            isScreeningTask
                        });
                    }));
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * GET tasks by pagination with filtering options.
     *
     * @param options The pagination and filtering parameters.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A Promise that resolves to a paginated list of tasks.
     */
    async pagination(options) {
        const filters = options?.filters;
        const where = options?.where;
        // Check if there are any filters in the options
        if (where) {
            const { isScreeningTask = false } = where;
            // Apply filters for task title with like operator
            if (where.title) {
                options.where.title = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :title`, { title: `%${where.title}%` });
            }
            // Apply filters for task prefix with like operator
            if (where.prefix) {
                options.where.prefix = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :prefix`, {
                    prefix: `%${where.prefix}%`
                });
            }
            // Apply filters for isDraft, setting null if not a boolean
            if (where.isDraft !== undefined && !(0, class_validator_1.isBoolean)(where.isDraft)) {
                options.where.isDraft = (0, typeorm_1.IsNull)();
            }
            // Apply filters for organizationSprintId, setting null if not a valid UUID
            if (where.organizationSprintId && !(0, class_validator_1.isUUID)(where.organizationSprintId)) {
                options.where.organizationSprintId = (0, typeorm_1.IsNull)();
            }
            // Apply filters for teams, ensuring it uses In for array comparison
            if (where.teams) {
                options.where.teams = {
                    id: (0, typeorm_1.In)(where.teams)
                };
            }
            // Apply filter for isScreeningTask
            where.isScreeningTask = isScreeningTask;
        }
        // Apply Advanced filters
        let advancedFilters = {};
        if (filters) {
            advancedFilters = this.buildAdvancedWhereCondition(filters, where);
        }
        // Call the base paginate method
        return await super.paginate({ ...options, where: { ...advancedFilters, ...where } });
    }
    /**
     * GET maximum task number by project filter
     *
     * @param options The filtering options including tenant, organization, and project details.
     * @returns A Promise that resolves to the maximum task number for the given project.
     */
    async getMaxTaskNumberByProject(options) {
        try {
            // Extract tenantId from context or options
            const tenantId = context_1.RequestContext.currentTenantId() || options.tenantId;
            const { organizationId, projectId } = options;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = { tenantId, organizationId };
                    if ((0, utils_1.isNotEmpty)(projectId)) {
                        mikroWhere.projectId = projectId;
                    }
                    else {
                        mikroWhere.projectId = null;
                    }
                    const items = await this.mikroOrmRepository.find(mikroWhere, {
                        orderBy: { number: 'DESC' },
                        limit: 1,
                        fields: ['number']
                    });
                    const maxTaskNumber = items.length > 0 ? items[0].number || 0 : 0;
                    console.log('get max task number (MikroORM)', maxTaskNumber);
                    return maxTaskNumber;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create a query builder for the Task entity
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Build the query to get the maximum task number
                    query.select((0, database_helper_1.prepareSQLQuery)(`COALESCE(MAX("${query.alias}"."number"), 0)`), 'maxTaskNumber');
                    // Apply filters for organization and tenant
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    // Apply project filter if provided, otherwise check for null
                    if ((0, utils_1.isNotEmpty)(projectId)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                    }
                    else {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" IS NULL`));
                    }
                    // Execute the query and parse the result to a number
                    const result = await query.getRawOne();
                    const maxTaskNumber = parseInt(result.maxTaskNumber, 10);
                    console.log('get max task number', maxTaskNumber);
                    return maxTaskNumber;
                }
            }
        }
        catch (error) {
            // Log the error and throw a detailed exception
            console.log(`Error fetching max task number: ${error.message}`, error.stack);
            throw new common_1.HttpException({ message: 'Failed to get the max task number', error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Unassign employee from team task
     * @param employeeId
     * @param organizationTeamId
     */
    async unassignEmployeeFromTeamTasks(employeeId, organizationTeamId) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    // MikroORM: Use simplified relation-based filtering
                    const mikroWhere = {
                        tenantId,
                        $or: [{ members: { id: employeeId } }, { teams: { members: { employeeId } } }]
                    };
                    if (organizationTeamId) {
                        mikroWhere.teams = { id: organizationTeamId };
                    }
                    const tasks = await this.mikroOrmRepository.find(mikroWhere, {
                        populate: ['teams', 'members']
                    });
                    const serializedTasks = tasks.map((e) => this.serialize(e));
                    serializedTasks.forEach((task) => {
                        if (task.teams?.length) {
                            task.members = task.members.filter((member) => member.id !== employeeId);
                        }
                    });
                    await this.saveMany(serializedTasks);
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Use unique alias to avoid conflict with 'teams' used later
                    if (organizationTeamId) {
                        query.leftJoinAndSelect(`${query.alias}.teams`, 'teamFilter', 'teamFilter.id = :organizationTeamId', {
                            organizationTeamId
                        });
                    }
                    else {
                        query.leftJoinAndSelect(`${query.alias}.teams`, 'teamFilter');
                    }
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    query.andWhere(new typeorm_1.Brackets((web) => {
                        web.andWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery
                                .select((0, database_helper_1.prepareSQLQuery)('"task_employee"."taskId"'))
                                .from((0, database_helper_1.prepareSQLQuery)('task_employee'), (0, database_helper_1.prepareSQLQuery)('task_employee'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_employee"."employeeId" = :employeeId'), { employeeId });
                            return (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (${subQuery.distinct(true).getQuery()})`);
                        });
                        web.orWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_team"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_team'), (0, database_helper_1.prepareSQLQuery)('task_team'));
                            subQuery.leftJoin('organization_team_employee', 'organization_team_employee', (0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."organizationTeamId" = "task_team"."organizationTeamId" AND "organization_team_employee"."deletedAt" IS NULL'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."employeeId" = :employeeId'), {
                                employeeId
                            });
                            return (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (${subQuery.distinct(true).getQuery()})`);
                        });
                    }));
                    // If unassigned for specific team
                    if (organizationTeamId) {
                        query.andWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_team"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_team'), (0, database_helper_1.prepareSQLQuery)('task_team'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_team"."organizationTeamId" = :organizationTeamId'), {
                                organizationTeamId
                            });
                            return (0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."id" IN (${subQuery.distinct(true).getQuery()})`);
                        });
                    }
                    // Find all assigned tasks of employee with relations
                    // Use different aliases to avoid conflicts
                    const tasks = await query
                        .leftJoinAndSelect(`${query.alias}.members`, 'taskMembers')
                        .leftJoinAndSelect(`${query.alias}.teams`, 'taskTeams')
                        .getMany();
                    // Unassign member from All the Team Tasks
                    tasks.forEach((task) => {
                        if (task.teams?.length) {
                            task.members = task.members.filter((member) => member.id !== employeeId);
                        }
                    });
                    // TODO : Unsubscribe employee from task
                    // Save updated entities to DB
                    await this.saveMany(tasks);
                    break;
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Retrieves module tasks based on the provided options.
     *
     * @param options - The pagination options and filters for querying tasks.
     * @param filters - Optional filters for advanced task filtering.
     * @returns A promise that resolves with pagination task items and total count.
     */
    async findModuleTasks(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const { where, filters } = options;
                    const { status, modules = [], title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null, organizationId, projectId } = where;
                    const tenantId = context_1.RequestContext.currentTenantId() ?? where.tenantId;
                    const mikroWhere = { tenantId, organizationId, isScreeningTask };
                    if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isEmpty)(modules))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(status))
                        mikroWhere.status = status;
                    if ((0, utils_1.isNotEmpty)(isDraft))
                        mikroWhere.isDraft = isDraft;
                    if ((0, utils_1.isNotEmpty)(title))
                        mikroWhere.title = { $ilike: `%${title}%` };
                    if ((0, utils_1.isNotEmpty)(prefix))
                        mikroWhere.prefix = { $ilike: `%${prefix}%` };
                    if ((0, class_validator_1.isUUID)(organizationSprintId)) {
                        mikroWhere.organizationSprintId = organizationSprintId;
                    }
                    if ((0, utils_1.isNotEmpty)(modules)) {
                        mikroWhere.modules = { id: { $in: modules } };
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(options.relations ? { populate: Object.keys(options.relations) } : {}),
                        ...(options.order ? { orderBy: options.order } : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const { where, filters } = options;
                    const { status, modules = [], title, prefix, isDraft, isScreeningTask = false, organizationSprintId = null, organizationId, projectId, members } = where;
                    const tenantId = context_1.RequestContext.currentTenantId() ?? where.tenantId;
                    // Initialize the query
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.leftJoin(`${query.alias}.modules`, 'modules');
                    // Apply find options if provided
                    if ((0, utils_1.isNotEmpty)(options)) {
                        query.setFindOptions({
                            ...(options.select && { select: (0, utils_2.parseFindOptionsSelect)(options.select) }),
                            ...(options.relations && { relations: (0, utils_2.parseFindOptionsRelations)(options.relations) }),
                            ...(options.order && { order: options.order })
                        });
                    }
                    // Apply advanced filters
                    if (filters) {
                        const advancedWhere = this.buildAdvancedWhereCondition(filters, where);
                        query.setFindOptions({ where: advancedWhere });
                    }
                    // Filter by project_module_task with a sub query
                    query.andWhere((qb) => {
                        const subQuery = qb
                            .subQuery()
                            .select((0, database_helper_1.prepareSQLQuery)('"pmt"."taskId"')) // Use the alias 'pmt' here
                            .from((0, database_helper_1.prepareSQLQuery)('project_module_task'), 'pmt') // Assign alias 'pmt' to project_module_task
                            .leftJoin('project_module_employee', 'pme', (0, database_helper_1.prepareSQLQuery)('"pme"."organizationProjectModuleId" = "pmt"."organizationProjectModuleId"'));
                        // Retrieve the employee ID based on the permission
                        const employeeId = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)
                            ? members?.['id']
                            : context_1.RequestContext.currentEmployeeId();
                        if ((0, utils_1.isNotEmpty)(employeeId)) {
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"pme"."employeeId" = :employeeId'), { employeeId });
                        }
                        if ((0, utils_1.isNotEmpty)(modules)) {
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"pmt"."organizationProjectModuleId" IN (:...modules)`), { modules });
                        }
                        return (0, database_helper_1.prepareSQLQuery)(`"task_modules"."taskId" IN `) + subQuery.distinct(true).getQuery();
                    });
                    // Add organization and tenant filters
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    // Filter by projectId and modules
                    if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isEmpty)(modules)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                    }
                    // Add additional filters (status, draft, title, etc.)
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(status)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."status" = :status`), { status });
                        }
                        if ((0, utils_1.isNotEmpty)(isDraft)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isDraft" = :isDraft`), { isDraft });
                        }
                        if ((0, utils_1.isNotEmpty)(title)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."title" ${util_1.LIKE_OPERATOR} :title`), {
                                title: `%${title}%`
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(prefix)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."prefix" ${util_1.LIKE_OPERATOR} :prefix`), {
                                prefix: `%${prefix}%`
                            });
                        }
                        if ((0, class_validator_1.isUUID)(organizationSprintId)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationSprintId" = :organizationSprintId`), {
                                organizationSprintId
                            });
                        }
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isScreeningTask" = :isScreeningTask`), {
                            isScreeningTask
                        });
                    }));
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.log('Error while retrieving module tasks', error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * @description Get tasks by views query
     * @param {ID} viewId - View ID
     * @returns {Promise<IPagination<ITask>>} A Promise resolved to paginated found tasks and total matching query filters
     * @memberof TaskService
     */
    async findTasksByViewQuery(viewId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        try {
            // Retrieve Task View by ID for getting their pre-defined query params
            const taskView = await this._taskViewService.findOneByWhereOptions({ id: viewId, tenantId });
            if (!taskView) {
                throw new common_1.HttpException('View not found', common_1.HttpStatus.NOT_FOUND);
            }
            // Extract `queryParams` from the view
            const queryParams = taskView.queryParams;
            let viewFilters = {};
            try {
                viewFilters = (0, config_1.isSqlite)()
                    ? JSON.parse(queryParams)
                    : queryParams || {};
            }
            catch (error) {
                throw new common_1.HttpException('Invalid query parameters in task view', common_1.HttpStatus.BAD_REQUEST);
            }
            // Extract filters
            const { statuses = [], priorities = [], sizes = [], types = [], startDates = [], dueDates = [], organizationId, relations = [] } = viewFilters;
            // Calculate min and max dates only if arrays are not empty
            const getMinMaxDates = (dates) => dates.length
                ? [
                    new Date(Math.min(...dates
                        .filter((date) => !Number.isNaN(new Date(date).getTime()))
                        .map((date) => new Date(date).getTime()))),
                    new Date(Math.max(...dates
                        .filter((date) => !Number.isNaN(new Date(date).getTime()))
                        .map((date) => new Date(date).getTime())))
                ]
                : [undefined, undefined];
            const [minStartDate, maxStartDate] = getMinMaxDates(startDates);
            const [minDueDate, maxDueDate] = getMinMaxDates(dueDates);
            // Build the 'where' condition
            const mainWhereCondition = this.buildAdvancedWhereCondition(viewFilters);
            const where = {
                ...mainWhereCondition,
                ...(statuses.length && { status: (0, typeorm_1.In)(statuses) }),
                ...(priorities.length && { priority: (0, typeorm_1.In)(priorities) }),
                ...(sizes.length && { size: (0, typeorm_1.In)(sizes) }),
                ...(types.length && { issueType: (0, typeorm_1.In)(types) }),
                ...(minStartDate && maxStartDate && { startDate: (0, typeorm_1.Between)(minStartDate, maxStartDate) }),
                ...(minDueDate && maxDueDate && { dueDate: (0, typeorm_1.Between)(minDueDate, maxDueDate) }),
                // Only scope by organization when one is known: the view's organizationId is a nullable
                // column and the stored query params may carry null (a null used to be dropped silently).
                ...(taskView.organizationId || organizationId
                    ? { organizationId: taskView.organizationId || organizationId }
                    : {}),
                tenantId
            };
            // Define find options
            const findOptions = { where, ...(relations && { relations: (0, utils_2.parseFindOptionsRelations)(relations) }) };
            // Retrieve tasks using base class method
            return await super.findAll(findOptions);
        }
        catch (error) {
            console.error(`Error while retrieve view tasks: ${error.message}`, error.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Retrieves tasks based on the provided date filters for startDate and dueDate.
     *
     * @function getTasksByDateFilters
     * @param {ITaskDateFilterInput} params - The query params containing the date filters for the tasks.
     *
     * @returns {Promise<IPagination<ITask>>} A promise that resolves to an paginated tasks filtered by the provided dates.
     *
     * @throws {Error} Will throw an error if there is a problem with the database query.
     */
    async getTasksByDateFilters(params) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(params);
        const tenantId = context_1.RequestContext.currentTenantId() || params.tenantId;
        try {
            const { startDateFrom, startDateTo, dueDateFrom, dueDateTo, createdByUserId, isScreeningTask = false, organizationId, employeeId, projectId, organizationTeamId, organizationSprintId, relations } = params;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = { tenantId, organizationId, isScreeningTask };
                    // Date range filters
                    if ((0, utils_1.isNotEmpty)(startDateFrom) && (0, utils_1.isNotEmpty)(startDateTo)) {
                        mikroWhere.startDate = { $gte: startDateFrom, $lte: startDateTo };
                    }
                    else if ((0, utils_1.isNotEmpty)(startDateFrom)) {
                        mikroWhere.startDate = { $gte: startDateFrom };
                    }
                    else if ((0, utils_1.isNotEmpty)(startDateTo)) {
                        mikroWhere.startDate = { $lte: startDateTo };
                    }
                    if ((0, utils_1.isNotEmpty)(dueDateFrom) && (0, utils_1.isNotEmpty)(dueDateTo)) {
                        mikroWhere.dueDate = { $gte: dueDateFrom, $lte: dueDateTo };
                    }
                    else if ((0, utils_1.isNotEmpty)(dueDateFrom)) {
                        mikroWhere.dueDate = { $gte: dueDateFrom };
                    }
                    else if ((0, utils_1.isNotEmpty)(dueDateTo)) {
                        mikroWhere.dueDate = { $lte: dueDateTo };
                    }
                    if ((0, utils_1.isNotEmpty)(createdByUserId))
                        mikroWhere.createdByUserId = createdByUserId;
                    if ((0, utils_1.isNotEmpty)(employeeId))
                        mikroWhere.members = { id: employeeId };
                    if ((0, utils_1.isNotEmpty)(organizationTeamId))
                        mikroWhere.teams = { id: organizationTeamId };
                    if ((0, utils_1.isNotEmpty)(projectId))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(organizationSprintId))
                        mikroWhere.organizationSprintId = organizationSprintId;
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(relations ? { populate: Object.keys(relations) } : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    let query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.andWhere(new typeorm_1.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    }));
                    // Apply the filters on startDate and dueDate
                    query = (0, util_1.addBetween)(query, 'startDate', startDateFrom, startDateTo, database_helper_1.prepareSQLQuery);
                    query = (0, util_1.addBetween)(query, 'dueDate', dueDateFrom, dueDateTo, database_helper_1.prepareSQLQuery);
                    // Add Optional additional filters by
                    query.andWhere(new typeorm_1.Brackets((web) => {
                        if ((0, utils_1.isNotEmpty)(createdByUserId)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."createdByUserId" = :createdByUserId`), {
                                createdByUserId
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(employeeId)) {
                            query.leftJoin(`${query.alias}.members`, 'members');
                            web.andWhere((qb) => {
                                const subQuery = qb.subQuery();
                                subQuery
                                    .select((0, database_helper_1.prepareSQLQuery)('"task_employee"."taskId"'))
                                    .from((0, database_helper_1.prepareSQLQuery)('task_employee'), (0, database_helper_1.prepareSQLQuery)('task_employee'));
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_employee"."employeeId" = :employeeId'), { employeeId });
                                return (0, database_helper_1.prepareSQLQuery)(`"task_members"."taskId" IN (${subQuery.distinct(true).getQuery()})`);
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                            query.leftJoin(`${query.alias}.teams`, 'teams');
                            web.andWhere((qb) => {
                                const subQuery = qb.subQuery();
                                subQuery.select((0, database_helper_1.prepareSQLQuery)('"task_team"."taskId"')).from((0, database_helper_1.prepareSQLQuery)('task_team'), (0, database_helper_1.prepareSQLQuery)('task_team'));
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"task_team"."organizationTeamId" = :organizationTeamId'), {
                                    organizationTeamId
                                });
                                return (0, database_helper_1.prepareSQLQuery)(`"task_teams"."taskId" IN (${subQuery.distinct(true).getQuery()})`);
                            });
                        }
                        if ((0, utils_1.isNotEmpty)(projectId)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                        }
                        if ((0, utils_1.isNotEmpty)(organizationSprintId)) {
                            web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationSprintId" = :organizationSprintId`), {
                                organizationSprintId
                            });
                        }
                        web.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."isScreeningTask" = :isScreeningTask`), {
                            isScreeningTask
                        });
                    }));
                    // Check if relations were provided and include them
                    query.setFindOptions({
                        ...(relations ? { relations: (0, utils_2.parseFindOptionsRelations)(relations) } : {})
                    });
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Constructs advanced `where` conditions for filtering tasks based on the provided filters and existing conditions.
     *
     * @private
     * @param {ITaskAdvancedFilter | IGetTasksByViewFilters} [filters] - Advanced filtering criteria for tasks, including projects, teams, sprints, and more.
     * @param {FindOptionsWhere<Task>} [where] - Existing `where` conditions to be merged with the filters.
     * @returns {FindOptionsWhere<Task>} A `where` condition object to be used in database queries.
     */
    buildAdvancedWhereCondition(filters, where = {}) {
        // Destructuring filter params
        const { ids = [], projects = [], teams = [], modules = [], sprints = [], members = [], tags = [], statusIds = [], priorityIds = [], sizeIds = [], parentIds = [], createdByUserIds = [], dailyPlans = [] } = filters;
        // Build the 'where' condition
        return {
            ...(ids.length && !where.id ? { id: (0, typeorm_1.In)(ids) } : {}),
            ...(projects.length && !where.projectId ? { projectId: (0, typeorm_1.In)(projects) } : {}),
            ...(teams.length && !where.teams ? { teams: { id: (0, typeorm_1.In)(teams) } } : {}),
            ...(modules.length && !where.modules ? { modules: { id: (0, typeorm_1.In)(modules) } } : {}),
            ...(sprints.length && !where.organizationSprintId ? { organizationSprintId: (0, typeorm_1.In)(sprints) } : {}),
            ...(members.length && !where.members ? { members: { id: (0, typeorm_1.In)(members) } } : {}),
            ...(tags.length && !where.tags ? { tags: { id: (0, typeorm_1.In)(tags) } } : {}),
            ...(statusIds.length && !where.taskStatusId ? { taskStatusId: (0, typeorm_1.In)(statusIds) } : {}),
            ...(priorityIds.length && !where.taskPriorityId ? { taskPriorityId: (0, typeorm_1.In)(priorityIds) } : {}),
            ...(sizeIds.length && !where.taskSizeId ? { taskSizeId: (0, typeorm_1.In)(sizeIds) } : {}),
            ...(parentIds.length && !where.parentId ? { parentId: (0, typeorm_1.In)(parentIds) } : {}),
            ...(createdByUserIds.length && !where.createdByUserId ? { createdByUserId: (0, typeorm_1.In)(createdByUserIds) } : {}),
            ...(dailyPlans.length && !where.dailyPlans ? { dailyPlans: { id: (0, typeorm_1.In)(dailyPlans) } } : {})
        };
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.Task),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_task_repository_1.TypeOrmTaskRepository,
        mikro_orm_task_repository_1.MikroOrmTaskRepository,
        type_orm_organization_sprint_task_history_repository_1.TypeOrmOrganizationSprintTaskHistoryRepository,
        cqrs_1.EventBus,
        view_service_1.TaskViewService,
        entity_subscription_service_1.EntitySubscriptionService,
        mention_service_1.MentionService,
        activity_log_service_1.ActivityLogService,
        employee_notification_service_1.EmployeeNotificationService,
        employee_recent_visit_service_1.EmployeeRecentVisitService])
], TaskService);
//# sourceMappingURL=task.service.js.map