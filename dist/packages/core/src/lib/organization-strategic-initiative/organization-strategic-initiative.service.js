"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiativeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../core/crud");
const context_1 = require("../core/context");
const employee_service_1 = require("../employee/employee.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const role_service_1 = require("../role/role.service");
const type_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const type_orm_organization_project_repository_1 = require("../organization-project/repository/type-orm-organization-project.repository");
const type_orm_organization_strategic_initiative_repository_1 = require("./repository/type-orm-organization-strategic-initiative.repository");
const mikro_orm_organization_strategic_initiative_repository_1 = require("./repository/mikro-orm-organization-strategic-initiative.repository");
let OrganizationStrategicInitiativeService = class OrganizationStrategicInitiativeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationStrategicInitiativeRepository, mikroOrmOrganizationStrategicInitiativeRepository, _employeeService, _activityLogService, _roleService, _typeOrmOrganizationTeamEmployeeRepository, _typeOrmOrganizationProjectRepository) {
        super(typeOrmOrganizationStrategicInitiativeRepository, mikroOrmOrganizationStrategicInitiativeRepository);
        this.typeOrmOrganizationStrategicInitiativeRepository = typeOrmOrganizationStrategicInitiativeRepository;
        this.mikroOrmOrganizationStrategicInitiativeRepository = mikroOrmOrganizationStrategicInitiativeRepository;
        this._employeeService = _employeeService;
        this._activityLogService = _activityLogService;
        this._roleService = _roleService;
        this._typeOrmOrganizationTeamEmployeeRepository = _typeOrmOrganizationTeamEmployeeRepository;
        this._typeOrmOrganizationProjectRepository = _typeOrmOrganizationProjectRepository;
    }
    /**
     * Creates a new organization strategic initiative.
     *
     * @param input - The input data for creating an organization strategic initiative.
     * @returns A promise that resolves to the created organization strategic initiative.
     * @throws {NotFoundException} If the steward employee is not found.
     * @throws {BadRequestException} If an error occurs during the creation.
     */
    async create(input) {
        try {
            // Retrieve context-specific IDs
            const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
            const organizationId = input.organizationId;
            const currentEmployeeId = context_1.RequestContext.currentEmployeeId();
            // Validate steward if provided
            if (input.stewardId) {
                const steward = await this._employeeService.findOneByIdString(input.stewardId);
                if (!steward) {
                    throw new common_1.NotFoundException(`Steward with id ${input.stewardId} not found`);
                }
            }
            // Create the organization strategic initiative
            const organizationStrategicInitiative = await super.create({
                ...input,
                tenantId,
                organizationId,
                // Set current employee as creator if employeeId not provided
                stewardId: input.stewardId ?? currentEmployeeId
            });
            // Log activity for initiative creation
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationStrategicInitiative, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, organizationStrategicInitiative.id, organizationStrategicInitiative.title, organizationStrategicInitiative, organizationId, tenantId);
            return organizationStrategicInitiative;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException('Organization strategic initiative creation failed', error);
        }
    }
    /**
     * Updates an existing organization strategic initiative.
     *
     * @param id - The unique identifier of the organization strategic initiative to update.
     * @param input - The update data for the organization strategic initiative.
     * @returns A promise that resolves to the updated organization strategic initiative.
     * @throws {NotFoundException} If the organization strategic initiative is not found.
     * @throws {BadRequestException} If the organization strategic initiative update fails.
     */
    async update(id, input) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            // Find the organization strategic initiative
            const originalOrganizationStrategicInitiative = await this.findOneByWhereOptions({
                id,
                tenantId
            });
            if (!originalOrganizationStrategicInitiative) {
                throw new common_1.NotFoundException(`Organization strategic initiative with id ${id} not found`);
            }
            // Validate new steward if being changed
            if (input.stewardId && input.stewardId !== originalOrganizationStrategicInitiative.stewardId) {
                const steward = await this._employeeService.findOneByIdString(input.stewardId);
                if (!steward) {
                    throw new common_1.NotFoundException(`Steward with id ${input.stewardId} not found`);
                }
            }
            // Update the organization strategic initiative
            const updatedOrganizationStrategicInitiative = await super.create({
                ...input,
                id
            });
            // Log activity for organization strategic initiative update
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationStrategicInitiative, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, id, updatedOrganizationStrategicInitiative.title, updatedOrganizationStrategicInitiative, updatedOrganizationStrategicInitiative.organizationId, tenantId, originalOrganizationStrategicInitiative, updatedOrganizationStrategicInitiative);
            return updatedOrganizationStrategicInitiative;
        }
        catch (error) {
            if (error instanceof common_1.ForbiddenException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error(`Error while updating strategic initiative: ${error.message}`, error);
            throw new common_1.BadRequestException('Strategic initiative update failed', error);
        }
    }
    /**
     * Finds all strategic initiatives with visibility filtering.
     *
     * @param filters - Filter criteria for initiatives.
     * @returns A promise that resolves to a paginated list of initiatives.
     */
    async findAll(filters) {
        const currentEmployeeId = context_1.RequestContext.currentEmployeeId();
        // Ensure relations for visibility check are loaded (projects and their teams)
        const relationsToLoad = ['projects', 'projects.teams'];
        const existingRelations = Array.isArray(filters.relations) ? filters.relations : [];
        const mergedRelations = [...new Set([...existingRelations, ...relationsToLoad])];
        const { items } = await super.findAll({
            ...filters,
            relations: mergedRelations
        });
        // Pre-fetch employee team memberships to avoid N+1 queries
        const employeeTeamIds = await this.getEmployeeTeamIds(currentEmployeeId);
        // Check leadership access once (instead of per-initiative)
        const hasLeadership = await this.hasLeadershipAccess();
        // Filter organization strategic initiatives based on visibility scope (no extra queries)
        const filteredOrganizationStrategicInitiatives = items.filter((initiative) => this.canViewOrganizationStrategicInitiativeSync(initiative, currentEmployeeId, employeeTeamIds, hasLeadership));
        return {
            items: filteredOrganizationStrategicInitiatives,
            total: filteredOrganizationStrategicInitiatives.length
        };
    }
    /**
     * Finds a single organization strategic initiative by ID with visibility checks.
     *
     * @param id - The unique identifier of the organization strategic initiative.
     * @param params - Optional query parameters.
     * @returns A promise that resolves to the organization strategic initiative if found and visible.
     * @throws {NotFoundException} If the organization strategic initiative is not found or not visible.
     */
    async findOneById(id, params) {
        const currentEmployeeId = context_1.RequestContext.currentEmployeeId();
        // Find the organization strategic initiative with optional relations
        const organizationStrategicInitiative = await this.findOneByOptions({
            ...(params),
            where: {
                ...(params?.where && { ...params.where }),
                id
            }
        });
        if (!organizationStrategicInitiative) {
            throw new common_1.NotFoundException(`Organization strategic initiative with id ${id} not found`);
        }
        // Check visibility
        const canView = await this.canViewOrganizationStrategicInitiative(organizationStrategicInitiative, currentEmployeeId);
        if (!canView) {
            throw new common_1.NotFoundException(`Organization strategic initiative with id ${id} not found or you don't have permission to view it`);
        }
        return organizationStrategicInitiative;
    }
    /**
     * Finds all strategic initiatives linked to a specific project.
     *
     * @param projectId - The project ID.
     * @returns A promise that resolves to a list of initiatives.
     */
    async findByProject(projectId) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const currentEmployeeId = context_1.RequestContext.currentEmployeeId();
        // Get the project with its strategic initiatives and their projects/teams for visibility check
        const project = await this._typeOrmOrganizationProjectRepository.findOne({
            where: { id: projectId, tenantId },
            relations: {
                organizationStrategicInitiatives: {
                    projects: {
                        teams: true
                    }
                }
            }
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with id ${projectId} not found`);
        }
        const organizationStrategicInitiatives = project.organizationStrategicInitiatives ?? [];
        // Pre-fetch employee team memberships to avoid N+1 queries
        const employeeTeamIds = await this.getEmployeeTeamIds(currentEmployeeId);
        // Check leadership access once (instead of per-initiative)
        const hasLeadership = await this.hasLeadershipAccess();
        // Filter by visibility (no extra queries)
        return organizationStrategicInitiatives.filter((initiative) => this.canViewOrganizationStrategicInitiativeSync(initiative, currentEmployeeId, employeeTeamIds, hasLeadership));
    }
    /**
     * Updates the organization strategic signals of an initiative.
     *
     * @param id - The organization strategic initiative ID.
     * @param signals - The new signals data.
     * @returns The updated organization strategic initiative.
     */
    async updateSignals(id, signals) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const currentEmployeeId = context_1.RequestContext.currentEmployeeId();
        // Find the organization strategic initiative
        const organizationStrategicInitiative = await this.findOneByWhereOptions({ id, tenantId });
        if (!organizationStrategicInitiative) {
            throw new common_1.NotFoundException(`Organization strategic initiative with id ${id} not found`);
        }
        // Parse existing signals if string (with safe fallback for malformed data)
        const existingSignals = typeof organizationStrategicInitiative.signals === 'string'
            ? this.safeJsonParse(organizationStrategicInitiative.signals, {})
            : organizationStrategicInitiative.signals ?? {};
        // Parse new signals if string (with safe fallback for malformed input)
        const parsedNewSignals = typeof signals === 'string' ? this.safeJsonParse(signals, {}) : signals ?? {};
        // Merge with new signals
        const updatedSignals = {
            ...existingSignals,
            ...parsedNewSignals,
            lastAssessedAt: new Date(),
            lastAssessedById: currentEmployeeId
        };
        // Update
        return (await this.update(id, { signals: updatedSignals }));
    }
    // ============================================================
    // PRIVATE METHODS - Visibility & Permission Logic
    // ============================================================
    /**
     * Safely parses a JSON string with a fallback value.
     * Prevents 500 errors from malformed or manually edited database values.
     *
     * @param jsonString - The JSON string to parse.
     * @param fallback - The fallback value if parsing fails.
     * @returns The parsed object or the fallback value.
     */
    safeJsonParse(jsonString, fallback) {
        try {
            return JSON.parse(jsonString);
        }
        catch (error) {
            console.error('Failed to parse JSON string, using fallback:', error.message);
            return fallback;
        }
    }
    /**
     * Gets all team IDs that an employee is a member of.
     * This is used to batch-check team membership instead of N+1 queries.
     *
     * @param employeeId - The employee ID.
     * @returns A Set of team IDs the employee belongs to.
     */
    async getEmployeeTeamIds(employeeId) {
        if (!employeeId) {
            return new Set();
        }
        try {
            const teamMemberships = await this._typeOrmOrganizationTeamEmployeeRepository.find({
                where: {
                    employeeId,
                    isActive: true
                },
                select: {
                    organizationTeamId: true
                }
            });
            return new Set(teamMemberships.map((m) => m.organizationTeamId));
        }
        catch (error) {
            console.error('Error fetching employee team memberships:', error.message);
            return new Set();
        }
    }
    /**
     * Synchronous version of visibility check that uses pre-loaded data.
     * Avoids N+1 queries by using pre-fetched employee team IDs and organization strategic initiative relations.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative (with projects.teams relations loaded).
     * @param employeeId - The current employee ID.
     * @param employeeTeamIds - Pre-fetched Set of team IDs the employee belongs to.
     * @param hasLeadership - Pre-computed leadership access flag.
     * @returns True if the user can view the organization strategic initiative.
     */
    canViewOrganizationStrategicInitiativeSync(organizationStrategicInitiative, employeeId, employeeTeamIds, hasLeadershipAccess) {
        const { visibilityScope, stewardId } = organizationStrategicInitiative;
        // Steward can always view — only when there IS a steward and a caller identity (both may be
        // null: an unassigned initiative viewed by a non-employee user must not match on null === null).
        if (stewardId && employeeId && stewardId === employeeId) {
            return true;
        }
        switch (visibilityScope) {
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.ORGANIZATION:
                return true;
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.LEADERSHIP:
                return hasLeadershipAccess;
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.TEAM:
                // Check if employee is a member of any team linked to associated projects (using pre-loaded data)
                return this.isTeamMemberOfAssociatedProjectsSync(organizationStrategicInitiative, employeeTeamIds);
            default:
                return false;
        }
    }
    /**
     * Synchronous check if employee is a team member of associated projects.
     * Uses pre-loaded relations and pre-fetched team memberships.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative with projects.teams relations already loaded.
     * @param employeeTeamIds - Pre-fetched Set of team IDs the employee belongs to.
     * @returns True if the employee is a team member of associated projects.
     */
    isTeamMemberOfAssociatedProjectsSync(organizationStrategicInitiative, employeeTeamIds) {
        if (!organizationStrategicInitiative.projects?.length || employeeTeamIds.size === 0) {
            return false;
        }
        // Check if any project team matches employee's teams
        for (const project of organizationStrategicInitiative.projects) {
            if (project.teams?.length) {
                for (const team of project.teams) {
                    if (employeeTeamIds.has(team.id)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * Checks if the current user can view a strategic initiative based on visibility scope.
     *
     * Visibility rules:
     * - LEADERSHIP: Only admins/managers can view
     * - ORGANIZATION: All organization members can view
     * - TEAM: Members of teams linked to associated projects can view
     *
     * @param organizationStrategicInitiative - The organization strategic initiative to check.
     * @param employeeId - The current employee ID.
     * @returns True if the user can view the organization strategic initiative.
     */
    async canViewOrganizationStrategicInitiative(organizationStrategicInitiative, employeeId) {
        const { visibilityScope, stewardId } = organizationStrategicInitiative;
        // Steward and creator can always view — only when there IS a steward and a caller identity
        // (an unassigned initiative viewed by a non-employee user must not match on null === null).
        if (stewardId && employeeId && stewardId === employeeId) {
            return true;
        }
        switch (visibilityScope) {
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.ORGANIZATION:
                // All organization members can view
                return true;
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.LEADERSHIP:
                // Only leadership (admins/managers) can view
                return await this.hasLeadershipAccess();
            case contracts_1.OrganizationStrategicVisibilityScopeEnum.TEAM:
                // Check if employee is a member of any team linked to associated projects
                return await this.isTeamMemberOfAssociatedProjects(organizationStrategicInitiative, employeeId);
            default:
                return false;
        }
    }
    /**
     * Checks if the current user has leadership access (admin or manager role).
     *
     * @returns True if user has leadership access.
     */
    async hasLeadershipAccess() {
        const currentRoleId = context_1.RequestContext.currentRoleId();
        // Check if user has a leadership role
        if (currentRoleId) {
            try {
                const role = await this._roleService.findOneByIdString(currentRoleId);
                if (role?.name) {
                    const leadershipRoles = [
                        contracts_1.RolesEnum.SUPER_ADMIN,
                        contracts_1.RolesEnum.ADMIN,
                        contracts_1.RolesEnum.MANAGER,
                    ];
                    return leadershipRoles.includes(role.name);
                }
            }
            catch (error) {
                console.error('Error checking leadership access:', error.message);
            }
        }
        return false;
    }
    /**
     * Checks if the employee is a member of any team linked to projects associated with the organization strategic initiative.
     *
     * @param organizationStrategicInitiative - The organization strategic initiative.
     * @param employeeId - The employee ID to check.
     * @returns True if the employee is a team member of associated projects.
     */
    async isTeamMemberOfAssociatedProjects(organizationStrategicInitiative, employeeId) {
        try {
            // No employee identity, no team membership — same answer the batch path
            // (getEmployeeTeamIds / canViewOrganizationStrategicInitiativeSync) gives. An empty
            // employeeId used to be dropped from the membership query, turning the check into
            // "any active member exists in a linked team".
            if (!employeeId) {
                return false;
            }
            // Load the organization strategic initiative with its projects and their teams
            const organizationStrategicInitiativeWithProjects = await this.findOneByOptions({
                where: { id: organizationStrategicInitiative.id },
                relations: ['projects', 'projects.teams']
            });
            if (!organizationStrategicInitiativeWithProjects?.projects?.length) {
                return false;
            }
            // Collect all team IDs from associated projects
            const teamIds = [];
            for (const project of organizationStrategicInitiativeWithProjects.projects) {
                if (project.teams?.length) {
                    teamIds.push(...project.teams.map((team) => team.id));
                }
            }
            if (teamIds.length === 0) {
                return false;
            }
            // Check if employee is a member of any of these teams
            const membership = await this._typeOrmOrganizationTeamEmployeeRepository.findOne({
                where: {
                    employeeId,
                    organizationTeamId: (0, typeorm_1.In)(teamIds),
                    isActive: true
                }
            });
            return !!membership;
        }
        catch (error) {
            console.error('Error checking team membership for initiative:', error.message);
            return false;
        }
    }
};
exports.OrganizationStrategicInitiativeService = OrganizationStrategicInitiativeService;
exports.OrganizationStrategicInitiativeService = OrganizationStrategicInitiativeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_strategic_initiative_repository_1.TypeOrmOrganizationStrategicInitiativeRepository,
        mikro_orm_organization_strategic_initiative_repository_1.MikroOrmOrganizationStrategicInitiativeRepository,
        employee_service_1.EmployeeService,
        activity_log_service_1.ActivityLogService,
        role_service_1.RoleService,
        type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository])
], OrganizationStrategicInitiativeService);
//# sourceMappingURL=organization-strategic-initiative.service.js.map