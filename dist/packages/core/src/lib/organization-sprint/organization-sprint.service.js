"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const context_1 = require("../core/context");
const internal_1 = require("../core/entities/internal");
const decorators_1 = require("../core/decorators");
// import { prepareSQLQuery as p } from './../database/database.helper';
const events_1 = require("../entity-subscription/events");
const entity_subscription_service_1 = require("../entity-subscription/entity-subscription.service");
const role_service_1 = require("../role/role.service");
const employee_service_1 = require("../employee/employee.service");
const activity_log_service_1 = require("../activity-log/activity-log.service");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const type_orm_organization_sprint_repository_1 = require("./repository/type-orm-organization-sprint.repository");
const type_orm_organization_sprint_employee_repository_1 = require("./repository/type-orm-organization-sprint-employee.repository");
const mikro_orm_organization_sprint_repository_1 = require("./repository/mikro-orm-organization-sprint.repository");
const mikro_orm_organization_sprint_employee_repository_1 = require("./repository/mikro-orm-organization-sprint-employee.repository");
let OrganizationSprintService = class OrganizationSprintService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationSprintRepository, mikroOrmOrganizationSprintRepository, typeOrmOrganizationSprintEmployeeRepository, mikroOrmOrganizationSprintEmployeeRepository, typeOrmEmployeeRepository, _eventBus, _roleService, _employeeService, _entitySubscriptionService, _activityLogService) {
        super(typeOrmOrganizationSprintRepository, mikroOrmOrganizationSprintRepository);
        this.typeOrmOrganizationSprintRepository = typeOrmOrganizationSprintRepository;
        this.mikroOrmOrganizationSprintRepository = mikroOrmOrganizationSprintRepository;
        this.typeOrmOrganizationSprintEmployeeRepository = typeOrmOrganizationSprintEmployeeRepository;
        this.mikroOrmOrganizationSprintEmployeeRepository = mikroOrmOrganizationSprintEmployeeRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this._eventBus = _eventBus;
        this._roleService = _roleService;
        this._employeeService = _employeeService;
        this._entitySubscriptionService = _entitySubscriptionService;
        this._activityLogService = _activityLogService;
    }
    /**
     * Creates an organization sprint based on the provided input.
     * @param input - Input data for creating the organization sprint.
     * @returns A Promise resolving to the created organization sprint.
     * @throws BadRequestException if there is an error in the creation process.
     */
    async create(input) {
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        const employeeId = context_1.RequestContext.currentEmployeeId();
        const currentRoleId = context_1.RequestContext.currentRoleId();
        // Destructure the input data
        const { memberIds = [], managerIds = [], organizationId, ...entity } = input;
        try {
            // If the current employee creates the sprint, default add him as a manager
            try {
                // Check if the current role is EMPLOYEE
                await this._roleService.findOneByIdString(currentRoleId, { where: { name: contracts_1.RolesEnum.EMPLOYEE } });
                // Add the current employee to the managerIds if they have the EMPLOYEE role and are not already included.
                if (!managerIds.includes(employeeId)) {
                    // If not included, add the employeeId to the managerIds array.
                    managerIds.push(employeeId);
                }
            }
            catch (error) { }
            // Combine memberIds and managerIds into a single array.
            const employeeIds = [...memberIds, ...managerIds].filter(Boolean);
            // Retrieve a collection of employees based on specified criteria.
            const employees = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
            // Find the manager role
            const managerRole = await this._roleService.findOneByWhereOptions({
                name: contracts_1.RolesEnum.MANAGER
            });
            // Create a Set for faster membership checks
            const managerIdsSet = new Set(managerIds);
            // Use destructuring to directly extract 'id' from 'employee'
            const members = employees.map(({ id: employeeId }) => {
                // If the employee is manager, assign the existing manager with the latest assignedAt date.
                const isManager = managerIdsSet.has(employeeId);
                const assignedAt = new Date();
                return new internal_1.OrganizationSprintEmployee({
                    employeeId,
                    organizationId,
                    tenantId,
                    isManager,
                    assignedAt,
                    role: isManager ? managerRole : null
                });
            });
            // Create the organization sprint with the prepared members.
            const sprint = await super.create({
                ...entity,
                members,
                organizationId,
                tenantId
            });
            // Subscribe creator and assignees to the sprint
            try {
                await Promise.all(employees.map(({ id, userId }) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.OrganizationSprint,
                    entityId: sprint.id,
                    employeeId: id,
                    type: id === employeeId
                        ? contracts_1.EntitySubscriptionTypeEnum.CREATED_ENTITY
                        : contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }))));
            }
            catch (error) { }
            // Generate the activity log
            this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationSprint, contracts_1.ActionTypeEnum.Created, contracts_1.ActorTypeEnum.User, sprint.id, sprint.name, sprint, organizationId, tenantId);
            return sprint;
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to create organization sprint: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Update an organization sprint.
     *
     * @param id - The ID of the organization sprint to be updated.
     * @param input - The updated information for the organization sprint.
     * @returns A Promise resolving to the updated organization sprint.
     * @throws ForbiddenException if the user lacks permission or if certain conditions are not met.
     * @throws BadRequestException if there's an error during the update process.
     */
    async update(id, input) {
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        // Destructure the input data
        const { memberIds = [], managerIds = [], organizationId, projectId } = input;
        try {
            // Search for existing Organization Sprint
            // projectId is optional in the update body (PartialType makes it nullable): only filter on it
            // when the client sent one — sprint.projectId is NOT NULL, so a null (now IS NULL) would never match.
            const organizationSprint = await super.findOneByIdString(id, {
                where: { organizationId, tenantId, ...(projectId ? { projectId } : {}) },
                relations: { project: true, members: true, modules: true }
            });
            // Retrieve members and managers IDs
            if ((0, utils_1.isNotEmpty)(memberIds) || (0, utils_1.isNotEmpty)(managerIds)) {
                // Combine memberIds and managerIds into a single array
                const employeeIds = [...memberIds, ...managerIds].filter(Boolean);
                // Retrieve a collection of employees based on specified criteria.
                const sprintMembers = await this._employeeService.findActiveEmployeesByEmployeeIds(employeeIds, organizationId, tenantId);
                // Update nested entity (Organization Sprint Members)
                await this.updateOrganizationSprintMembers(id, organizationId, sprintMembers, managerIds, memberIds);
                // Update the organization sprint with the prepared members
                const { id: organizationSprintId } = organizationSprint;
                const updatedSprint = await super.create({
                    ...input,
                    organizationId,
                    tenantId,
                    id: organizationSprintId
                });
                // Generate the activity log
                this._activityLogService.logActivity(contracts_1.BaseEntityEnum.OrganizationSprint, contracts_1.ActionTypeEnum.Updated, contracts_1.ActorTypeEnum.User, updatedSprint.id, updatedSprint.name, updatedSprint, organizationId, tenantId, organizationSprint, input);
                // return updated sprint
                return updatedSprint;
            }
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            throw new common_1.HttpException(`Failed to update organization sprint: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Delete sprint members by IDs.
     *
     * @param memberIds - Array of member IDs to delete
     * @returns A promise that resolves when all deletions are complete
     */
    async deleteMemberByIds(memberIds) {
        // Map member IDs to deletion promises
        const deletePromises = memberIds.map((memberId) => this.typeOrmOrganizationSprintEmployeeRepository.delete(memberId));
        // Wait for all deletions to complete
        await Promise.all(deletePromises);
    }
    /**
     * Updates an organization sprint by managing its members and their roles.
     *
     * @param organizationSprintId - ID of the organization sprint
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the sprint
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    async updateOrganizationSprintMembers(organizationSprintId, organizationId, employees, managerIds, memberIds) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const membersToUpdate = new Set([...managerIds, ...memberIds].filter(Boolean));
        // Find the manager role.
        const managerRole = await this._roleService.findOneByWhereOptions({
            name: contracts_1.RolesEnum.MANAGER
        });
        // Fetch existing sprint members with their roles.
        const sprintMembers = await this.typeOrmOrganizationSprintEmployeeRepository.find({
            where: { tenantId, organizationId, organizationSprintId }
        });
        // Create a map of existing members for quick lookup
        const existingMemberMap = new Map(sprintMembers.map((member) => [member.employeeId, member]));
        // Separate members into removed, updated and new members
        const removedMembers = sprintMembers.filter((member) => !membersToUpdate.has(member.employeeId));
        const updatedMembers = sprintMembers.filter((member) => membersToUpdate.has(member.employeeId));
        const newMembers = employees.filter((employee) => !existingMemberMap.has(employee.id));
        // 1. Remove members who are no longer assigned to the sprint
        if (removedMembers.length) {
            await this.deleteMemberByIds(removedMembers.map((member) => member.id));
            // Unsubscribe members who were unassigned from sprint
            try {
                await Promise.all(removedMembers.map(async (member) => await this._entitySubscriptionService.delete({
                    entity: contracts_1.BaseEntityEnum.OrganizationSprint,
                    entityId: organizationSprintId,
                    employeeId: member.employee.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                })));
            }
            catch (error) { }
        }
        // 2. Update roles for existing members where necessary.
        await Promise.all(updatedMembers.map(async (member) => {
            const isManager = managerIds.includes(member.employeeId);
            const newRole = isManager ? managerRole : null;
            // Only update if the role has changed
            if (newRole && newRole.id !== member.roleId) {
                await this.typeOrmOrganizationSprintEmployeeRepository.update(member.id, { role: newRole });
            }
        }));
        // 3. Add new members to the sprint
        if (newMembers.length) {
            const newSprintMembers = newMembers.map((employee) => new internal_1.OrganizationSprintEmployee({
                organizationSprintId,
                employeeId: employee.id,
                tenantId,
                organizationId,
                isManager: managerIds.includes(employee.id),
                roleId: managerIds.includes(employee.id) ? managerRole.id : null
            }));
            // Subscribe new assignees to the sprint
            try {
                await Promise.all(newMembers.map((member) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.OrganizationSprint,
                    entityId: organizationSprintId,
                    employeeId: member.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }))));
            }
            catch (error) { }
            await this.typeOrmOrganizationSprintEmployeeRepository.save(newSprintMembers);
        }
    }
};
exports.OrganizationSprintService = OrganizationSprintService;
exports.OrganizationSprintService = OrganizationSprintService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.OrganizationSprint),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_sprint_repository_1.TypeOrmOrganizationSprintRepository,
        mikro_orm_organization_sprint_repository_1.MikroOrmOrganizationSprintRepository,
        type_orm_organization_sprint_employee_repository_1.TypeOrmOrganizationSprintEmployeeRepository,
        mikro_orm_organization_sprint_employee_repository_1.MikroOrmOrganizationSprintEmployeeRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        cqrs_1.EventBus,
        role_service_1.RoleService,
        employee_service_1.EmployeeService,
        entity_subscription_service_1.EntitySubscriptionService,
        activity_log_service_1.ActivityLogService])
], OrganizationSprintService);
//# sourceMappingURL=organization-sprint.service.js.map