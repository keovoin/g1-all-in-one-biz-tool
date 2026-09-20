"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModuleService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const html_sanitizer_1 = require("./../core/html-sanitizer");
const context_1 = require("../core/context");
const utils_2 = require("../core/utils");
const util_1 = require("../core/util");
const database_helper_1 = require("./../database/database.helper");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const role_service_1 = require("../role/role.service");
const employee_service_1 = require("../employee/employee.service");
const task_service_1 = require("../tasks/task.service");
const organization_project_module_employee_entity_1 = require("./organization-project-module-employee.entity");
const type_orm_organization_project_module_repository_1 = require("./repository/type-orm-organization-project-module.repository");
const mikro_orm_organization_project_module_repository_1 = require("./repository/mikro-orm-organization-project-module.repository");
const type_orm_organization_project_module_employee_repository_1 = require("./repository/type-orm-organization-project-module-employee.repository");
const mikro_orm_organization_project_module_employee_repository_1 = require("./repository/mikro-orm-organization-project-module-employee.repository");
const decorators_1 = require("../core/decorators");
let OrganizationProjectModuleService = class OrganizationProjectModuleService extends crud_1.TenantAwareCrudService {
    constructor(dataSource, typeOrmProjectModuleRepository, mikroOrmProjectModuleRepository, typeOrmOrganizationProjectModuleEmployeeRepository, mikroOrmOrganizationProjectModuleEmployeeRepository, _activityLogService, _roleService, _employeeService, _taskService) {
        super(typeOrmProjectModuleRepository, mikroOrmProjectModuleRepository);
        this.dataSource = dataSource;
        this.typeOrmProjectModuleRepository = typeOrmProjectModuleRepository;
        this.mikroOrmProjectModuleRepository = mikroOrmProjectModuleRepository;
        this.typeOrmOrganizationProjectModuleEmployeeRepository = typeOrmOrganizationProjectModuleEmployeeRepository;
        this.mikroOrmOrganizationProjectModuleEmployeeRepository = mikroOrmOrganizationProjectModuleEmployeeRepository;
        this._activityLogService = _activityLogService;
        this._roleService = _roleService;
        this._employeeService = _employeeService;
        this._taskService = _taskService;
    }
    /**
     * Creates a new organization project module with the provided input.
     *
     * @param entity - The input data to create the project module.
     * @returns The created organization project module.
     */
    async create(entity) {
        // Sanitize the rich-text description HTML through the shared server-side allowlist.
        if (typeof entity.description === 'string') {
            entity.description = (0, html_sanitizer_1.sanitizeRichHtml)(entity.description);
        }
        const tenantId = context_1.RequestContext.currentTenantId() ?? entity.tenantId;
        const employeeId = context_1.RequestContext.currentEmployeeId();
        const currentRoleId = context_1.RequestContext.currentRoleId();
        const { organizationId, memberIds = [], managerIds = [], tasks = [], ...data } = entity;
        // Add the current employee to managerIds if they have the appropriate role
        await this.addCurrentEmployeeToManagers(managerIds, currentRoleId, employeeId);
        // Merge memberIds and managerIds to form the complete list of employee IDs
        const employeeIds = [...memberIds, ...managerIds].filter(Boolean);
        // Fetch the list of active employees based on the provided employee IDs
        const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            await queryRunner.startTransaction();
            // Get existing tasks
            const existingTasks = await this.getExistingTasks(tasks);
            const members = await this.buildModuleMembers(employees, managerIds, organizationId, tenantId);
            const projectModule = await super.create({
                ...data,
                members,
                organizationId,
                tenantId
            });
            await this.assignTasksToModule(existingTasks, projectModule);
            await queryRunner.commitTransaction();
            this.logModuleActivity(contracts_1.ActionTypeEnum.Created, projectModule, undefined, entity);
            return projectModule;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw new common_1.HttpException(`Failed to create organization project module: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
        finally {
            await queryRunner.release();
        }
    }
    /**
     * @description Update Project Module
     * @param {ID} id - The project module ID to be updated
     * @param {IOrganizationProjectModuleUpdateInput} entity Body Request data
     * @returns A promise resolved to updated project module Or Update Result
     * @memberof OrganizationProjectModuleService
     */
    async update(id, entity) {
        // Sanitize the rich-text description HTML through the shared server-side allowlist.
        if (typeof entity.description === 'string') {
            entity.description = (0, html_sanitizer_1.sanitizeRichHtml)(entity.description);
        }
        const tenantId = context_1.RequestContext.currentTenantId() ?? entity.tenantId;
        try {
            const { memberIds, managerIds, tasks = [] } = entity;
            // Retrieve existing module
            const existingProjectModule = await this.findOneByIdString(id, {
                relations: { parent: true, project: true, teams: true, members: true, tasks: true }
            });
            if (!existingProjectModule) {
                throw new common_1.BadRequestException('Module not found');
            }
            // The member lookups below are scoped by organization: use the module's own organization
            // when the (partial) update body does not carry one, never a null (a null used to be
            // dropped from the where and let employees of any organization of the tenant be added).
            const organizationId = entity.organizationId ?? existingProjectModule.organizationId;
            // Update members and managers if applicable
            if (Array.isArray(memberIds) || Array.isArray(managerIds)) {
                const employeeIds = [...(memberIds || []), ...(managerIds || [])].filter(Boolean);
                // Retrieves a collection of employees based on specified criteria
                const projectModuleMembers = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
                // Update nested entity (Organization Project Members)
                await this.updateOrganizationProjectModuleMembers(id, organizationId, projectModuleMembers, managerIds || [], memberIds || []);
            }
            // Update tasks logic
            if (Array.isArray(tasks)) {
                const existingTasks = await this.getExistingTasks(tasks);
                // Determine tasks to add
                const existingTaskIds = new Set(existingTasks.map((task) => task.id));
                const newTasks = tasks.filter((task) => !existingTaskIds.has(task.id));
                // Determine tasks to remove
                const tasksToRemove = existingProjectModule.tasks.filter((task) => !tasks.some((updatedTask) => updatedTask.id === task.id));
                // Add new tasks
                for (const task of newTasks) {
                    task.modules = [...(task.modules || []), existingProjectModule];
                    await this._taskService.update(task.id, task);
                }
                // Remove tasks
                for (const task of tasksToRemove) {
                    task.modules = task.modules?.filter((module) => module.id !== existingProjectModule.id) || [];
                    await this._taskService.update(task.id, task);
                }
            }
            // Update the project module with new values
            const updatedProjectModule = await super.create({
                ...entity,
                id
            });
            // Generate the activity log
            this.logModuleActivity(contracts_1.ActionTypeEnum.Updated, updatedProjectModule, existingProjectModule, entity);
            // Return updated module
            return updatedProjectModule;
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * @description Find employee project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    async getEmployeeProjectModules(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            const { where } = options;
            const { name, status, organizationId, projectId, members } = where;
            const tenantId = context_1.RequestContext.currentTenantId() ?? options.where.tenantId;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = { tenantId, organizationId };
                    // Filter by employee
                    if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                        if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                            mikroWhere.members = { employeeId: members['id'] };
                        }
                    }
                    else {
                        const employeeId = context_1.RequestContext.currentEmployeeId();
                        if ((0, utils_1.isNotEmpty)(employeeId)) {
                            mikroWhere.members = { employeeId };
                        }
                    }
                    if ((0, utils_1.isNotEmpty)(projectId))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(status))
                        mikroWhere.status = status;
                    if ((0, utils_1.isNotEmpty)(name))
                        mikroWhere.name = { $ilike: `%${name}%` };
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        limit: options?.take || 10,
                        offset: options?.skip ? (options.take || 10) * (options.skip - 1) : 0,
                        ...(options?.relations ? { populate: options.relations } : {}),
                        ...(options?.order ? { orderBy: options.order } : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create query builder
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Join employees
                    query.innerJoin(`${query.alias}.members`, 'members');
                    // Apply pagination and query options
                    this.applyPaginationAndOptions(query, options);
                    query.andWhere((qb) => {
                        const subQuery = qb.subQuery();
                        subQuery
                            .select((0, database_helper_1.prepareSQLQuery)('"project_module_employee"."organizationProjectModuleId"'))
                            .from((0, database_helper_1.prepareSQLQuery)('project_module_employee'), (0, database_helper_1.prepareSQLQuery)('project_module_employee'));
                        // If user have permission to change employee
                        if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                            if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                                const employeeId = members['id'];
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"project_module_employee"."employeeId" = :employeeId'), {
                                    employeeId
                                });
                            }
                        }
                        else {
                            // If employee has login and don't have permission to change employee
                            const employeeId = context_1.RequestContext.currentEmployeeId();
                            if ((0, utils_1.isNotEmpty)(employeeId)) {
                                subQuery.andWhere((0, database_helper_1.prepareSQLQuery)('"project_module_employee"."employeeId" = :employeeId'), {
                                    employeeId
                                });
                            }
                        }
                        return ((0, database_helper_1.prepareSQLQuery)('"organization_project_module_members"."organizationProjectModuleId" IN ') +
                            subQuery.distinct(true).getQuery());
                    });
                    query.andWhere(new typeorm_2.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    query.andWhere(new typeorm_2.Brackets((qb) => {
                        // Apply optional filters
                        const filters = {
                            status: status,
                            projectId: projectId,
                            name: name
                        };
                        // Apply optional filters
                        this.applyOptionalFilters(query, qb, filters);
                    }));
                    console.log('Get Employees modules', query.getSql()); // Query logs for debugging
                    // Execute the query with pagination
                    return await this.executePaginationQuery(query);
                }
            }
        }
        catch (error) {
            // Error logging for debugging
            throw new common_1.HttpException(`Error while retrieving employee project modules: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * @description Find Team's project modules
     * @param options - Options finders and relations
     * @returns - A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    async findTeamProjectModules(options) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(options);
        try {
            const { where } = options;
            const { name, status, teams = [], organizationId, projectId, members } = where;
            const tenantId = context_1.RequestContext.currentTenantId() || where.tenantId;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = { tenantId, organizationId };
                    // Filter by team members
                    if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                        if ((0, utils_1.isNotEmpty)(members) && (0, utils_1.isNotEmpty)(members['id'])) {
                            mikroWhere.teams = { members: { employeeId: members['id'] } };
                        }
                    }
                    else {
                        const employeeId = context_1.RequestContext.currentEmployeeId();
                        if ((0, utils_1.isNotEmpty)(employeeId)) {
                            mikroWhere.teams = { members: { employeeId } };
                        }
                    }
                    if ((0, utils_1.isNotEmpty)(teams)) {
                        mikroWhere.teams = { ...mikroWhere.teams, id: { $in: teams } };
                    }
                    if ((0, utils_1.isNotEmpty)(projectId))
                        mikroWhere.projectId = projectId;
                    if ((0, utils_1.isNotEmpty)(status))
                        mikroWhere.status = status;
                    if ((0, utils_1.isNotEmpty)(name))
                        mikroWhere.name = { $ilike: `%${name}%` };
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere, {
                        limit: options?.take || 10,
                        offset: options?.skip ? (options.take || 10) * (options.skip - 1) : 0,
                        ...(options?.relations ? { populate: options.relations } : {}),
                        ...(options?.order ? { orderBy: options.order } : {})
                    });
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create query builder
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Join teams
                    query.leftJoin(`${query.alias}.teams`, 'teams');
                    // Apply pagination and query options
                    this.applyPaginationAndOptions(query, options);
                    query.andWhere((qb) => {
                        const subQuery = qb.subQuery();
                        subQuery
                            .select((0, database_helper_1.prepareSQLQuery)('"project_module_team"."organizationProjectModuleId"'))
                            .from((0, database_helper_1.prepareSQLQuery)('project_module_team'), (0, database_helper_1.prepareSQLQuery)('project_module_team'));
                        subQuery.leftJoin('organization_team_employee', 'organization_team_employee', (0, database_helper_1.prepareSQLQuery)('"organization_team_employee"."organizationTeamId" = "project_module_team"."organizationTeamId"'));
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
                            subQuery.andWhere((0, database_helper_1.prepareSQLQuery)(`"${subQuery.alias}"."organizationTeamId" IN (:...teams)`), { teams });
                        }
                        return ((0, database_helper_1.prepareSQLQuery)(`"organization_project_module_members"."organizationProjectModuleId" IN `) +
                            subQuery.distinct(true).getQuery());
                    });
                    query.andWhere(new typeorm_2.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    }));
                    if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isNotEmpty)(teams)) {
                        query.orWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                    }
                    query.andWhere(new typeorm_2.Brackets((qb) => {
                        if ((0, utils_1.isNotEmpty)(projectId) && (0, utils_1.isEmpty)(teams)) {
                            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
                        }
                        // Apply optional filters
                        const filters = {
                            status: status,
                            name: name
                        };
                        // Apply optional filters
                        this.applyOptionalFilters(query, qb, filters);
                    }));
                    console.log('Get Team modules', query.getSql()); // Query logs for debugging
                    // Execute the query with pagination
                    return await this.executePaginationQuery(query);
                }
            }
        }
        catch (error) {
            // Error logging for debugging
            throw new common_1.HttpException(`Error while retrieving organization team project modules: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * @description Find project modules by employee
     * @param employeeId - The employee ID for whom to search project modules
     * @param options - Finders options
     * @returns A promise that resolves after found project modules
     * @memberof OrganizationProjectModuleService
     */
    async findByEmployee(employeeId, options) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || options?.tenantId;
            const organizationId = options?.organizationId;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const mikroWhere = {
                        tenantId,
                        organizationId,
                        members: { employeeId }
                    };
                    if ((0, utils_1.isNotEmpty)(options?.projectId))
                        mikroWhere.projectId = options.projectId;
                    if ((0, utils_1.isNotEmpty)(options?.status))
                        mikroWhere.status = options.status;
                    if ((0, utils_1.isNotEmpty)(options?.name))
                        mikroWhere.name = { $ilike: `%${options.name}%` };
                    if ((0, utils_1.isNotEmpty)(options?.organizationSprintId))
                        mikroWhere.organizationSprints = { id: options.organizationSprintId };
                    if ((0, utils_1.isNotEmpty)(options?.organizationTeamId))
                        mikroWhere.teams = { id: options.organizationTeamId };
                    const [items, total] = await this.mikroOrmRepository.findAndCount(mikroWhere);
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Create query builder
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Joins and where clauses
                    query.innerJoin(`${query.alias}.members`, 'member');
                    query.leftJoin(`${query.alias}.teams`, 'project_team');
                    query.leftJoin(`${query.alias}."organizationSprints"`, 'sprint');
                    query.andWhere(new typeorm_2.Brackets((qb) => {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)('member.id = :employeeId'), { employeeId })
                            .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId })
                            .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                        // Apply optional filters
                        this.applyOptionalFilters(query, qb, options);
                    }));
                    // Execute the query with pagination
                    return await this.executePaginationQuery(query);
                }
            }
        }
        catch (error) {
            // Error logging for debugging
            throw new common_1.HttpException(`Error while retrieving organization project modules by employee: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Updates an organization project module by managing its members and their roles.
     *
     * @param organizationProjectModuleId - ID of the organization project module
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the project
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    async updateOrganizationProjectModuleMembers(organizationProjectModuleId, organizationId, employees, managerIds, memberIds) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const membersToUpdate = new Set([...managerIds, ...memberIds].filter(Boolean));
        // Find the manager role
        const managerRole = await this._roleService.findOneByWhereOptions({
            name: contracts_1.RolesEnum.MANAGER
        });
        // Fetch existing project members with their roles
        const projectMembers = await this.typeOrmOrganizationProjectModuleEmployeeRepository.find({
            where: { tenantId, organizationId, organizationProjectModuleId }
        });
        // Create a map of existing members for quick lookup
        const existingMemberMap = new Map(projectMembers.map((member) => [member.employeeId, member]));
        // Separate members into removed, updated, and new members
        const removedMembers = projectMembers.filter((member) => !membersToUpdate.has(member.employeeId));
        const updatedMembers = projectMembers.filter((member) => membersToUpdate.has(member.employeeId));
        const newMembers = employees.filter((employee) => !existingMemberMap.has(employee.id));
        // 1. Remove members who are no longer assigned to the project
        if (removedMembers.length) {
            await this.deleteMemberByIds(removedMembers.map((member) => member.id));
        }
        // 2. Update roles for existing members where necessary
        await Promise.all(updatedMembers.map(async (member) => {
            const isManager = managerIds.includes(member.employeeId);
            const newRole = isManager ? managerRole : null;
            // Only update if the role has changed
            if (newRole?.id !== member.roleId) {
                await this.typeOrmOrganizationProjectModuleEmployeeRepository.update(member.id, {
                    role: newRole,
                    isManager
                });
            }
        }));
        // 3. Add new members to the project
        if (newMembers.length) {
            const newProjectMembers = newMembers.map((employee) => new organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee({
                organizationProjectModuleId,
                employeeId: employee.id,
                tenantId,
                organizationId,
                isManager: managerIds.includes(employee.id),
                roleId: managerIds.includes(employee.id) ? managerRole.id : null
            }));
            await this.typeOrmOrganizationProjectModuleEmployeeRepository.save(newProjectMembers);
        }
    }
    /**
     * Apply pagination and query options
     *
     * @param query - The query builder to apply pagination and options
     * @param options - Pagination and query options
     */
    applyPaginationAndOptions(query, params) {
        if ((0, utils_1.isNotEmpty)(params)) {
            const options = {};
            if ('skip' in params) {
                options.skip = (params.take || 10) * (params.skip - 1);
                options.take = params.take || 10;
            }
            if (params.select) {
                options.select = (0, utils_2.parseFindOptionsSelect)(params.select);
            }
            if (params.order) {
                options.order = params.order;
            }
            if (params.relations) {
                options.relations = (0, utils_2.parseFindOptionsRelations)(params.relations);
            }
            // Apply pagination and query options
            query.setFindOptions(options);
        }
    }
    /**
     * Apply optional filters to the query builder
     */
    applyOptionalFilters(query, qb, options) {
        const { projectId, status, name, organizationSprintId, organizationTeamId } = options;
        if ((0, utils_1.isNotEmpty)(projectId)) {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."projectId" = :projectId`), { projectId });
        }
        if ((0, utils_1.isNotEmpty)(status)) {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."status" = :status`), { status });
        }
        if ((0, utils_1.isNotEmpty)(name)) {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."name" ${util_1.LIKE_OPERATOR} :name`), { name: `%${name}%` });
        }
        if ((0, utils_1.isNotEmpty)(organizationSprintId)) {
            qb.andWhere('sprint.id = :organizationSprintId', { organizationSprintId });
        }
        if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
            qb.andWhere('project_team.id = :organizationTeamId', { organizationTeamId });
        }
    }
    /**
     * Executes the given query with pagination and returns the results.
     *
     * @param query The query builder instance to execute.
     * @returns A promise that resolves to an object containing the paginated items and total count.
     */
    async executePaginationQuery(query) {
        const [items, total] = await query.getManyAndCount();
        return { items, total };
    }
    /**
     * Delete project Module members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    async deleteMemberByIds(memberIds) {
        // Map member IDs to deletion promises
        const deletePromises = memberIds.map((memberId) => this.typeOrmOrganizationProjectModuleEmployeeRepository.delete(memberId));
        // Wait for all deletions to complete
        return await Promise.all(deletePromises);
    }
    /**
     * Add the current employee to managerIds if applicable.
     *
     * @param managerIds List of manager IDs.
     * @param currentRoleId The current role ID of the user.
     * @param employeeId The current employee ID.
     */
    async addCurrentEmployeeToManagers(managerIds, currentRoleId, employeeId) {
        try {
            const currentRole = await this._roleService.findOneByIdString(currentRoleId, {
                where: { name: contracts_1.RolesEnum.EMPLOYEE }
            });
            if (currentRole && !managerIds.includes(employeeId)) {
                managerIds.push(employeeId);
            }
        }
        catch {
            // Role is not "EMPLOYEE" or no action needed.
        }
    }
    /**
     * Retrieve existing tasks from the database that match the provided list.
     *
     * @param tasks - Array of task objects to check.
     * @returns A promise resolving to an array of existing tasks found in the database.
     */
    async getExistingTasks(tasks) {
        // Extract unique task IDs from the provided tasks
        const taskIds = [...new Set(tasks.map((task) => task.id))];
        // If no valid task IDs are present, return an empty array
        if (taskIds.length === 0) {
            return [];
        }
        // Fetch tasks from the database that match the extracted IDs, including their associated modules
        return this._taskService.find({
            where: { id: (0, typeorm_2.In)(taskIds) },
            relations: {
                modules: true
            }
        });
    }
    /**
     * Constructs an array of OrganizationProjectModuleEmployee instances,
     * marking specified employees as managers.
     *
     * @param employees - Array of employee entities.
     * @param managerIds - Array of employee IDs designated as managers.
     * @param organizationId - The ID of the organization.
     * @param tenantId - The ID of the tenant.
     * @returns Promise resolving to an array of OrganizationProjectModuleEmployee instances.
     */
    async buildModuleMembers(employees, managerIds, organizationId, tenantId) {
        // Retrieve the manager role once to avoid redundant database calls
        const managerRole = await this._roleService.findOneByWhereOptions({ name: contracts_1.RolesEnum.MANAGER });
        // Convert managerIds array to a Set for efficient lookup
        const managerIdsSet = new Set(managerIds);
        // Map employees to OrganizationProjectModuleEmployee instances
        return employees.map(({ id: employeeId }) => {
            const isManager = managerIdsSet.has(employeeId);
            return new organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee({
                employeeId,
                organizationId,
                tenantId,
                isManager,
                assignedAt: new Date(),
                role: isManager ? managerRole : undefined // Assign role only if the employee is a manager
            });
        });
    }
    /**
     * Assign tasks to the project module.
     * @param tasks List of tasks to associate with the module.
     * @param projectModule The project module to assign tasks to.
     */
    async assignTasksToModule(tasks, projectModule) {
        const taskUpdates = tasks.map((task) => {
            task.modules = task.modules || []; // Ensure task has modules initialized
            task.modules.push(projectModule);
            // Only update the relevant fields instead of the entire task
            return this._taskService.update(task.id, { modules: task.modules });
        });
        // Await all updates concurrently
        await Promise.all(taskUpdates);
    }
    /**
     * Log activity for a project module.
     * @param projectModule The project module to log.
     * @param organizationId The ID of the organization.
     * @param tenantId The ID of the tenant.
     */
    logModuleActivity(action, updatedModule, existingModule, changes) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? updatedModule.tenantId;
        const organizationId = updatedModule.organizationId;
        this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationProjectModule, action, contracts_1.ActorTypeEnum.User, updatedModule.id, updatedModule.name, updatedModule, organizationId, tenantId, existingModule, changes);
    }
};
exports.OrganizationProjectModuleService = OrganizationProjectModuleService;
exports.OrganizationProjectModuleService = OrganizationProjectModuleService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.OrganizationProjectModule),
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.DataSource,
        type_orm_organization_project_module_repository_1.TypeOrmOrganizationProjectModuleRepository,
        mikro_orm_organization_project_module_repository_1.MikroOrmOrganizationProjectModuleRepository,
        type_orm_organization_project_module_employee_repository_1.TypeOrmOrganizationProjectModuleEmployeeRepository,
        mikro_orm_organization_project_module_employee_repository_1.MikroOrmOrganizationProjectModuleEmployeeRepository,
        activity_log_service_1.ActivityLogService,
        role_service_1.RoleService,
        employee_service_1.EmployeeService,
        task_service_1.TaskService])
], OrganizationProjectModuleService);
//# sourceMappingURL=organization-project-module.service.js.map