"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const context_1 = require("../core/context");
const utils_1 = require("../core/utils");
const employee_service_1 = require("../employee/employee.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const role_service_1 = require("../role/role.service");
const employee_notification_service_1 = require("../employee-notification/employee-notification.service");
const type_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const type_orm_broadcast_repository_1 = require("./repository/type-orm-broadcast.repository");
const mikro_orm_broadcast_repository_1 = require("./repository/mikro-orm-broadcast.repository");
let BroadcastService = class BroadcastService extends crud_1.TenantAwareCrudService {
    constructor(dataSource, typeOrmBroadcastRepository, mikroOrmBroadcastRepository, _employeeService, _activityLogService, _roleService, _employeeNotificationService, _typeOrmOrganizationTeamEmployeeRepository) {
        super(typeOrmBroadcastRepository, mikroOrmBroadcastRepository);
        this.dataSource = dataSource;
        this.typeOrmBroadcastRepository = typeOrmBroadcastRepository;
        this.mikroOrmBroadcastRepository = mikroOrmBroadcastRepository;
        this._employeeService = _employeeService;
        this._activityLogService = _activityLogService;
        this._roleService = _roleService;
        this._employeeNotificationService = _employeeNotificationService;
        this._typeOrmOrganizationTeamEmployeeRepository = _typeOrmOrganizationTeamEmployeeRepository;
    }
    /**
     * Creates a new broadcast.
     *
     * @param input - The input data for creating a broadcast.
     * @returns A promise that resolves to the created broadcast.
     * @throws {NotFoundException} If the employee (publisher) is not found.
     * @throws {BadRequestException} If an error occurs during the creation.
     */
    async create(input) {
        try {
            // Retrieve context-specific IDs
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // null for CHANGE_SELECTED_EMPLOYEE holders and non-employee users: such publishers create
            // publisher-less broadcasts (the long-standing behavior). Only validate a real employee id —
            // a lookup by an empty id must not (and no longer can) pass on the strength of an arbitrary row.
            const employeeId = context_1.RequestContext.currentEmployeeId();
            const { organizationId, ...data } = input;
            // Validate that the employee exists
            let employee;
            if (employeeId) {
                employee = await this._employeeService.findOneByIdString(employeeId);
                if (!employee) {
                    throw new common_1.NotFoundException(`Employee with id ${employeeId} not found`);
                }
            }
            // Create the broadcast with publishedAt defaulting to now if not provided
            const broadcast = await super.create({
                ...data,
                employeeId,
                tenantId,
                organizationId,
                publishedAt: input.publishedAt ?? new Date()
            });
            // Log activity for broadcast creation
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.Broadcast, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, broadcast.id, broadcast.title, broadcast, organizationId, tenantId);
            // Notify the audience asynchronously (don't await to avoid blocking)
            this.notifyAudience(broadcast, employee?.fullName).catch((err) => console.error('Error notifying audience:', err.message));
            return broadcast;
        }
        catch (error) {
            console.log(`Error while creating broadcast: ${error.message}`, error);
            throw new common_1.BadRequestException('Broadcast creation failed', error);
        }
    }
    /**
     * Updates an existing broadcast.
     *
     * @param id - The unique identifier of the broadcast to update.
     * @param input - The update data for the broadcast.
     * @returns A promise that resolves to the updated broadcast or update result.
     * @throws {BadRequestException} If the broadcast is not found or update fails.
     */
    async update(id, input) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const employeeId = context_1.RequestContext.currentEmployeeId();
            const canChangeSelectedEmployee = context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
            // Find the broadcast for the current employee with the given id. Callers holding
            // CHANGE_SELECTED_EMPLOYEE may edit any broadcast of the tenant; everyone else must be the
            // publisher — and therefore must have an employee identity (a null key was previously just
            // dropped from the query, which let employee-less callers edit anything).
            if (!canChangeSelectedEmployee && !employeeId) {
                throw new common_1.ForbiddenException(`You don't have permission to update this broadcast`);
            }
            const originalBroadcast = await this.findOneByWhereOptions({
                id,
                ...(canChangeSelectedEmployee ? {} : { employeeId })
            });
            if (!originalBroadcast) {
                throw new common_1.BadRequestException(`Broadcast with id ${id} not found or you don't have permission to update it`);
            }
            // Update the broadcast with the new input data
            const updatedBroadcast = await super.create({
                ...input,
                id
            });
            // Log activity for broadcast update
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.Broadcast, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, id, updatedBroadcast.title, updatedBroadcast, originalBroadcast.organizationId, tenantId, originalBroadcast, input);
            return updatedBroadcast;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException) {
                throw error;
            }
            console.log(`Error while updating broadcast: ${error.message}`, error);
            throw new common_1.BadRequestException('Broadcast update failed', error);
        }
    }
    /**
     * Finds broadcasts with visibility and audience filtering.
     *
     * @param filters - Filter criteria for broadcasts.
     * @returns A promise that resolves to a paginated list of broadcasts.
     */
    async findAll(filters) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const organizationId = context_1.RequestContext.currentOrganizationId() ?? filters.where?.organizationId;
        const employeeId = context_1.RequestContext.currentEmployeeId();
        const currentUser = context_1.RequestContext.currentUser();
        const currentRoleId = context_1.RequestContext.currentRoleId();
        // Extract filters from where clause
        const whereClause = filters.where ?? {};
        const { entity, entityId, category, visibilityMode, isArchived = false } = whereClause;
        // Pass the raw value through the converter, which handles both the legacy string[] form and the
        // v1 object form (and undefined) — so object-form relations aren't silently dropped.
        const relations = filters.relations;
        // Extract pagination options from filters
        const { take, skip } = filters;
        // Build the base where condition with organizationId for proper scoping
        const where = {
            tenantId,
            ...(organizationId && { organizationId }),
            ...(entity && { entity }),
            ...(entityId && { entityId }),
            ...(category && { category }),
            ...(visibilityMode && { visibilityMode }),
            isArchived,
            isActive: true
        };
        // Retrieve broadcasts matching base criteria with pagination
        const queryOptions = {
            where,
            relations: (0, utils_1.parseFindOptionsRelations)(relations),
            order: { publishedAt: 'DESC' },
            ...(take !== undefined && { take }),
            ...(skip !== undefined && { skip })
        };
        const { items } = await super.findAll(queryOptions);
        // Filter broadcasts based on visibility mode and audience rules
        const filteredBroadcasts = [];
        for (const broadcast of items) {
            const canView = await this.canViewBroadcast(broadcast, employeeId, currentUser?.id, currentRoleId, organizationId);
            if (canView) {
                filteredBroadcasts.push(broadcast);
            }
        }
        return {
            items: filteredBroadcasts,
            total: filteredBroadcasts.length
        };
    }
    /**
     * Finds a single broadcast by ID with visibility checks.
     *
     * @param id - The unique identifier of the broadcast.
     * @param relations - Optional relations to load.
     * @returns A promise that resolves to the broadcast if found and visible.
     * @throws {NotFoundException} If the broadcast is not found or not visible to the current user.
     */
    async findOneById(id, params) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const organizationId = context_1.RequestContext.currentOrganizationId() ?? params?.where?.organizationId;
        const employeeId = context_1.RequestContext.currentEmployeeId();
        const currentUserId = context_1.RequestContext.currentUserId();
        const currentRoleId = context_1.RequestContext.currentRoleId();
        // Build where condition with tenant and organization scoping
        const where = {
            id,
            tenantId,
            ...(organizationId && { organizationId }),
            isActive: true
        };
        // Find the broadcast with optional relations
        const broadcast = await this.findOneByOptions({
            where,
            ...(params?.relations && { relations: params.relations })
        });
        if (!broadcast) {
            throw new common_1.NotFoundException(`Broadcast with id ${id} not found`);
        }
        // Check if the current user can view this broadcast
        const canView = await this.canViewBroadcast(broadcast, employeeId, currentUserId, currentRoleId, organizationId);
        if (!canView) {
            throw new common_1.NotFoundException(`Broadcast with id ${id} not found or you don't have permission to view it`);
        }
        return broadcast;
    }
    /**
     * Checks if the current user can view a broadcast based on visibility mode and audience rules.
     *
     * @param broadcast - The broadcast to check.
     * @param employeeId - The current employee ID.
     * @param userId - The current user ID.
     * @param roleId - The current role ID.
     * @returns True if the user can view the broadcast, false otherwise.
     */
    async canViewBroadcast(broadcast, employeeId, userId, roleId, organizationId) {
        const { visibilityMode, audienceRules, employeeId: publisherId, entity, entityId } = broadcast;
        // Publisher can always view their own broadcasts
        if (publisherId === employeeId) {
            return true;
        }
        switch (visibilityMode) {
            case contracts_1.BroadcastVisibilityModeEnum.ORGANIZATION:
                // All organization members can view
                return true;
            case contracts_1.BroadcastVisibilityModeEnum.ENTITY_MEMBERS:
                // Check if employee is a member of the entity
                return await this.isEntityMember(entity, entityId, employeeId, organizationId);
            case contracts_1.BroadcastVisibilityModeEnum.RESTRICTED:
                // Check audience rules
                return await this.checkAudienceRules(audienceRules, employeeId, userId, roleId);
            case contracts_1.BroadcastVisibilityModeEnum.EXTERNAL_VIEW:
                // External view requires a shared token, not direct access
                return false;
            default:
                return false;
        }
    }
    /**
     * Checks if an employee is a member of a specific entity by loading the entity with its members relation.
     * Supports: Organization (employees), OrganizationProject, OrganizationTeam, OrganizationDepartment (members).
     *
     * @param entity - The entity type.
     * @param entityId - The entity ID.
     * @param employeeId - The employee ID to check.
     * @returns True if the employee is a member of the entity.
     */
    async isEntityMember(entity, entityId, employeeId, organizationId) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // Organization uses 'employees' relation, others use 'members'
            const relationName = entity === contracts_1.BaseEntityEnum.Organization ? 'employees' : 'members';
            // Load the entity with its members/employees relation
            const repository = this.dataSource.getRepository(entity);
            // Only include organizationId for non-Organization entities, and only when one is known —
            // currentOrganizationId() is null for tokens without an organization claim.
            const scopeOrganizationId = organizationId || context_1.RequestContext.currentOrganizationId();
            const entityWithMembers = await repository.findOne({
                where: {
                    id: entityId,
                    tenantId,
                    ...(entity !== contracts_1.BaseEntityEnum.Organization && scopeOrganizationId
                        ? { organizationId: scopeOrganizationId }
                        : {})
                },
                relations: (0, utils_1.parseFindOptionsRelations)([relationName])
            });
            if (!entityWithMembers) {
                return false;
            }
            const members = entityWithMembers[relationName] || [];
            // OrganizationProject & OrganizationTeam: members are liaison entities with employeeId, isActive, isArchived
            // OrganizationDepartment & Organization: members/employees are Employee entities directly (check by id)
            if (entity === contracts_1.BaseEntityEnum.OrganizationProject || entity === contracts_1.BaseEntityEnum.OrganizationTeam) {
                return members.some((m) => m.employeeId === employeeId && m.isActive && !m.isArchived);
            }
            // OrganizationDepartment & Organization: direct Employee relation
            return members.some((m) => m.id === employeeId);
        }
        catch (error) {
            console.log(`Error checking entity membership for ${entity}:`, error.message);
            return false;
        }
    }
    /**
     * Checks if the current user matches the audience rules.
     *
     * @param audienceRules - The audience rules to check.
     * @param employeeId - The current employee ID.
     * @param userId - The current user ID.
     * @param roleId - The current role ID.
     * @returns True if the user matches the audience rules, false otherwise.
     */
    async checkAudienceRules(audienceRules, employeeId, userId, roleId) {
        if (!audienceRules) {
            return false;
        }
        // Parse audience rules if stored as string, with error handling for malformed JSON
        let rules;
        try {
            rules = typeof audienceRules === 'string' ? JSON.parse(audienceRules) : audienceRules;
        }
        catch (error) {
            console.error('Failed to parse audienceRules JSON:', error.message);
            // Treat invalid JSON as "not visible" for security
            return false;
        }
        // Check if user is in allowed user IDs
        if (rules.userIds?.includes(userId)) {
            return true;
        }
        // Check if employee is in allowed employee IDs
        if (rules.employeeIds?.includes(employeeId)) {
            return true;
        }
        // Check if user's role matches allowed roles
        if (rules.roles?.length && roleId) {
            try {
                const role = await this._roleService.findOneByIdString(roleId);
                if (role?.name) {
                    const roleName = role.name;
                    // Check if role is in allowed roles
                    if (rules.roles.includes(roleName)) {
                        // Also check if role is not in excluded roles
                        if (!rules.excludeRoles?.includes(roleName)) {
                            return true;
                        }
                    }
                }
            }
            catch (error) {
                // Role not found, continue checking other rules
                console.log('Role not found', { roleId, message: error.message });
            }
        }
        // Check if employee is in allowed teams
        if (rules.teamIds?.length && employeeId) {
            try {
                const tenantId = context_1.RequestContext.currentTenantId();
                const teamMemberships = await this._typeOrmOrganizationTeamEmployeeRepository.find({
                    where: {
                        employeeId,
                        organizationTeamId: (0, typeorm_2.In)(rules.teamIds),
                        tenantId
                    }
                });
                if (teamMemberships.length > 0) {
                    return true;
                }
            }
            catch (error) {
                // Error checking team membership, continue
                console.log(`Error checking team membership:`, error.message);
            }
        }
        return false;
    }
    /**
     * Notifies the audience of a new broadcast based on visibility mode and audience rules.
     *
     * @param broadcast - The broadcast to notify about.
     * @param publisherName - The name of the employee who published the broadcast.
     */
    async notifyAudience(broadcast, publisherName) {
        const { visibilityMode, audienceRules, organizationId, tenantId, employeeId: publisherId } = broadcast;
        // Get the list of employee IDs to notify based on visibility mode
        let employeeIdsToNotify = [];
        switch (visibilityMode) {
            case contracts_1.BroadcastVisibilityModeEnum.ORGANIZATION:
                // Notify all employees in the organization
                const orgEmployees = await this._employeeService.findAll({
                    where: { organizationId, tenantId, isActive: true }
                });
                employeeIdsToNotify = orgEmployees.items.map((e) => e.id).filter((id) => id !== publisherId);
                break;
            case contracts_1.BroadcastVisibilityModeEnum.ENTITY_MEMBERS:
                // Notify entity members (handled via isEntityMember check already in findAll)
                // For notifications, we need to get the actual members
                employeeIdsToNotify = await this.getEntityMemberIds(broadcast);
                break;
            case contracts_1.BroadcastVisibilityModeEnum.RESTRICTED:
                // Notify only employees in audience rules
                employeeIdsToNotify = await this.getRestrictedAudienceIds(audienceRules, organizationId, tenantId);
                break;
            case contracts_1.BroadcastVisibilityModeEnum.EXTERNAL_VIEW:
                // External view doesn't notify internal employees
                return;
        }
        // Remove duplicates and the publisher
        const uniqueEmployeeIds = [...new Set(employeeIdsToNotify)].filter((id) => id !== publisherId);
        // Send notifications to each employee
        for (const receiverEmployeeId of uniqueEmployeeIds) {
            this._employeeNotificationService.publishNotificationEvent({
                entity: contracts_1.BaseEntityEnum.Broadcast,
                entityId: broadcast.id,
                type: contracts_1.EmployeeNotificationTypeEnum.BROADCAST,
                message: broadcast.title,
                sentByEmployeeId: publisherId,
                receiverEmployeeId,
                organizationId,
                tenantId
            }, contracts_1.NotificationActionTypeEnum.Broadcasted, broadcast.title, publisherName);
        }
    }
    /**
     * Gets employee IDs that are members of the broadcast's entity.
     *
     * @param broadcast - The broadcast containing entity information.
     * @returns Array of employee IDs.
     */
    async getEntityMemberIds(broadcast) {
        const { entity, entityId, tenantId, organizationId } = broadcast;
        const relationName = entity === contracts_1.BaseEntityEnum.Organization ? 'employees' : 'members';
        try {
            const repository = this.dataSource.getRepository(entity);
            const entityWithMembers = await repository.findOne({
                where: { id: entityId, tenantId, organizationId },
                relations: (0, utils_1.parseFindOptionsRelations)([relationName])
            });
            if (!entityWithMembers)
                return [];
            const members = entityWithMembers[relationName] || [];
            // Project/Team: members have employeeId; Department/Organization: members are employees directly
            if (entity === contracts_1.BaseEntityEnum.OrganizationProject || entity === contracts_1.BaseEntityEnum.OrganizationTeam) {
                return members.filter((m) => m.isActive && !m.isArchived).map((m) => m.employeeId);
            }
            return members.map((m) => m.id);
        }
        catch (error) {
            console.error(`Error getting entity members for ${entity}:`, error.message);
            return [];
        }
    }
    /**
     * Gets employee IDs from restricted audience rules.
     *
     * @param audienceRules - The audience rules defining who can view.
     * @param organizationId - The organization ID.
     * @param tenantId - The tenant ID.
     * @returns Array of employee IDs.
     */
    async getRestrictedAudienceIds(audienceRules, organizationId, tenantId) {
        if (!audienceRules)
            return [];
        // Parse audience rules if stored as string, with error handling for malformed JSON
        let rules;
        try {
            rules = typeof audienceRules === 'string' ? JSON.parse(audienceRules) : audienceRules;
        }
        catch (error) {
            console.error('Failed to parse audienceRules JSON in getRestrictedAudienceIds:', error.message);
            // Return empty array if rules cannot be parsed
            return [];
        }
        const employeeIds = [];
        // Add directly specified employee IDs
        if (rules.employeeIds?.length) {
            employeeIds.push(...rules.employeeIds);
        }
        // Get employees from specified teams
        if (rules.teamIds?.length) {
            const teamMembers = await this._typeOrmOrganizationTeamEmployeeRepository.find({
                where: { organizationTeamId: (0, typeorm_2.In)(rules.teamIds), isActive: true, tenantId }
            });
            employeeIds.push(...teamMembers.map((m) => m.employeeId));
        }
        // Get employees with specified roles
        if (rules.roles?.length) {
            const employees = await this._employeeService.findAll({
                where: { organizationId, tenantId, isActive: true },
                relations: ['user', 'user.role']
            });
            for (const emp of employees.items) {
                const roleName = emp.user?.role?.name;
                if (roleName && rules.roles.includes(roleName)) {
                    if (!rules.excludeRoles?.includes(roleName)) {
                        employeeIds.push(emp.id);
                    }
                }
            }
        }
        return employeeIds;
    }
};
exports.BroadcastService = BroadcastService;
exports.BroadcastService = BroadcastService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.DataSource,
        type_orm_broadcast_repository_1.TypeOrmBroadcastRepository,
        mikro_orm_broadcast_repository_1.MikroOrmBroadcastRepository,
        employee_service_1.EmployeeService,
        activity_log_service_1.ActivityLogService,
        role_service_1.RoleService,
        employee_notification_service_1.EmployeeNotificationService,
        type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository])
], BroadcastService);
//# sourceMappingURL=broadcast.service.js.map