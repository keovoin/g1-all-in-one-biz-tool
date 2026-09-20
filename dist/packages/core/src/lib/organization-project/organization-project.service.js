"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("../core/crud");
const html_sanitizer_1 = require("../core/html-sanitizer");
const context_1 = require("../core/context");
const utils_2 = require("../core/utils");
const internal_1 = require("../core/entities/internal");
const decorators_1 = require("../core/decorators");
const database_helper_1 = require("./../database/database.helper");
const role_service_1 = require("../role/role.service");
const events_1 = require("../entity-subscription/events");
const entity_subscription_service_1 = require("../entity-subscription/entity-subscription.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const employee_service_1 = require("../employee/employee.service");
const employee_recent_visit_service_1 = require("../employee-recent-visit/employee-recent-visit.service");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const type_orm_organization_project_repository_1 = require("./repository/type-orm-organization-project.repository");
const mikro_orm_organization_project_repository_1 = require("./repository/mikro-orm-organization-project.repository");
const type_orm_organization_project_employee_repository_1 = require("./repository/type-orm-organization-project-employee.repository");
let OrganizationProjectService = class OrganizationProjectService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository, typeOrmOrganizationProjectEmployeeRepository, typeOrmEmployeeRepository, _eventBus, _roleService, _employeeService, _entitySubscriptionService, _activityLogService, _employeeRecentVisitService) {
        super(typeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository);
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.mikroOrmOrganizationProjectRepository = mikroOrmOrganizationProjectRepository;
        this.typeOrmOrganizationProjectEmployeeRepository = typeOrmOrganizationProjectEmployeeRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this._eventBus = _eventBus;
        this._roleService = _roleService;
        this._employeeService = _employeeService;
        this._entitySubscriptionService = _entitySubscriptionService;
        this._activityLogService = _activityLogService;
        this._employeeRecentVisitService = _employeeRecentVisitService;
    }
    /**
     * Creates an organization project based on the provided input.
     * @param input - Input data for creating the organization project.
     * @returns A Promise resolving to the created organization project.
     */
    async create(input) {
        // Sanitize the rich-text description HTML through the shared server-side allowlist.
        if (typeof input.description === 'string') {
            input.description = (0, html_sanitizer_1.sanitizeRichHtml)(input.description);
        }
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const employeeId = context_1.RequestContext.currentEmployeeId();
        const currentRoleId = context_1.RequestContext.currentRoleId();
        // Destructure the input data
        const { tags = [], memberIds = [], managerIds = [], organizationId, ...entity } = input;
        try {
            // If the employee creates the project, default add as a manager
            try {
                // Check if the current role is EMPLOYEE
                await this._roleService.findOneByIdString(currentRoleId, {
                    where: { name: contracts_1.RolesEnum.EMPLOYEE }
                });
                // Add the current employee to the managerIds if they have the EMPLOYEE role and are not already included
                if (!managerIds.includes(employeeId)) {
                    // If not included, add the employeeId to the managerIds array
                    managerIds.push(employeeId);
                }
            }
            catch (error) { }
            // Combine memberIds and managerIds into a single array
            const employeeIds = [...memberIds, ...managerIds].filter(Boolean);
            // Retrieves a collection of employees based on specified criteria.
            const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
            // Find the manager role
            const managerRole = await this._roleService.findOneByWhereOptions({
                name: contracts_1.RolesEnum.MANAGER
            });
            // Create a Set for faster membership checks
            const managerIdsSet = new Set(managerIds);
            // Use destructuring to directly extract 'id' from 'employee'
            const members = employees.map(({ id: employeeId }) => {
                // If the employee is a manager, assign the existing manager with the latest assignedAt date
                const isManager = managerIdsSet.has(employeeId);
                const assignedAt = new Date();
                return new internal_1.OrganizationProjectEmployee({
                    employeeId,
                    organizationId,
                    tenantId,
                    isManager,
                    assignedAt,
                    role: isManager ? managerRole : null
                });
            });
            // Create the organization project with the prepared members
            const project = await super.create({
                ...entity,
                members,
                tags,
                organizationId,
                tenantId
            });
            // Subscribe creator and assignees to the project
            try {
                await Promise.all(employees.map(({ id }) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.OrganizationProject,
                    entityId: project.id,
                    employeeId: id,
                    type: id === employeeId
                        ? contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY
                        : contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }))));
            }
            catch (error) {
                console.error('Error subscribing creators and assignees to the project:', error);
            }
            // Generate the activity log
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationProject, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, project.id, project.name, project, organizationId, tenantId);
            // Return the created project
            return project;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to create organization project: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Update an organization project.
     *
     * @param id - The ID of the organization project to be updated.
     * @param input - The updated information for the organization project.
     * @returns A Promise resolving to the updated organization project.
     */
    async update(id, input) {
        // Sanitize the rich-text description HTML through the shared server-side allowlist.
        if (typeof input.description === 'string') {
            input.description = (0, html_sanitizer_1.sanitizeRichHtml)(input.description);
        }
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const { memberIds, managerIds, organizationId, ...entity } = input;
        const organizationProject = await super.findOneByIdString(id, {
            where: { organizationId, tenantId },
            relations: { image: true, members: true, organizationContact: true, tags: true, teams: true }
        });
        try {
            // Retrieve members and managers IDs
            // Combine memberIds and managerIds into a single array
            if (Array.isArray(managerIds) || Array.isArray(memberIds)) {
                const employeeIds = [...memberIds, ...managerIds].filter(Boolean);
                // Retrieves a collection of employees based on specified criteria.
                const projectMembers = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
                await this.updateOrganizationProjectMembers(id, organizationId, tenantId, projectMembers, managerIds, memberIds);
            }
            // Update nested entity (Organization Project Members)
            const { id: organizationProjectId } = organizationProject;
            // Update the organization project with the prepared members
            const updatedProject = await super.create({
                ...entity,
                organizationId,
                tenantId,
                id: organizationProjectId
            });
            // Generate the activity log
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationProject, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedProject.id, updatedProject.name, updatedProject, organizationId, tenantId, organizationProject, input);
            return updatedProject;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to update organization project: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Find an organization project by ID.
     *
     * @param id - The ID of the organization project to find.
     * @param options - The options for finding the organization project.
     * @returns A promise that resolves with the organization project.
     */
    async findById(id, options) {
        try {
            const organizationProject = await this.findOneByIdString(id, options);
            // Register the last visited at date for the current employee
            try {
                await this._employeeRecentVisitService.emitSaveEmployeeRecentVisitEvent(contracts_1.BaseEntityEnum.OrganizationProject, organizationProject.id, organizationProject, organizationProject.organizationId, organizationProject.tenantId ?? context_1.RequestContext.currentTenantId());
            }
            catch (error) {
                console.error('[Project] Error emitting employee recent visit event:', error);
            }
            return organizationProject;
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to find organization project: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Delete project members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    async deleteMemberByIds(memberIds) {
        // Map member IDs to deletion promises
        const deletePromises = memberIds.map((memberId) => this.typeOrmOrganizationProjectEmployeeRepository.delete(memberId));
        // Wait for all deletions to complete
        await Promise.all(deletePromises);
    }
    /**
     * Updates an organization project by managing its members and their roles.
     *
     * @param organizationProjectId - ID of the organization project
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the project
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    async updateOrganizationProjectMembers(organizationProjectId, organizationId, tenantId, employees, managerIds, memberIds) {
        const membersToUpdate = new Set([...managerIds, ...memberIds].filter(Boolean));
        // Find the manager role
        const managerRole = await this._roleService.findOneByWhereOptions({
            name: contracts_1.RolesEnum.MANAGER
        });
        // Fetch existing project members with their roles
        const projectMembers = await this.typeOrmOrganizationProjectEmployeeRepository.find({
            where: { tenantId, organizationId, organizationProjectId }
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
            // Unsubscribe members who were unassigned from project
            try {
                await Promise.all(removedMembers.map(async (member) => await this._entitySubscriptionService.delete({
                    entity: contracts_1.BaseEntityEnum.OrganizationProject,
                    entityId: organizationProjectId,
                    employeeId: member.employee.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                })));
            }
            catch (error) {
                console.error('Error unsubscribing members from the project:', error);
            }
        }
        // 2. Update roles for existing members where necessary
        await Promise.all(updatedMembers.map(async (member) => {
            const isManager = managerIds.includes(member.employeeId);
            const newRole = isManager ? managerRole : null;
            // Only update if the role has changed
            if (newRole?.id !== member.roleId) {
                await this.typeOrmOrganizationProjectEmployeeRepository.update(member.id, {
                    role: newRole,
                    isManager
                });
            }
        }));
        // 3. Add new members to the project
        if (newMembers.length) {
            const newProjectMembers = newMembers.map((employee) => new internal_1.OrganizationProjectEmployee({
                organizationProjectId,
                employeeId: employee.id,
                tenantId,
                organizationId,
                isManager: managerIds.includes(employee.id),
                roleId: managerIds.includes(employee.id) ? managerRole.id : null
            }));
            // Subscribe new assignees to the project
            try {
                await Promise.all(newMembers.map((member) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.OrganizationProject,
                    entityId: organizationProjectId,
                    employeeId: member.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }))));
            }
            catch (error) { }
            await this.typeOrmOrganizationProjectEmployeeRepository.save(newProjectMembers);
        }
    }
    /**
     * Finds projects assigned to a specific employee based on the provided options.
     *
     * @param employeeId - The ID of the employee to find projects for.
     * @param input - Filter options for finding organization projects.
     * @returns A promise that resolves with a list of projects assigned to the employee.
     */
    async findByEmployee(employeeId, input) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        this.assertRelationsPermitted(input);
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId; // Use the current tenant ID or fallback to input tenantId
        const { organizationId, organizationContactId, organizationTeamId, relations = [] } = input;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = {
                    tenantId,
                    organizationId,
                    members: { employeeId }
                };
                if ((0, utils_1.isNotEmpty)(organizationContactId)) {
                    where.organizationContactId = organizationContactId;
                }
                if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                    where.teams = { id: organizationTeamId };
                }
                const items = await this.mikroOrmRepository.find(where, {
                    populate: relations
                });
                return items.map((e) => this.serialize(e));
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Create a query to fetch organization projects
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                query.setFindOptions({
                    select: {
                        id: true,
                        name: true,
                        imageUrl: true,
                        currency: true,
                        billing: true,
                        public: true,
                        owner: true,
                        taskListType: true
                    },
                    relations: (0, utils_2.parseFindOptionsRelations)(relations)
                });
                query
                    .innerJoin(`${query.alias}.members`, 'project_members')
                    .leftJoin(`${query.alias}.teams`, 'project_team');
                query
                    .where(`project_members.employeeId = :employeeId`, { employeeId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId })
                    .andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                // Apply additional filters if organizationContactId is provided
                if ((0, utils_1.isNotEmpty)(organizationContactId)) {
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationContactId" = :organizationContactId`), {
                        organizationContactId
                    });
                }
                // Apply additional filters if organizationTeamId is provided
                if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
                    query.andWhere(`project_team.id = :organizationTeamId`, { organizationTeamId });
                }
                // Get the results
                return query.getMany();
            }
        }
    }
    /**
     * Overrides the organization project find all method to handle special cases.
     *
     * @param options - Pagination parameters with optional filters.
     * @returns A promise that resolves with the paginated result of organization projects.
     */
    async findAll(options) {
        // Check and handle the case where `organizationContactId` is explicitly set to 'null'
        if (options?.where?.organizationContactId === 'null') {
            options.where.organizationContactId = (0, typeorm_1.IsNull)();
        }
        // Call the parent class's findAll method with the modified options
        return super.findAll(options);
    }
    /**
     * Overrides the organization project pagination method to handle filtering by tags.
     *
     * @param options - Pagination parameters with optional filters.
     * @returns A promise that resolves with the paginated result of organization projects.
     */
    async pagination(options) {
        // Check if there is a `where` clause and handle the `tags` filter
        if (options?.where?.tags) {
            options.where.tags = {
                id: (0, typeorm_1.In)(options.where.tags)
            };
        }
        if (options?.where?.name) {
            options.where.name = (0, typeorm_1.ILike)(`%${options.where.name}%`);
        }
        // Call the parent class's paginate method with the modified options
        return super.paginate(options);
    }
    /**
     * Get organization projects associated with a specific repository.
     *
     * @param repositoryId - The ID of the repository.
     * @param options - An object containing organization, tenant, and integration information.
     * @returns A Promise that resolves to an array of organization projects.
     */
    async getProjectsByGithubRepository(repositoryId, options) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() || options.tenantId;
            const { organizationId, projectId, integrationId } = options;
            // Attempt to retrieve the organization projects by the provided parameters.
            const projects = await this.find({
                where: {
                    ...(projectId ? { id: projectId } : {}),
                    organizationId,
                    tenantId,
                    customFields: {
                        repository: {
                            repositoryId,
                            integrationId,
                            organizationId,
                            tenantId,
                            isActive: true,
                            isArchived: false,
                            hasSyncEnabled: true
                        }
                    },
                    isActive: true,
                    isArchived: false
                }
            });
            // Return the projects
            return projects;
        }
        catch (error) {
            return [];
        }
    }
    /**
     * Adds custom joins and selects based on the presence of custom fields.
     *
     * @param query - The TypeORM query builder instance.
     * @param customFields - The array of custom fields.
     * @returns The modified query builder instance.
     */
    addCustomFieldJoins(query, customFields) {
        const hasRepositoryField = customFields.some((field) => field.name === 'repository');
        if (hasRepositoryField) {
            // Join with the `Repository` entity and left join with `Issue` entity
            query.innerJoinAndSelect(`${query.alias}.customFields.repository`, 'repository');
            query.leftJoin('repository.issues', 'issue');
            // Select and count issues, and group the result by project and repository
            query.addSelect('COUNT(issue.id)', 'issueCount');
            query.groupBy(`${query.alias}.id, repository.id`);
        }
        return query;
    }
    /**
     * Adds custom where conditions based on provided options and tenant ID.
     *
     * @param query - The TypeORM query builder instance.
     * @param tenantId - The tenant ID to be used in the where conditions.
     * @param options - Additional options containing where conditions.
     * @returns The modified query builder instance.
     */
    addWhereConditions(query, options) {
        const tenantId = context_1.RequestContext.currentTenantId();
        // Define where conditions for the query
        query.where((qb) => {
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."tenantId" = :tenantId`), { tenantId });
            // Conditionally add repository tenantId condition only if repository is joined
            if (query.expressionMap.joinAttributes.some((ja) => ja.alias.name === 'repository')) {
                qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"repository"."tenantId" = :tenantId`), { tenantId });
            }
            if (options?.where) {
                for (const key of Object.keys(options.where)) {
                    qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."${key}" = :${key}`), { [key]: options.where[key] });
                    // Conditionally add where conditions for repository if it's joined
                    if (query.expressionMap.joinAttributes.some((ja) => ja.alias.name === 'repository')) {
                        qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"repository"."${key}" = :${key}`), { [key]: options.where[key] });
                    }
                }
            }
            qb.andWhere((0, database_helper_1.prepareSQLQuery)(`"${qb.alias}"."repositoryId" IS NOT NULL`));
        });
        return query;
    }
    /**
     * Find synchronized organization projects with options and count their associated issues.
     *
     * @param options - Query and pagination options (optional).
     * @returns A paginated list of synchronized organization projects with associated issue counts.
     */
    async findSyncedProjects(options) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const tenantId = context_1.RequestContext.currentTenantId();
                const where = { tenantId };
                if (options?.where) {
                    for (const key of Object.keys(options.where)) {
                        where[key] = options.where[key];
                    }
                }
                // Match TypeORM's repositoryId IS NOT NULL filter
                where.repositoryId = { $ne: null };
                const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                    limit: options?.take || 10,
                    offset: options?.skip ? (options.take || 10) * (options.skip - 1) : 0
                });
                return { items: items.map((e) => this.serialize(e)), total };
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                // Get the list of custom fields for the specified entity, defaulting to an empty array if none are found
                const customFields = (0, config_1.getConfig)().customFields?.['OrganizationProject'] ?? [];
                // Create a query builder for the `OrganizationProject` entity
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Set find options (skip, take, and relations)
                query.skip(options && options.skip ? options.take * (options.skip - 1) : 0);
                query.take(options && options.take ? options.take : 10);
                // Conditionally add joins based on custom fields
                this.addCustomFieldJoins(query, customFields);
                // Add where conditions
                this.addWhereConditions(query, options);
                // Execute the query and return the paginated result
                const [items, total] = await query.getManyAndCount();
                return { items, total };
            }
        }
    }
    /**
     * Updates the employee's project associations.
     *
     * This method adds or removes projects for an employee based on the provided input. If the employee is added to
     * new projects, the respective project members are updated. If the employee is removed from projects, the project
     * membership records are deleted.
     *
     * @param input The input data containing information about the employee, projects to add, projects to remove, and the organization.
     * @returns A Promise that resolves to `true` when the update is successful.
     */
    async updateByEmployee(input) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const { organizationId, addedProjectIds = [], removedProjectIds = [], member } = input;
            // The member id comes from the request body and keys the raw-repository DELETE below: an
            // empty value used to be dropped from the criteria, removing EVERY member of the listed
            // projects. Fail closed.
            if (!member?.id) {
                throw new common_1.BadRequestException('member.id is required');
            }
            if (!tenantId) {
                throw new common_1.BadRequestException('Tenant context is required');
            }
            if (!organizationId) {
                throw new common_1.BadRequestException('organizationId is required');
            }
            // Handle adding projects
            if (addedProjectIds.length > 0) {
                const projectsToAdd = await this.find({
                    where: { id: (0, typeorm_1.In)(addedProjectIds), organizationId, tenantId },
                    relations: { members: true }
                });
                const updatedProjectsToAdd = projectsToAdd
                    .filter((project) => {
                    // Filter only projects where the member is not already assigned
                    return !project.members?.some(({ employeeId }) => employeeId === member.id);
                })
                    .map((project) => {
                    // Create new member object for the projects where the member is not yet assigned
                    const newMember = new internal_1.OrganizationProjectEmployee({
                        employeeId: member.id,
                        organizationProjectId: project.id,
                        organizationId,
                        tenantId
                    });
                    // Return the project with the new member added to the members array
                    return {
                        ...project,
                        members: [...project.members, newMember] // Add new member while keeping existing members intact
                    };
                });
                // Save updated projects
                await this.saveMany(updatedProjectsToAdd);
            }
            // Handle removing projects
            if (removedProjectIds.length > 0) {
                await this.typeOrmOrganizationProjectEmployeeRepository.delete({
                    organizationProjectId: (0, typeorm_1.In)(removedProjectIds),
                    employeeId: member.id,
                    organizationId,
                    tenantId
                });
            }
            return true;
        }
        catch (error) {
            console.log('Error while updating project by employee:', error);
            throw new common_1.HttpException({ message: 'Error while updating project by employee' }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Checks if a given employee is a manager of a specific project.
     *
     * @param projectId - The ID of the project.
     * @param employeeId - The ID of the employee.
     * @returns A boolean indicating whether the employee is a manager of the project.
     */
    async isManagerOfProject(projectId, employeeId) {
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const project = await this.mikroOrmRepository.findOne({
                    id: projectId,
                    members: {
                        employeeId,
                        isActive: true,
                        isArchived: false,
                        isManager: true
                    }
                });
                return !!project;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const project = await this.typeOrmRepository
                    .createQueryBuilder('project')
                    .innerJoin('project.members', 'members')
                    .where('project.id = :projectId', { projectId })
                    .andWhere('members.employeeId = :employeeId', { employeeId })
                    .andWhere('members.isActive = :isActive', { isActive: true })
                    .andWhere('members.isArchived = :isArchived', { isArchived: false })
                    .andWhere('members.isManager = :isManager', { isManager: true })
                    .getOne();
                return !!project;
            }
        }
    }
};
exports.OrganizationProjectService = OrganizationProjectService;
exports.OrganizationProjectService = OrganizationProjectService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.OrganizationProject),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository,
        type_orm_organization_project_employee_repository_1.TypeOrmOrganizationProjectEmployeeRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        cqrs_1.EventBus,
        role_service_1.RoleService,
        employee_service_1.EmployeeService,
        entity_subscription_service_1.EntitySubscriptionService,
        activity_log_service_1.ActivityLogService,
        employee_recent_visit_service_1.EmployeeRecentVisitService])
], OrganizationProjectService);
//# sourceMappingURL=organization-project.service.js.map