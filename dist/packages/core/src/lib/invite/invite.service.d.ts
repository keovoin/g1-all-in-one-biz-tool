import { CommandBus } from '@nestjs/cqrs';
import { FindOptionsWhere } from 'typeorm';
import { ConfigService } from '@gauzy/config';
import { ICreateEmailInvitesInput, ICreateEmailInvitesOutput, IUser, ICreateOrganizationContactInviteInput, LanguagesEnum, IOrganization, IEmployee, IInvite, IInviteResendInput, InviteActionEnum, IUserRegistrationInput, IPagination, ID } from '@gauzy/contracts';
import { IAppIntegrationConfig } from '@gauzy/common';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { EmailService } from './../email-send/email.service';
import { UserService } from '../user/user.service';
import { RoleService } from './../role/role.service';
import { OrganizationService } from './../organization/organization.service';
import { OrganizationTeamService } from './../organization-team/organization-team.service';
import { OrganizationDepartmentService } from './../organization-department/organization-department.service';
import { OrganizationContactService } from './../organization-contact/organization-contact.service';
import { OrganizationProjectService } from './../organization-project/organization-project.service';
import { AuthService } from './../auth/auth.service';
import { UserOrganizationService } from './../user-organization/user-organization.services';
import { TypeOrmUserRepository } from '../user/repository/type-orm-user.repository';
import { MikroOrmUserRepository } from '../user/repository/mikro-orm-user.repository';
import { TypeOrmEmployeeRepository } from '../employee/repository/type-orm-employee.repository';
import { MikroOrmEmployeeRepository } from '../employee/repository/mikro-orm-employee.repository';
import { TypeOrmOrganizationTeamEmployeeRepository } from '../organization-team-employee/repository/type-orm-organization-team-employee.repository';
import { MikroOrmOrganizationTeamEmployeeRepository } from '../organization-team-employee/repository/mikro-orm-organization-team-employee.repository';
import { TypeOrmInviteRepository } from './repository/type-orm-invite.repository';
import { MikroOrmInviteRepository } from './repository/mikro-orm-invite.repository';
import { Invite } from './invite.entity';
export declare class InviteService extends TenantAwareCrudService<Invite> {
    readonly typeOrmInviteRepository: TypeOrmInviteRepository;
    readonly mikroOrmInviteRepository: MikroOrmInviteRepository;
    readonly typeOrmUserRepository: TypeOrmUserRepository;
    readonly mikroOrmUserRepository: MikroOrmUserRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    readonly mikroOrmEmployeeRepository: MikroOrmEmployeeRepository;
    readonly typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository;
    readonly mikroOrmOrganizationTeamEmployeeRepository: MikroOrmOrganizationTeamEmployeeRepository;
    private readonly configService;
    private readonly emailService;
    private readonly organizationContactService;
    private readonly organizationDepartmentService;
    private readonly organizationProjectService;
    private readonly organizationService;
    private readonly organizationTeamService;
    private readonly roleService;
    private readonly userService;
    private readonly authService;
    private readonly commandBus;
    private readonly userOrganizationService;
    constructor(typeOrmInviteRepository: TypeOrmInviteRepository, mikroOrmInviteRepository: MikroOrmInviteRepository, typeOrmUserRepository: TypeOrmUserRepository, mikroOrmUserRepository: MikroOrmUserRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, mikroOrmEmployeeRepository: MikroOrmEmployeeRepository, typeOrmOrganizationTeamEmployeeRepository: TypeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository: MikroOrmOrganizationTeamEmployeeRepository, configService: ConfigService, emailService: EmailService, organizationContactService: OrganizationContactService, organizationDepartmentService: OrganizationDepartmentService, organizationProjectService: OrganizationProjectService, organizationService: OrganizationService, organizationTeamService: OrganizationTeamService, roleService: RoleService, userService: UserService, authService: AuthService, commandBus: CommandBus, userOrganizationService: UserOrganizationService);
    /**
     * Fetches organization-related data in parallel.
     *
     * @param projectIds - An array of project IDs.
     * @param departmentIds - An array of department IDs.
     * @param organizationContactIds - An array of organization contact IDs.
     * @param teamIds - An array of team IDs.
     * @param organizationId - The current organization ID.
     * @param tenantId - The current tenant ID.
     * @returns An object containing projects, departments, organizationContacts, and organizationTeams.
     */
    fetchInvitesRelations(projectIds: ID[] | undefined, departmentIds: ID[] | undefined, organizationContactIds: ID[] | undefined, teamIds: ID[] | undefined, organizationId: ID, tenantId: ID): Promise<{
        projects: any[];
        departments: any[];
        organizationContacts: any[];
        organizationTeams: any[];
    }>;
    /**
     * Creates all invites. If an email Id already exists, this function will first delete
     * the existing invite and then create a new row with the email address.
     * @param emailInvites Emails Ids to send invite
     */
    createBulk(input: ICreateEmailInvitesInput, languageCode: LanguagesEnum): Promise<ICreateEmailInvitesOutput>;
    /**
     * Generates the register URL for accepting invites.
     * @param origin - The base URL.
     * @param email - The email of the invitee.
     * @param token - The token for the invite.
     * @returns The full URL with query parameters.
     */
    private createAcceptInvitationUrl;
    /**
     * Creates a query parameters string from an object of query parameters.
     * @param queryParams An object containing query parameters.
     * @returns A string representation of the query parameters.
     */
    private buildQueryString;
    /**
     * Generates an invite code and a secure JWT token for email-based invites.
     *
     * @param {string} email - The email address for which the invite code and token are generated.
     * @returns {{ code: string; token: string }} - An object containing the invite code and JWT token.
     */
    private generateInviteCodeAndToken;
    resendEmail(input: IInviteResendInput, languageCode: LanguagesEnum): Promise<any>;
    /**
     * Sends an acceptance invitation email to all super admin users of the given organization.
     *
     * @param organization - The organization details.
     * @param employee - The employee who accepted the invitation.
     * @param languageCode - The language code for the email.
     * @returns A promise that resolves when all emails have been sent.
     */
    sendAcceptInvitationEmail(organization: IOrganization, employee: IEmployee, languageCode: LanguagesEnum): Promise<void>;
    /**
     * Creates an invite for an organization contact and sends an invitation email.
     *
     * @param input - The invitation input containing email, role, organization contact,
     *                organization, and inviter details.
     * @returns A promise that resolves with the created invite.
     */
    createOrganizationContactInvite(input: ICreateOrganizationContactInviteInput): Promise<Invite>;
    /**
     * Check, if invite exist or expired for user
     * Validate invited by token
     *
     * @param where
     * @returns
     */
    validateByToken(where: FindOptionsWhere<Invite>): Promise<IInvite>;
    /**
     * Validate invited by code
     *
     * @param where
     * @returns
     */
    validateByCode(where: FindOptionsWhere<Invite>): Promise<IInvite>;
    createToken(email: string): string;
    /**
     * Find All Invites Using Pagination
     *
     * @param options
     * @returns
     */
    findAllInvites(options: BaseQueryDTO<any>): Promise<IPagination<Invite>>;
    /**
     * Finds invites associated with the current user.
     * Retrieves invite items and total count based on the current user's email, status, and expiry date.
     * Supports different ORMs (Object-Relational Mappers): MikroORM and TypeORM.
     *
     * @returns An object containing an array of invite items and the total count of invites.
     */
    getCurrentUserInvites(): Promise<IPagination<IInvite>>;
    /**
     * Handle the response to an invitation action.
     *
     * @param id The ID of the invitation.
     * @param action The action to be performed (accept or reject).
     * @param origin The origin from which the request originated.
     * @param languageCode The language code for localization.
     * @returns A promise that resolves to the updated invitation.
     */
    handleInvitationResponse(id: ID, action: InviteActionEnum, origin: string, languageCode: LanguagesEnum): Promise<IInvite>;
    /**
     * Create a new user.
     *
     * @param input The input data for user registration and integration configuration.
     * @param organizationTeamId The ID of the organization team to associate the user with.
     * @param languageCode The language code for localization.
     * @returns A promise that resolves to the created user.
     */
    createUser(input: IUserRegistrationInput & Partial<IAppIntegrationConfig>, organizationTeamId: ID, languageCode: LanguagesEnum): Promise<IUser>;
    /**
     * Atomically claims an invite for acceptance, flipping INVITED -> ACCEPTED.
     *
     * The expected prior status stays in the WHERE clause, which makes the write its own check:
     * whichever concurrent acceptance wins the row updates it and gets a non-zero count, and every
     * other one matches nothing and gets 0.
     *
     * Callers MUST claim BEFORE registering a user or creating any membership. Validating the
     * invite and only marking it accepted afterwards — as these flows used to — let two parallel
     * acceptances of one invite each run a full registration, because neither had committed
     * anything the other could see.
     *
     * @param inviteId - The invite to claim.
     * @param userId - Optional user ID to associate with the invite.
     * @returns `true` if this call claimed the invite, `false` if it was no longer INVITED.
     */
    claimInvite(inviteId: ID, userId?: ID): Promise<boolean>;
    /**
     * Atomically rejects an invite, flipping INVITED -> REJECTED.
     *
     * Same guard as {@link claimInvite}, for the same reason: rejection is the other exit from
     * INVITED, and an unguarded write by id would let a reject racing an accept overwrite an invite
     * that has already registered a user, destroying the record of who consumed it.
     *
     * Goes straight to the repositories rather than through `update()`. Invite rejection is a
     * PUBLIC endpoint, and passing object criteria to `TenantAwareCrudService.update` routes them
     * to `findOneByWhereOptions`, which dereferences `RequestContext.currentUser().tenantId` and
     * throws when there is no authenticated user.
     *
     * @param inviteId - The invite to reject.
     * @returns `true` if this call rejected the invite, `false` if it was no longer INVITED.
     */
    rejectInvite(inviteId: ID): Promise<boolean>;
    /**
     * Hands a claimed invite back to INVITED after acceptance failed part-way through.
     *
     * Claiming up front is what guarantees single use, but it also means a registration that then
     * throws would strand the invite as ACCEPTED with nobody attached, forcing an admin to re-issue
     * it. This restores it instead. Best-effort by design: a failed release costs a re-invite,
     * whereas a failed claim would cost a duplicate acceptance, so only the claim may block.
     *
     * @param inviteId - The invite to release.
     */
    releaseInvite(inviteId: ID): Promise<void>;
    /**
     * Update invite status using the active ORM.
     *
     * @param inviteId - The invite ID to update
     * @param status - The new invite status
     * @param userId - Optional user ID to associate with the invite
     */
    private updateInviteStatus;
}
