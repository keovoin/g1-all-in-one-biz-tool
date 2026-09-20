"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationTeamEmployeeService = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const organization_team_employee_entity_1 = require("./organization-team-employee.entity");
const task_service_1 = require("./../tasks/task.service");
const events_1 = require("../entity-subscription/events");
const entity_subscription_service_1 = require("../entity-subscription/entity-subscription.service");
const type_orm_organization_team_employee_repository_1 = require("./repository/type-orm-organization-team-employee.repository");
const mikro_orm_organization_team_employee_repository_1 = require("./repository/mikro-orm-organization-team-employee.repository");
let OrganizationTeamEmployeeService = class OrganizationTeamEmployeeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository, _eventBus, _taskService, _entitySubscriptionService) {
        super(typeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository);
        this.typeOrmOrganizationTeamEmployeeRepository = typeOrmOrganizationTeamEmployeeRepository;
        this.mikroOrmOrganizationTeamEmployeeRepository = mikroOrmOrganizationTeamEmployeeRepository;
        this._eventBus = _eventBus;
        this._taskService = _taskService;
        this._entitySubscriptionService = _entitySubscriptionService;
    }
    /**
     * Update organization team by managing its members and their roles.
     *
     * @param organizationTeamId - ID of the organization team
     * @param organizationId - ID of the organization
     * @param employees - Array of employees to be assigned to the team
     * @param role - The role to assign to managers in the team
     * @param managerIds - Array of employee IDs to be assigned as managers
     * @param memberIds - Array of employee IDs to be assigned as members
     * @returns Promise<void>
     */
    async updateOrganizationTeam(organizationTeamId, organizationId, employees, role, managerIds, memberIds) {
        const tenantId = context_1.RequestContext.currentTenantId();
        const membersToUpdate = new Set([...managerIds, ...memberIds].filter(Boolean));
        // Fetch existing team members with their roles
        // Bypass employee filter since authorization is handled at a higher level
        const teamMembers = await this.withoutEmployeeFilter(() => this.find({
            where: { tenantId, organizationId, organizationTeamId },
            relations: { role: true }
        }));
        // Create a map for fast lookup of current team members
        const existingMemberMap = new Map(teamMembers.map((member) => [member.employeeId, member]));
        // Separate members to remove and to update
        const removedMembers = teamMembers.filter((member) => !membersToUpdate.has(member.employeeId));
        const updatedMembers = teamMembers.filter((member) => membersToUpdate.has(member.employeeId));
        // 1. Remove members who are no longer in the team
        if (removedMembers.length > 0) {
            /**
             * Unassign employee all tasks before removing from team
             */
            await Promise.all(removedMembers.map(async (member) => await this._taskService.unassignEmployeeFromTeamTasks(member.employeeId, organizationTeamId)));
            await this.deleteMany(removedMembers.map((member) => member.id));
            // Unsubscribe members who were unassigned from team
            try {
                await Promise.all(removedMembers.map(async (member) => await this._entitySubscriptionService.delete({
                    entity: contracts_1.BaseEntityEnum.OrganizationTeam,
                    entityId: organizationTeamId,
                    employeeId: member.employeeId,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                })));
            }
            catch (error) {
                console.error('Error unsubscribing team members:', error);
            }
        }
        // 2. Update role for existing members
        await Promise.all(updatedMembers.map(async (member) => {
            const isManager = managerIds.includes(member.employeeId);
            const newRole = isManager ? role : null;
            // Only update if the role has changed
            if (newRole?.id !== member.roleId) {
                await super.update(member.id, {
                    role: newRole,
                    isManager
                });
            }
        }));
        // 3. Add new members to the team
        const newMembers = employees.filter((employee) => !existingMemberMap.has(employee.id));
        if (newMembers.length > 0) {
            const newTeamMembers = newMembers.map((employee) => new organization_team_employee_entity_1.OrganizationTeamEmployee({
                organizationTeamId,
                employeeId: employee.id,
                tenantId,
                organizationId,
                roleId: managerIds.includes(employee.id) ? role.id : null
            }));
            // Subscribe new assignees to the team
            try {
                await Promise.all(newMembers.map((member) => this._eventBus.publish(new events_1.CreateEntitySubscriptionEvent({
                    entity: contracts_1.BaseEntityEnum.OrganizationTeam,
                    entityId: organizationTeamId,
                    employeeId: member.id,
                    type: contracts_1.EntitySubscriptionTypeEnum.ASSIGNMENT,
                    organizationId,
                    tenantId
                }))));
            }
            catch (error) {
                console.error('Error subscribing new team members:', error);
            }
            await this.saveMany(newTeamMembers);
        }
    }
    /**
     * Update organization team member entity
     *
     * @param memberId - The ID of the organization team member to update
     * @param entity - The input data for updating the organization team member
     * @returns The updated OrganizationTeamEmployee or UpdateResult
     */
    async update(memberId, entity) {
        try {
            const { organizationId, organizationTeamId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId() || entity.tenantId;
            // Create a where clause for the employee
            const whereClause = {
                tenantId,
                organizationId,
                organizationTeamId
            };
            // Check if user has permission to change the selected employee
            if (!context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                try {
                    // Retrieve the current employee ID — the manager check below needs one (an empty id
                    // used to be dropped from the where, degrading it to "the team has any manager").
                    const employeeId = context_1.RequestContext.currentEmployeeId();
                    if (!employeeId) {
                        throw new common_1.ForbiddenException('You do not have sufficient permissions to perform this action.');
                    }
                    // Verify if the employee has a manager role in the organization and team
                    await this.findOneByWhereOptions({
                        employeeId,
                        role: { name: contracts_1.RolesEnum.MANAGER },
                        ...whereClause
                    });
                    // If the employee is a manager, proceed with the update
                    return await super.update({ id: memberId, ...whereClause }, entity);
                }
                catch (error) {
                    throw new common_1.ForbiddenException('You do not have sufficient permissions to perform this action.');
                }
            }
            // If user has permission, proceed with the update
            return await super.update({ id: memberId, ...whereClause }, entity);
        }
        catch (error) {
            throw new common_1.ForbiddenException('An error occurred while updating the organization team member.');
        }
    }
    /**
     * Update organization team member active task entity
     *
     * @param memberId - The ID of the organization team member to update
     * @param entity - The input data for updating the active task
     * @returns The updated OrganizationTeamEmployee or UpdateResult
     */
    async updateActiveTask(memberId, entity) {
        try {
            const { organizationId, organizationTeamId, activeTaskId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId();
            // Create a where clause for the employee
            const whereClause = {
                tenantId,
                organizationId,
                organizationTeamId
            };
            // Admins and Super Admins can update the activeTaskId of any employee
            if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                const member = await this.findOneByWhereOptions({
                    id: memberId,
                    ...whereClause
                });
                // Update the active task ID
                return await super.update(member.id, { activeTaskId });
            }
            // Non-admin: Employee must update their own task or manage their team as a manager
            const employeeId = context_1.RequestContext.currentEmployeeId();
            if (employeeId) {
                // Check if employee is a manager of the team
                let isManager = false;
                try {
                    await this.findOneByWhereOptions({
                        ...whereClause,
                        role: { name: contracts_1.RolesEnum.MANAGER }
                    });
                    isManager = true;
                }
                catch {
                    // Employee is not a manager
                }
                if (isManager) {
                    // Manager can update any team member's active task
                    // Bypass the employee filter since manager authorization is verified
                    const member = await this.withoutEmployeeFilter(() => this.findOneByWhereOptions({ ...whereClause, id: memberId }));
                    // Update the active task ID
                    return await super.update({ id: member.id, organizationId, organizationTeamId, tenantId }, { activeTaskId });
                }
                // Non-manager can only update their own active task
                whereClause.employeeId = employeeId;
                const member = await this.findOneByWhereOptions(whereClause);
                // Update the active task ID
                return await super.update({ id: member.id, organizationId, organizationTeamId, tenantId }, { activeTaskId });
            }
            throw new common_1.ForbiddenException('You do not have permission to update this active task.');
        }
        catch (error) {
            throw new common_1.ForbiddenException('An error occurred while updating the active task.');
        }
    }
    /**
     * Delete a team member by their ID.
     *
     * @param memberId - ID of the team member to delete
     * @param options - Options for the team member find query
     * @returns A promise resolving to the result of the deletion operation
     */
    async deleteTeamMember(memberId, options) {
        const { organizationId, organizationTeamId } = options;
        const tenantId = context_1.RequestContext.currentTenantId() || options.tenantId;
        // create a where clause for the employee
        const whereClause = {
            tenantId,
            organizationId,
            organizationTeamId
        };
        try {
            if (context_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.CHANGE_SELECTED_EMPLOYEE)) {
                // Get member
                const member = await this.findOneByWhereOptions({
                    id: memberId,
                    ...whereClause
                });
                // Unassign employee all tasks before removing from team
                await this._taskService.unassignEmployeeFromTeamTasks(member.employeeId, organizationTeamId);
                // Remove the team member
                return await this.delete(member.id);
            }
            else {
                const employeeId = context_1.RequestContext.currentEmployeeId();
                // Check if the current user has an employee context
                if (!employeeId) {
                    throw new common_1.ForbiddenException('You do not have permission to delete this team member.');
                }
                // Check if employee is a manager of the team
                let isManager = false;
                try {
                    await this.findOneByWhereOptions({
                        ...whereClause,
                        role: { name: contracts_1.RolesEnum.MANAGER }
                    });
                    isManager = true;
                }
                catch {
                    // Employee is not a manager
                }
                if (isManager) {
                    // Manager can delete any team member
                    // Bypass the employee filter since manager authorization is verified
                    const member = await this.withoutEmployeeFilter(() => this.findOneByWhereOptions({ ...whereClause, id: memberId }));
                    // Unassign employee all tasks before removing from the team
                    await this._taskService.unassignEmployeeFromTeamTasks(member.employeeId, organizationTeamId);
                    // Remove the team member
                    return await this.delete(member.id);
                }
                // Non-manager can only remove themselves from the team
                whereClause.employeeId = employeeId;
                const member = await this.findOneByWhereOptions(whereClause);
                // Unassign employee all tasks before removing from the team
                await this._taskService.unassignEmployeeFromTeamTasks(member.employeeId, organizationTeamId);
                // Remove the team member
                return await this.delete(member.id);
            }
        }
        catch (error) {
            throw new common_1.ForbiddenException('An error occurred while deleting the team member.');
        }
    }
};
exports.OrganizationTeamEmployeeService = OrganizationTeamEmployeeService;
exports.OrganizationTeamEmployeeService = OrganizationTeamEmployeeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
        mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository,
        cqrs_1.EventBus,
        task_service_1.TaskService,
        entity_subscription_service_1.EntitySubscriptionService])
], OrganizationTeamEmployeeService);
//# sourceMappingURL=organization-team-employee.service.js.map