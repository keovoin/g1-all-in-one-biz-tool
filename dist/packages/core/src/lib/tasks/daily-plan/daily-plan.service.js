"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlanService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const database_helper_1 = require("../../database/database.helper");
const crud_1 = require("../../core/crud");
const request_context_1 = require("../../core/context/request-context");
const utils_2 = require("../../core/utils");
const employee_service_1 = require("../../employee/employee.service");
const managed_employee_service_1 = require("../../employee/managed-employee.service");
const task_service_1 = require("../task.service");
const daily_plan_entity_1 = require("./daily-plan.entity");
const mikro_orm_daily_plan_repository_1 = require("./repository/mikro-orm-daily-plan.repository");
const type_orm_daily_plan_repository_1 = require("./repository/type-orm-daily-plan.repository");
let DailyPlanService = class DailyPlanService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmDailyPlanRepository, mikroOrmDailyPlanRepository, _employeeService, _taskService, _managedEmployeeService) {
        super(typeOrmDailyPlanRepository, mikroOrmDailyPlanRepository);
        this.typeOrmDailyPlanRepository = typeOrmDailyPlanRepository;
        this.mikroOrmDailyPlanRepository = mikroOrmDailyPlanRepository;
        this._employeeService = _employeeService;
        this._taskService = _taskService;
        this._managedEmployeeService = _managedEmployeeService;
    }
    /**
     * Create or update a DailyPlan. If the given day already has a DailyPlan,
     * update it with the provided task. Otherwise, create a new DailyPlan.
     *
     * @param partialEntity - Data to create or update the DailyPlan
     * @returns The created or updated DailyPlan
     */
    async createDailyPlan(partialEntity) {
        try {
            const { employeeId, organizationId, organizationTeamId, taskId } = partialEntity;
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? partialEntity.tenantId;
            const dailyPlanDate = new Date(partialEntity.date).toISOString().split('T')[0];
            // Validate employee existence
            const employee = await this._employeeService.findOneByIdString(employeeId);
            if (!employee) {
                throw new common_1.NotFoundException('Employee not found');
            }
            // Check for existing DailyPlan
            let dailyPlan;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const item = await this.mikroOrmDailyPlanRepository.findOne({
                        tenantId,
                        organizationId,
                        organizationTeamId,
                        employeeId,
                        date: new Date(dailyPlanDate)
                    }, {
                        populate: ['tasks']
                    });
                    dailyPlan = item ? this.serialize(item) : null;
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmDailyPlanRepository.createQueryBuilder('dailyPlan');
                    query.setFindOptions({ relations: { tasks: true } });
                    query.where('"dailyPlan"."tenantId" = :tenantId', { tenantId });
                    query.andWhere('"dailyPlan"."organizationId" = :organizationId', { organizationId });
                    query.andWhere('"dailyPlan"."organizationTeamId" = :organizationTeamId', { organizationTeamId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`DATE("dailyPlan"."date") = :dailyPlanDate`), {
                        dailyPlanDate: `${dailyPlanDate}`
                    });
                    query.andWhere('"dailyPlan"."employeeId" = :employeeId', { employeeId });
                    dailyPlan = await query.getOne();
                    break;
                }
            }
            // Create or update DailyPlan
            if (!dailyPlan) {
                dailyPlan = new daily_plan_entity_1.DailyPlan({
                    ...partialEntity,
                    employeeId: employee.id,
                    employee: { id: employee.id },
                    tasks: []
                });
            }
            // If a taskId is provided, add the task to the DailyPlan
            if (taskId) {
                const task = await this._taskService.findOneByIdString(taskId);
                if (!task) {
                    throw new common_1.BadRequestException('Task not found');
                }
                dailyPlan.tasks.push(task);
            }
            await this.save(dailyPlan); // Save changes
            return dailyPlan; // Return the created/updated DailyPlan
        }
        catch (error) {
            throw new common_1.BadRequestException(error); // Clearer error messaging
        }
    }
    /**
     * Retrieves daily plans with pagination and additional query options.
     *
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    async getAllPlans(options, employeeId) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            const { where } = options;
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? where?.tenantId;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = {
                        tenantId,
                        organizationId: where?.organizationId
                    };
                    if (employeeId)
                        mikroWhere.employeeId = employeeId;
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        ...(options?.relations ? { populate: options.relations } : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create the initial query
                    const query = this.typeOrmDailyPlanRepository.createQueryBuilder(this.tableName);
                    // Join related entities
                    query.leftJoin(`${query.alias}.employee`, 'employee');
                    query.leftJoin(`${query.alias}.tasks`, 'tasks');
                    // Apply optional find options if provided
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
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), {
                        organizationId: where?.organizationId
                    });
                    if (employeeId) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                    }
                    // Retrieve results and total count
                    const [items, total] = await query.getManyAndCount();
                    // Return the pagination result
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Retrieves daily plans for a specific employee with pagination and additional query options.
     *
     * @param employeeId - The ID of the employee for whom to retrieve daily plans.
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    async getDailyPlansByEmployee(options, employeeId) {
        // Fetch all daily plans for specific employee
        return await this.getAllPlans(options, employeeId);
    }
    /**
     * Retrieves daily plans for all employees of a specific team with pagination and additional query options.
     *
     * @param teamId - The ID of the team for whom to retrieve daily plans.
     * @param options - Pagination and additional query options for filtering and retrieving daily plans.
     * @returns A promise that resolves to an object containing the list of daily plans and the total count.
     * @throws BadRequestException - If there's an error during the query.
     */
    async getTeamDailyPlans(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            // Apply optional find options if provided
            const { where, relations = [] } = options || {};
            const { organizationId, organizationTeamId } = where;
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? where?.tenantId;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = {
                        tenantId,
                        organizationId
                    };
                    if (organizationTeamId)
                        mikroWhere.organizationTeamId = organizationTeamId;
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        populate: ['employee', 'tasks', ...relations]
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create the initial query
                    const query = this.typeOrmDailyPlanRepository.createQueryBuilder(this.tableName);
                    // Join related entities
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'employee');
                    query.leftJoinAndSelect(`${query.alias}.tasks`, 'tasks');
                    query.setFindOptions({
                        where: (0, utils_1.isNotEmpty)(where) && where,
                        relations: (0, utils_1.isNotEmpty)(relations) && (0, utils_2.parseFindOptionsRelations)(relations)
                    });
                    // Filter conditions
                    query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    if (organizationTeamId) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationTeamId" = :organizationTeamId`), {
                            organizationTeamId
                        });
                    }
                    // Retrieve results and total count
                    const [items, total] = await query.getManyAndCount();
                    // Return the pagination result
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.log('Error while fetching daily plans for team');
            throw new common_1.HttpException(`Failed to fetch daily plans for team: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Retrieves daily plans for the current employee based on given pagination options.
     *
     * @param options Pagination options for fetching daily plans.
     * @returns A promise resolving to daily plans for the current employee.
     */
    async getMyPlans(options) {
        const currentEmployeeId = request_context_1.RequestContext.currentEmployeeId();
        // Fetch daily plans for the current employee
        return await this.getAllPlans(options, currentEmployeeId);
    }
    /**
     * Fetches a daily plan with manager access control.
     * Checks if the current user has permission to access the plan (either global permission or manager access).
     *
     * @param planId - The ID of the daily plan
     * @param employeeId - The employee ID who owns the plan
     * @param tenantId - The tenant ID
     * @param organizationId - The organization ID
     * @returns The daily plan with tasks relation
     * @throws NotFoundException if plan doesn't exist or user doesn't have access
     */
    async getManagedDailyPlanOrThrow(planId, employeeId, tenantId, organizationId) {
        // Check if user has global permission
        const hasGlobalPermission = request_context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        let dailyPlan;
        if (hasGlobalPermission) {
            // User has global permission → Use normal flow (no bypass needed)
            dailyPlan = await this.findOneByIdString(planId, {
                where: {
                    employeeId,
                    tenantId,
                    organizationId
                },
                relations: { tasks: true }
            });
        }
        else {
            // User is potentially a manager → Check access first.
            // Step 1: Fetch minimal data to get the plan's owner, team and organization.
            // This read must run without the automatic employee filter: for a caller without
            // CHANGE_SELECTED_EMPLOYEE that filter overrides `employeeId` with the caller's own id, so a
            // plan owned by anyone else would never be found and the manager check below could never run.
            // The bypass covers this single read only; access is decided before anything is returned.
            const { success, record: planTeamInfo } = await this.withoutEmployeeFilter(() => this.findOneOrFailByOptions({
                where: {
                    id: planId,
                    employeeId,
                    tenantId,
                    organizationId
                }
            }));
            // Step 2: Check if current user can manage the plan's owner in the plan's team.
            // The owner and the organization come from the stored plan, not from the request body, so
            // the check stays anchored to the record itself.
            // Note: We throw the same generic error whether the plan doesn't exist or the user lacks permission
            // to avoid leaking information about which plan IDs exist in the system
            const canManage = success &&
                !!planTeamInfo &&
                (await this._managedEmployeeService.canManageEmployee(planTeamInfo.employeeId ?? employeeId, planTeamInfo.organizationTeamId, planTeamInfo.organizationId ?? organizationId));
            if (!canManage) {
                throw new common_1.NotFoundException('Daily plan not found or you do not have permission to access it');
            }
            // Step 3: Access verified → Fetch full data with bypass
            dailyPlan = await this.withoutEmployeeFilter(async () => {
                return await this.findOneByIdString(planId, {
                    where: {
                        employeeId,
                        tenantId,
                        organizationId
                    },
                    relations: { tasks: true }
                });
            });
        }
        if (!dailyPlan) {
            throw new common_1.NotFoundException('Daily plan not found');
        }
        return dailyPlan;
    }
    /**
     * Add a task to a specified daily plan.
     *
     * @param planId - The unique identifier of the daily plan to which the task will be added.
     * @param input - An object containing details about the task to add, including task ID, employee ID, and organization ID.
     * @returns The updated daily plan with the newly added task.
     */
    async addTaskToPlan(planId, input) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId();
            const { employeeId, taskId, organizationId } = input;
            // Fetch daily plan with access control
            const dailyPlan = await this.getManagedDailyPlanOrThrow(planId, employeeId, tenantId, organizationId);
            // Fetch the task to be added
            const taskToAdd = await this._taskService.findOneByIdString(taskId, {
                where: { organizationId, tenantId }
            });
            // Add the new task to the daily plan's tasks array
            dailyPlan.tasks.push(taskToAdd);
            // Save the updated daily plan
            return await this.save(dailyPlan);
        }
        catch (error) {
            // Preserve HTTP exceptions (NotFoundException, etc.), only wrap non-HTTP errors
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    /**
     * Delete task from a given daily plan
     *
     * @param  planId The unique identifier of the daily plan to which the task will be removed.
     * @param input - An object containing details about the task to remove, including task ID, employee ID, and organization ID.
     * @returns The updated daily plan without the deleted task.
     */
    async removeTaskFromPlan(planId, input) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId();
            const { employeeId, taskId, organizationId } = input;
            // Fetch daily plan with access control
            const dailyPlan = await this.getManagedDailyPlanOrThrow(planId, employeeId, tenantId, organizationId);
            // Get task to be removed
            const taskToRemove = await this._taskService.findOneByIdString(taskId, {
                where: { organizationId, tenantId }
            });
            if (!taskToRemove) {
                throw new common_1.BadRequestException('The task to remove not found');
            }
            // Remove the task form the daily plan's tasks array
            const { tasks } = dailyPlan;
            dailyPlan.tasks = tasks.filter((task) => task.id !== taskId);
            // Save and return the updated daily plan
            return await this.save(dailyPlan);
        }
        catch (error) {
            // Preserve HTTP exceptions (NotFoundException, BadRequestException, etc.), only wrap non-HTTP errors
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    /**
     * Delete task from a many daily plans
     *
     * @param  taskId The unique identifier of the task to removed from daily plans.
     * @param input - An object containing details about the plans to update, including employee ID, and organization ID.
     * @returns The updated daily plans without the deleted task.
     */
    async removeTaskFromManyPlans(taskId, input) {
        try {
            const tenantId = request_context_1.RequestContext.currentTenantId();
            const { employeeId, plansIds, organizationId, organizationTeamId } = input;
            const currentDate = new Date().toISOString().split('T')[0];
            // Initial query for finding daily plans
            let dailyPlansToUpdate;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = {
                        tenantId,
                        organizationId,
                        organizationTeamId,
                        employeeId,
                        date: { $gte: new Date(currentDate) }
                    };
                    if (plansIds.length > 0) {
                        mikroWhere.id = { $in: plansIds };
                    }
                    else {
                        mikroWhere.tasks = { id: taskId };
                    }
                    const items = await this.mikroOrmDailyPlanRepository.find(mikroWhere, {
                        populate: ['employee', 'tasks', 'employee.user']
                    });
                    dailyPlansToUpdate = items.map((e) => this.serialize(e));
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Initial query
                    const query = this.typeOrmDailyPlanRepository.createQueryBuilder(this.tableName);
                    // Joins
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'employee');
                    query.leftJoinAndSelect(`${query.alias}.tasks`, 'tasks');
                    query.leftJoinAndSelect('employee.user', 'user');
                    // Conditions
                    query.where((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationTeamId" = :organizationTeamId`), {
                        organizationTeamId
                    });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."employeeId" = :employeeId`), { employeeId });
                    // Find condition must include only today and future plans
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`DATE("${query.alias}"."date") >= :currentDate`), { currentDate });
                    if (plansIds.length > 0) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`${query.alias}.id IN (:...plansIds)`), { plansIds });
                    }
                    else {
                        query.andWhere((qb) => {
                            const subQuery = qb.subQuery();
                            subQuery
                                .select((0, database_helper_1.prepareSQLQuery)('"daily_plan_task"."dailyPlanId"'))
                                .from((0, database_helper_1.prepareSQLQuery)('daily_plan_task'), (0, database_helper_1.prepareSQLQuery)('daily_plan_task'));
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"daily_plan_task"."taskId" = :taskId'), { taskId });
                            return (0, database_helper_1.prepareSQLQuery)(`${query.alias}.id IN `) + subQuery.distinct(true).getQuery();
                        });
                    }
                    dailyPlansToUpdate = await query.getMany();
                    break;
                }
            }
            if (dailyPlansToUpdate.length < 1) {
                throw new common_1.BadRequestException('Daily plans not found');
            }
            // Get task to be removed
            const taskToRemove = await this._taskService.findOneByIdString(taskId, {
                where: { organizationId, tenantId }
            });
            if (!taskToRemove) {
                throw new common_1.BadRequestException('The task to remove not found');
            }
            const updatedPlans = dailyPlansToUpdate.map((plan) => {
                const { tasks } = plan;
                plan.tasks = tasks.filter((task) => task.id !== taskId);
                return plan;
            });
            // save and return the updatedDailyPlan
            return await this.saveMany(updatedPlans);
        }
        catch (error) {
            // Preserve HTTP exceptions (BadRequestException, etc.), only wrap non-HTTP errors
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    /**
     * UPDATE Daily plan
     *
     * @param id - The unique identifier of the daily plan to be updated.
     * @param partialEntity - An object with data to update, including organization ID and employee ID.
     * @returns The updated daily plan including related tasks.
     * @memberof DailyPlanService
     */
    async updateDailyPlan(id, partialEntity) {
        try {
            const { employeeId, organizationId } = partialEntity;
            // Get the tenant ID from the current Request
            const currentTenantId = request_context_1.RequestContext.currentTenantId();
            // Fetch daily plan with access control
            const dailyPlan = await this.getManagedDailyPlanOrThrow(id, employeeId, currentTenantId, organizationId);
            // Return the updated daily plan
            const updatedDailyPlan = Object.assign(dailyPlan, {
                ...partialEntity,
                tasks: dailyPlan.tasks
            });
            return await this.save(updatedDailyPlan);
        }
        catch (error) {
            // Preserve HTTP exceptions (NotFoundException, etc.), only wrap non-HTTP errors
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message);
        }
    }
    /**
     * Retrieves daily plans for a specific task including employee
     * @param options pagination and additional query options
     * @param taskId - The ID of the task for whom to retrieve daily plans.
     * @returns A promise that resolves to an object containing the list of plans and total count
     */
    async getDailyPlansByTask(options, taskId) {
        try {
            const { where } = options;
            const { organizationId } = where;
            const tenantId = request_context_1.RequestContext.currentTenantId();
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = {
                        tenantId,
                        organizationId,
                        tasks: { id: taskId }
                    };
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        populate: ['employee', 'tasks', 'employee.user']
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Initial query
                    const query = this.typeOrmDailyPlanRepository.createQueryBuilder(this.tableName);
                    // Joins
                    query.leftJoinAndSelect(`${query.alias}.employee`, 'employee');
                    query.leftJoinAndSelect(`${query.alias}.tasks`, 'tasks');
                    query.leftJoinAndSelect('employee.user', 'user');
                    // Conditions
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    query.andWhere((qb) => {
                        const subQuery = qb.subQuery();
                        subQuery
                            .select((0, database_helper_1.prepareSQLQuery)('"daily_plan_task"."dailyPlanId"'))
                            .from((0, database_helper_1.prepareSQLQuery)('daily_plan_task'), (0, database_helper_1.prepareSQLQuery)('daily_plan_task'));
                        subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"daily_plan_task"."taskId" = :taskId'), { taskId });
                        return (0, database_helper_1.prepareSQLQuery)(`${query.alias}.id IN `) + subQuery.distinct(true).getQuery();
                    });
                    // Retrieves results and total count
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.DailyPlanService = DailyPlanService;
exports.DailyPlanService = DailyPlanService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_daily_plan_repository_1.TypeOrmDailyPlanRepository,
        mikro_orm_daily_plan_repository_1.MikroOrmDailyPlanRepository,
        employee_service_1.EmployeeService,
        task_service_1.TaskService,
        managed_employee_service_1.ManagedEmployeeService])
], DailyPlanService);
//# sourceMappingURL=daily-plan.service.js.map