"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteAcceptEmployeeHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const auth_service_1 = require("../../../auth/auth.service");
const invite_service_1 = require("../../invite.service");
const invite_accept_employee_command_1 = require("../invite.accept-employee.command");
const internal_1 = require("./../../../core/entities/internal");
const type_orm_employee_repository_1 = require("../../../employee/repository/type-orm-employee.repository");
const type_orm_organization_contact_repository_1 = require("../../../organization-contact/repository/type-orm-organization-contact.repository");
const type_orm_organization_department_repository_1 = require("../../../organization-department/repository/type-orm-organization-department.repository");
const type_orm_organization_project_repository_1 = require("../../../organization-project/repository/type-orm-organization-project.repository");
const type_orm_organization_team_repository_1 = require("../../../organization-team/repository/type-orm-organization-team.repository");
const type_orm_user_repository_1 = require("../../../user/repository/type-orm-user.repository");
/**
 * Use this command for registering employees.
 * This command first registers a user, then creates an employee entry for the organization.
 * If the above two steps are successful, it finally sets the invitation status to accepted
 */
let InviteAcceptEmployeeHandler = class InviteAcceptEmployeeHandler {
    constructor(inviteService, authService, typeOrmUserRepository, typeOrmEmployeeRepository, typeOrmOrganizationProjectRepository, typeOrmOrganizationContactRepository, typeOrmOrganizationDepartmentRepository, typeOrmOrganizationTeamRepository) {
        this.inviteService = inviteService;
        this.authService = authService;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.typeOrmOrganizationProjectRepository = typeOrmOrganizationProjectRepository;
        this.typeOrmOrganizationContactRepository = typeOrmOrganizationContactRepository;
        this.typeOrmOrganizationDepartmentRepository = typeOrmOrganizationDepartmentRepository;
        this.typeOrmOrganizationTeamRepository = typeOrmOrganizationTeamRepository;
    }
    /**
     * Executes the invite acceptance process for an employee.
     * @param command The command containing the invite acceptance data.
     * @returns The user associated with the invite.
     */
    async execute(command) {
        const { input, languageCode } = command;
        const { inviteId } = input;
        const invite = await this.findInviteWithRelations(inviteId);
        const { organization } = invite;
        if (!organization.invitesAllowed) {
            throw new Error('Organization no longer allows invites');
        }
        // Claim the invite BEFORE registering anyone — see InviteService.claimInvite. Everything
        // above this line is a read, so two parallel acceptances of the same invite are both still
        // live here; the conditional flip to ACCEPTED is what picks a single winner.
        if (!(await this.inviteService.claimInvite(inviteId))) {
            throw new common_1.ConflictException('Invite has already been accepted');
        }
        let user;
        let employee;
        try {
            // Inner try/catch is find-or-register control flow, not error handling: a missing
            // employee user is the signal to create one.
            try {
                // Find existing employee user
                user = await this.findExistingEmployeeUser(invite);
                // Implementation to find an employee by user ID
                employee = await this.findEmployee(user.id);
            }
            catch (error) {
                // New user registers before accepting the invitation
                user = await this.registerNewUser(input, invite, languageCode);
                // Create employee after creating user
                employee = await this.createEmployee(invite, user);
            }
            // Implementation for updating employee memberships based on the invite details
            await this.updateEmployeeMemberships(invite, employee);
        }
        catch (error) {
            // Nothing consumed the invite after all — hand it back rather than stranding it as
            // ACCEPTED with no employee attached.
            await this.inviteService.releaseInvite(inviteId);
            throw error;
        }
        // Attach the accepted user; the status itself was already claimed above.
        await this.updateInviteStatus(inviteId, user.id);
        return user;
    }
    /**
     * Finds an invite by its ID and loads its relations.
     * @param inviteId The ID of the invite to find.
     * @returns The found invite with its relations.
     * @throws NotFoundException if the invite does not exist.
     */
    async findInviteWithRelations(inviteId) {
        const invite = await this.inviteService.findOneByIdString(inviteId, {
            relations: {
                projects: { members: true },
                departments: { members: true },
                organizationContacts: { members: true },
                teams: { members: true },
                organization: true
            }
        });
        if (!invite) {
            throw new common_1.NotFoundException('Invite does not exist');
        }
        return invite;
    }
    /**
     * Finds an existing employee user based on the invite details.
     * @param invite The invite containing the user's email and tenant ID.
     * @returns The found user.
     */
    async findExistingEmployeeUser(invite) {
        const { tenantId, email } = invite;
        return await this.typeOrmUserRepository.findOneOrFail({
            where: {
                email,
                tenantId,
                role: { name: contracts_1.RolesEnum.EMPLOYEE }
            },
            order: { createdAt: 'DESC' }
        });
    }
    /**
     * Registers a new user based on the invite details.
     * @param input The user registration input and app integration config.
     * @param invite The invite containing the organization details.
     * @param languageCode The language code for localization.
     * @returns The registered user.
     */
    async registerNewUser(input, invite, languageCode) {
        const { id: organizationId, tenantId } = invite.organization;
        return await this.authService.register({
            ...input,
            user: { ...input.user, tenant: { id: tenantId } },
            organizationId,
            inviteId: invite.id
        }, languageCode);
    }
    /**
     * Creates an employee based on the invite details and user information.
     * @param invite The invite containing the organization details.
     * @param user The user to be associated with the employee.
     * @returns The created employee.
     */
    async createEmployee(invite, user) {
        const { organization, tenantId, actionDate } = invite;
        // Create employee after creating user
        const employee = this.typeOrmEmployeeRepository.create({
            user,
            organization,
            tenantId,
            startedWorkOn: actionDate || null,
            isActive: true,
            isArchived: false
        });
        return await this.typeOrmEmployeeRepository.save(employee);
    }
    /**
     * Finds an employee based on the user ID.
     * @param userId The ID of the user to find the employee for.
     * @returns The found employee.
     */
    async findEmployee(userId) {
        return await this.typeOrmEmployeeRepository.findOneOrFail({
            where: { userId, user: { id: userId } }
        });
    }
    /**
     * Associates an already-claimed invite with the user who accepted it.
     *
     * The ACCEPTED status is set by `InviteService.claimInvite` before registration, so this only
     * records the resulting user — writing the status here as well would reopen the race it closes.
     *
     * @param inviteId The ID of the invite to update.
     * @param userId The ID of the user who accepted the invite.
     * @returns The updated invite or the update result.
     */
    async updateInviteStatus(inviteId, userId) {
        return await this.inviteService.update(inviteId, {
            userId
        });
    }
    /**
     * Update employee memberships
     *
     * @param invite
     * @param employee
     */
    async updateEmployeeMemberships(invite, employee) {
        // Update organization Contacts members
        if (invite.organizationContacts) {
            await Promise.all(invite.organizationContacts.map(async (organizationContact) => {
                let members = organizationContact.members || [];
                members = [...members, employee];
                /**
                 * Creates a new entity instance and copies all entity properties from this object into a new entity.
                 */
                const create = this.typeOrmOrganizationContactRepository.create({
                    ...organizationContact,
                    members
                });
                // This will call save() on the project (and not really create a new organization contact)
                await this.typeOrmOrganizationContactRepository.save(create);
            }));
        }
        // Update department members
        if (invite.departments) {
            await Promise.all(invite.departments.map(async (department) => {
                let members = department.members || [];
                members = [...members, employee];
                /**
                 * Creates a new entity instance and copies all entity properties from this object into a new entity.
                 */
                const create = this.typeOrmOrganizationDepartmentRepository.create({
                    ...department,
                    members
                });
                // This will call save() on the department (and not really create a new organization department)
                await this.typeOrmOrganizationDepartmentRepository.save(create);
            }));
        }
        // Update team members
        if (invite.teams) {
            await Promise.all(invite.teams.map(async (team) => {
                let members = team.members || [];
                // Create new team member
                const member = new internal_1.OrganizationTeamEmployee();
                member.organizationId = employee.organizationId;
                member.tenantId = employee.tenantId;
                member.employee = employee;
                // Add member to team
                members = [...members, member];
                /**
                 * Creates a new entity instance and copies all entity properties from this object into a new entity.
                 */
                const create = this.typeOrmOrganizationTeamRepository.create({
                    ...team,
                    members
                });
                // This will call save() on the department (and not really create a new organization department)
                await this.typeOrmOrganizationTeamRepository.save(create);
            }));
        }
        // Update project members
        if (invite.projects) {
            await Promise.all(invite.projects.map(async (project) => {
                // Get existing project members
                let members = project.members || [];
                // Create new project member
                const member = new internal_1.OrganizationProjectEmployee();
                member.employee = employee;
                member.organizationId = employee.organizationId;
                member.tenantId = employee.tenantId;
                // Add member to project
                members = [...members, member];
                // Create new project
                const create = this.typeOrmOrganizationProjectRepository.create({
                    ...project,
                    members
                });
                // This will call save() on the project (and not really create a new organization project)
                await this.typeOrmOrganizationProjectRepository.save(create);
            }));
        }
    }
};
exports.InviteAcceptEmployeeHandler = InviteAcceptEmployeeHandler;
exports.InviteAcceptEmployeeHandler = InviteAcceptEmployeeHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_accept_employee_command_1.InviteAcceptEmployeeCommand),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService,
        auth_service_1.AuthService,
        type_orm_user_repository_1.TypeOrmUserRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        type_orm_organization_project_repository_1.TypeOrmOrganizationProjectRepository,
        type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
        type_orm_organization_department_repository_1.TypeOrmOrganizationDepartmentRepository,
        type_orm_organization_team_repository_1.TypeOrmOrganizationTeamRepository])
], InviteAcceptEmployeeHandler);
//# sourceMappingURL=invite.accept-employee.handler.js.map