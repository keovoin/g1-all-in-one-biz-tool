"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const jsonwebtoken_1 = require("jsonwebtoken");
const typeorm_1 = require("typeorm");
const date_fns_1 = require("date-fns");
const underscore_1 = require("underscore");
const config_1 = require("@gauzy/config");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const crud_1 = require("./../core/crud");
const context_1 = require("./../core/context");
const utils_2 = require("./../core/utils");
const util_1 = require("./../core/util");
const email_service_1 = require("./../email-send/email.service");
const user_service_1 = require("../user/user.service");
const role_service_1 = require("./../role/role.service");
const organization_service_1 = require("./../organization/organization.service");
const organization_team_service_1 = require("./../organization-team/organization-team.service");
const organization_department_service_1 = require("./../organization-department/organization-department.service");
const organization_contact_service_1 = require("./../organization-contact/organization-contact.service");
const organization_project_service_1 = require("./../organization-project/organization-project.service");
const auth_service_1 = require("./../auth/auth.service");
const user_organization_services_1 = require("./../user-organization/user-organization.services");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const mikro_orm_user_repository_1 = require("../user/repository/mikro-orm-user.repository");
const type_orm_employee_repository_1 = require("../employee/repository/type-orm-employee.repository");
const mikro_orm_employee_repository_1 = require("../employee/repository/mikro-orm-employee.repository");
const type_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/type-orm-organization-team-employee.repository");
const mikro_orm_organization_team_employee_repository_1 = require("../organization-team-employee/repository/mikro-orm-organization-team-employee.repository");
const type_orm_invite_repository_1 = require("./repository/type-orm-invite.repository");
const mikro_orm_invite_repository_1 = require("./repository/mikro-orm-invite.repository");
const invite_entity_1 = require("./invite.entity");
const commands_1 = require("./commands");
const claim_criteria_1 = require("../shared/single-use/claim-criteria");
let InviteService = class InviteService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmInviteRepository, mikroOrmInviteRepository, typeOrmUserRepository, mikroOrmUserRepository, typeOrmEmployeeRepository, mikroOrmEmployeeRepository, typeOrmOrganizationTeamEmployeeRepository, mikroOrmOrganizationTeamEmployeeRepository, configService, emailService, organizationContactService, organizationDepartmentService, organizationProjectService, organizationService, organizationTeamService, roleService, userService, authService, commandBus, userOrganizationService) {
        super(typeOrmInviteRepository, mikroOrmInviteRepository);
        this.typeOrmInviteRepository = typeOrmInviteRepository;
        this.mikroOrmInviteRepository = mikroOrmInviteRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.mikroOrmUserRepository = mikroOrmUserRepository;
        this.typeOrmEmployeeRepository = typeOrmEmployeeRepository;
        this.mikroOrmEmployeeRepository = mikroOrmEmployeeRepository;
        this.typeOrmOrganizationTeamEmployeeRepository = typeOrmOrganizationTeamEmployeeRepository;
        this.mikroOrmOrganizationTeamEmployeeRepository = mikroOrmOrganizationTeamEmployeeRepository;
        this.configService = configService;
        this.emailService = emailService;
        this.organizationContactService = organizationContactService;
        this.organizationDepartmentService = organizationDepartmentService;
        this.organizationProjectService = organizationProjectService;
        this.organizationService = organizationService;
        this.organizationTeamService = organizationTeamService;
        this.roleService = roleService;
        this.userService = userService;
        this.authService = authService;
        this.commandBus = commandBus;
        this.userOrganizationService = userOrganizationService;
    }
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
    async fetchInvitesRelations(projectIds, departmentIds, organizationContactIds, teamIds, organizationId, tenantId) {
        const [projects, departments, organizationContacts, organizationTeams] = await Promise.all([
            (0, utils_2.retryQuery)(() => this.organizationProjectService.find({
                where: { id: (0, typeorm_1.In)(projectIds ?? []), organizationId, tenantId }
            })),
            (0, utils_2.retryQuery)(() => this.organizationDepartmentService.find({
                where: { id: (0, typeorm_1.In)(departmentIds ?? []), organizationId, tenantId }
            })),
            (0, utils_2.retryQuery)(() => this.organizationContactService.find({
                where: { id: (0, typeorm_1.In)(organizationContactIds ?? []), organizationId, tenantId }
            })),
            (0, utils_2.retryQuery)(() => this.organizationTeamService.find({
                where: { id: (0, typeorm_1.In)(teamIds ?? []), organizationId, tenantId }
            }))
        ]);
        return { projects, departments, organizationContacts, organizationTeams };
    }
    /**
     * Creates all invites. If an email Id already exists, this function will first delete
     * the existing invite and then create a new row with the email address.
     * @param emailInvites Emails Ids to send invite
     */
    async createBulk(input, languageCode) {
        const originUrl = this.configService.get('clientBaseUrl');
        const tenantId = context_1.RequestContext.currentTenantId() ?? input.tenantId;
        const { emailIds = [], projectIds = [], organizationContactIds = [], departmentIds = [], teamIds = [], roleId, organizationId, startedWorkOn, appliedDate, invitationExpirationPeriod, fullName, callbackUrl, queryParams } = input;
        /**
         * Fetch organization-related data in parallel.
         */
        const { projects, departments, organizationContacts, organizationTeams } = await this.fetchInvitesRelations(projectIds, departmentIds, organizationContactIds, teamIds, organizationId, tenantId);
        /**
         * Retrieve the invited user and organization.
         */
        const invitedByUserId = context_1.RequestContext.currentUserId();
        const invitedByUser = await this.userService.findOneByIdString(invitedByUserId, {
            relations: { role: true }
        });
        // Invited Role
        let role;
        try {
            const currentRoleId = context_1.RequestContext.currentRoleId();
            // Ensure the current role can only invite others with the 'EMPLOYEE' role
            role = await this.roleService.findOneByIdString(currentRoleId, {
                where: { name: contracts_1.RolesEnum.EMPLOYEE }
            });
        }
        catch (error) {
            // If the current role is not an 'EMPLOYEE' role, fallback to specified 'roleId'
            role = await this.roleService.findOneByIdString(roleId);
            // Handle unauthorized access if the invitedByUser is not a 'SUPER_ADMIN'
            if (role.name === contracts_1.RolesEnum.SUPER_ADMIN && invitedByUser.role.name !== contracts_1.RolesEnum.SUPER_ADMIN) {
                throw new common_1.UnauthorizedException();
            }
        }
        // Invited Organization
        const organization = await this.organizationService.findOneByIdString(organizationId);
        // Build the "where" clause based on provided conditions.
        const expireDate = invitationExpirationPeriod === contracts_1.InvitationExpirationEnum.NEVER
            ? null
            : (0, date_fns_1.addDays)(new Date(), Number(invitationExpirationPeriod ?? organization.inviteExpiryPeriod) ||
                constants_1.DEFAULT_INVITE_EXPIRY_PERIOD);
        // Build the overall query options.
        const queryOptions = {
            where: {
                tenantId,
                ...((0, utils_1.isNotEmpty)(organizationId) && { organizationId }),
                ...((0, utils_1.isNotEmpty)(emailIds) && { email: (0, typeorm_1.In)(emailIds) })
            },
            ...((0, utils_1.isNotEmpty)(teamIds) && { relations: { teams: true } })
        };
        const { items: existedInvites } = await this.findAll(queryOptions);
        let ignoreInvites = 0;
        const invites = [];
        for await (const email of emailIds) {
            const code = (0, utils_1.generateAlphaNumericCode)();
            const token = (0, jsonwebtoken_1.sign)({ email, code }, config_1.environment.JWT_SECRET, {});
            // Retrieve organization team employees for the email.
            const organizationTeamEmployees = await this.typeOrmOrganizationTeamEmployeeRepository.findBy({
                employee: { user: { email } },
                organizationTeamId: (0, typeorm_1.In)(teamIds)
            });
            // Retrieve the IDs of the teams the user is already in.
            const alreadyInTeamIds = organizationTeamEmployees.length > 0
                ? organizationTeamEmployees.map((emp) => emp.organizationTeamId)
                : [];
            // Retrieve the invites that match the email and teams.
            const matchedInvites = existedInvites.filter(({ email: inviteEmail, teams }) => inviteEmail === email && (0, utils_2.getArrayIntersection)(teams?.map(({ id }) => id) ?? [], teamIds).length > 0);
            // Determine teams to invite.
            let teamsToInvite;
            if ((0, utils_1.isNotEmpty)(matchedInvites)) {
                // Check if all invites are already sent.
                const allInvitesNotSent = matchedInvites.every((invite) => invite.status !== contracts_1.InviteStatusEnum.INVITED);
                // Determine teams to invite.
                teamsToInvite = allInvitesNotSent
                    ? organizationTeams.filter((team) => !alreadyInTeamIds.includes(team.id))
                    : [];
                if ((0, utils_1.isEmpty)(teamsToInvite)) {
                    ignoreInvites++;
                    continue;
                }
            }
            else {
                teamsToInvite = organizationTeams;
            }
            // Create a new Invite instance with common properties.
            invites.push(new invite_entity_1.Invite({
                token,
                email,
                roleId,
                organizationId,
                tenantId,
                invitedByUserId,
                status: contracts_1.InviteStatusEnum.INVITED,
                expireDate,
                actionDate: startedWorkOn ?? appliedDate,
                code,
                fullName,
                projects,
                teams: teamsToInvite,
                departments,
                organizationContacts
            }));
        }
        const items = await this.saveMany(invites);
        items.forEach((item) => {
            let inviteLink = this.createAcceptInvitationUrl(originUrl, item.email, item.token);
            if (input.inviteType === contracts_1.InvitationTypeEnum.TEAM && callbackUrl) {
                // Convert query params object to string
                const queryParamsString = this.buildQueryString({
                    email: item.email,
                    code: item.code
                });
                inviteLink = [callbackUrl, queryParamsString].filter(Boolean).join('?'); // Combine current URL with updated query params
            }
            else if (callbackUrl && queryParams) {
                // Build custom query params from invite properties
                const queryParamsObject = Object.entries(queryParams).reduce((acc, [key, value]) => {
                    const propertyValue = item[value];
                    if (typeof propertyValue !== 'undefined') {
                        if (typeof propertyValue === 'string' ||
                            typeof propertyValue === 'number' ||
                            typeof propertyValue === 'boolean') {
                            acc[key] = String(propertyValue);
                        }
                    }
                    return acc;
                }, {});
                const queryParamsString = this.buildQueryString(queryParamsObject);
                inviteLink = [callbackUrl, queryParamsString].filter(Boolean).join('?');
            }
            switch (input.inviteType) {
                case contracts_1.InvitationTypeEnum.USER:
                    this.emailService.inviteUser({
                        email: item.email,
                        role: role.name,
                        organization,
                        registerUrl: inviteLink,
                        originUrl,
                        languageCode,
                        invitedByUser
                    });
                    break;
                case contracts_1.InvitationTypeEnum.EMPLOYEE:
                case contracts_1.InvitationTypeEnum.CANDIDATE:
                    this.emailService.inviteEmployee({
                        email: item.email,
                        registerUrl: inviteLink,
                        organizationContacts,
                        departments,
                        originUrl,
                        organization,
                        languageCode,
                        invitedByUser
                    });
                    break;
                case contracts_1.InvitationTypeEnum.TEAM:
                    this.emailService.inviteTeamMember({
                        email: item.email,
                        teams: item.teams.map((team) => team.name).join(', '),
                        languageCode,
                        invitedByUser,
                        organization,
                        inviteCode: item.code,
                        inviteLink,
                        originUrl
                    });
                    break;
                default:
                    throw new Error(`Unknown invitation type: ${input.inviteType}`);
            }
        });
        return { items, total: items.length, ignored: ignoreInvites };
    }
    /**
     * Generates the register URL for accepting invites.
     * @param origin - The base URL.
     * @param email - The email of the invitee.
     * @param token - The token for the invite.
     * @returns The full URL with query parameters.
     */
    createAcceptInvitationUrl(origin, email, token) {
        const acceptInviteUrl = `${origin}/#/auth/accept-invite`;
        const queryParamsString = this.buildQueryString({ email, token });
        return [acceptInviteUrl, queryParamsString].filter(Boolean).join('?'); // Combine current URL with updated query params
    }
    /**
     * Creates a query parameters string from an object of query parameters.
     * @param queryParams An object containing query parameters.
     * @returns A string representation of the query parameters.
     */
    buildQueryString(queryParams) {
        return Object.keys(queryParams)
            .map((key) => {
            const value = queryParams[key];
            if (Array.isArray(value)) {
                return value.map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
            }
            else {
                return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
        })
            .join('&');
    }
    /**
     * Generates an invite code and a secure JWT token for email-based invites.
     *
     * @param {string} email - The email address for which the invite code and token are generated.
     * @returns {{ code: string; token: string }} - An object containing the invite code and JWT token.
     */
    generateInviteCodeAndToken(email) {
        // Generate a unique invite code
        const code = (0, utils_1.generateAlphaNumericCode)();
        // Generate a JWT token containing the email and invite code
        const token = (0, jsonwebtoken_1.sign)({ email, code }, config_1.environment.JWT_SECRET, {});
        return { code, token };
    }
    async resendEmail(input, languageCode) {
        const originUrl = this.configService.get('clientBaseUrl');
        const { inviteId, inviteType, callbackUrl } = input;
        // Retrieve the invite
        const invite = await this.findOneByIdString(inviteId, {
            relations: {
                organization: true,
                role: true,
                teams: true
            }
        });
        if (!invite) {
            throw Error('Invite does not exist');
        }
        // Invited organization
        const organization = invite.organization;
        const role = invite.role;
        const email = invite.email;
        const teams = invite.teams;
        /**
         * Invited by the user.
         */
        const invitedByUserId = context_1.RequestContext.currentUserId();
        const invitedByUser = await this.userService.findOneByIdString(invitedByUserId);
        try {
            const { code, token } = this.generateInviteCodeAndToken(email);
            const registerUrl = `${originUrl}/#/auth/accept-invite?email=${encodeURIComponent(email)}&token=${token}`;
            if (inviteType === contracts_1.InvitationTypeEnum.USER) {
                this.emailService.inviteUser({
                    email,
                    role: role.name,
                    organization,
                    registerUrl,
                    originUrl,
                    languageCode,
                    invitedByUser
                });
            }
            else if (inviteType === contracts_1.InvitationTypeEnum.EMPLOYEE || inviteType === contracts_1.InvitationTypeEnum.CANDIDATE) {
                this.emailService.inviteEmployee({
                    email,
                    registerUrl,
                    originUrl,
                    organization,
                    languageCode,
                    invitedByUser
                });
            }
            else if (inviteType === contracts_1.InvitationTypeEnum.TEAM) {
                let inviteLink;
                if (callbackUrl) {
                    inviteLink = `${callbackUrl}?email=${encodeURIComponent(email)}&code=${code}`;
                }
                else {
                    inviteLink = `${registerUrl}`;
                }
                this.emailService.inviteTeamMember({
                    email: email,
                    inviteCode: code,
                    teams: teams.map((team) => team.name).join(', '),
                    languageCode,
                    invitedByUser,
                    organization,
                    inviteLink,
                    originUrl
                });
            }
            return await super.update(inviteId, { status: contracts_1.InviteStatusEnum.INVITED, invitedByUserId, token, code });
        }
        catch (error) {
            return error;
        }
    }
    /**
     * Sends an acceptance invitation email to all super admin users of the given organization.
     *
     * @param organization - The organization details.
     * @param employee - The employee who accepted the invitation.
     * @param languageCode - The language code for the email.
     * @returns A promise that resolves when all emails have been sent.
     */
    async sendAcceptInvitationEmail(organization, employee, languageCode) {
        try {
            const superAdminUsers = await this.userService.getAdminUsers(organization.tenantId);
            if (!superAdminUsers.length) {
                console.warn(`No super admin users found for tenant ${organization.tenantId}`);
                return;
            }
            // Send emails concurrently to all super admin users.
            await Promise.all(superAdminUsers.map(async (superAdmin) => this.emailService.sendAcceptInvitationEmail({
                email: superAdmin.email,
                employee,
                organization,
                languageCode
            })));
        }
        catch (error) {
            console.error(`Error sending accept invitation email: ${error.message}`, error);
            throw new Error(`Error sending accept invitation email: ${error.message}`);
        }
    }
    /**
     * Creates an invite for an organization contact and sends an invitation email.
     *
     * @param input - The invitation input containing email, role, organization contact,
     *                organization, and inviter details.
     * @returns A promise that resolves with the created invite.
     */
    async createOrganizationContactInvite(input) {
        const { emailId, roleId, organizationContactId, organizationId, invitedByUserId, originalUrl, languageCode } = input;
        // Fetch organization contact, organization, and inviting user concurrently.
        const [organizationContact, organization, invitedByUser] = await Promise.all([
            this.organizationContactService.findOneByIdString(organizationContactId),
            this.organizationService.findOneByIdString(organizationId),
            this.userService.findOneByIdString(invitedByUserId)
        ]);
        // Determine the invite expiry period (use default if not provided).
        const inviteExpiryPeriod = organization?.inviteExpiryPeriod ?? constants_1.DEFAULT_INVITE_EXPIRY_PERIOD;
        const expireDate = (0, date_fns_1.addDays)(new Date(), inviteExpiryPeriod);
        // Create and populate the invite object.
        const invite = new invite_entity_1.Invite();
        invite.token = this.createToken(emailId);
        invite.email = emailId;
        invite.roleId = roleId;
        invite.organizationId = organizationId;
        invite.tenantId = context_1.RequestContext.currentTenantId();
        invite.invitedByUserId = invitedByUserId;
        invite.status = contracts_1.InviteStatusEnum.INVITED;
        invite.expireDate = expireDate;
        invite.organizationContacts = [organizationContact];
        // Save the invite to the repository.
        const createdInvite = await this.save(invite);
        // Send the invitation email (fire-and-forget).
        this.emailService.inviteOrganizationContact(organizationContact, invitedByUser, organization, createdInvite, languageCode, originalUrl);
        return createdInvite;
    }
    /**
     * Check, if invite exist or expired for user
     * Validate invited by token
     *
     * @param where
     * @returns
     */
    async validateByToken(where) {
        try {
            const { email, token } = where;
            const payload = (0, jsonwebtoken_1.verify)(token, config_1.environment.JWT_SECRET);
            if (typeof payload === 'object' && 'email' in payload) {
                if (payload.email === email) {
                    switch (this.ormType) {
                        case utils_2.MultiORMEnum.MikroORM: {
                            const item = await this.mikroOrmRepository.findOneOrFail({
                                email,
                                token,
                                status: contracts_1.InviteStatusEnum.INVITED,
                                ...(payload['code'] ? { code: payload['code'] } : {}),
                                $or: [{ expireDate: { $gte: new Date() } }, { expireDate: null }]
                            }, { populate: ['organization'] });
                            return this.serialize(item);
                        }
                        case utils_2.MultiORMEnum.TypeORM:
                        default: {
                            const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                            query.setFindOptions({
                                select: {
                                    id: true,
                                    email: true,
                                    fullName: true,
                                    organization: {
                                        name: true
                                    }
                                },
                                relations: {
                                    organization: true
                                }
                            });
                            query.where((qb) => {
                                qb.andWhere({
                                    email,
                                    token,
                                    status: contracts_1.InviteStatusEnum.INVITED,
                                    ...(payload['code']
                                        ? {
                                            code: payload['code']
                                        }
                                        : {})
                                });
                                qb.andWhere([
                                    {
                                        expireDate: (0, typeorm_1.MoreThanOrEqual)(new Date())
                                    },
                                    {
                                        expireDate: (0, typeorm_1.IsNull)()
                                    }
                                ]);
                            });
                            return await query.getOneOrFail();
                        }
                    }
                }
            }
            throw new common_1.BadRequestException();
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    /**
     * Validate invited by code
     *
     * @param where
     * @returns
     */
    async validateByCode(where) {
        const { email, code } = where;
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const item = await this.mikroOrmRepository.findOneOrFail({
                        email,
                        code,
                        status: contracts_1.InviteStatusEnum.INVITED,
                        $or: [{ expireDate: { $gte: new Date() } }, { expireDate: null }]
                    }, { populate: ['organization'] });
                    return this.serialize(item);
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.setFindOptions({
                        select: {
                            id: true,
                            email: true,
                            fullName: true,
                            organization: {
                                name: true
                            }
                        },
                        relations: {
                            organization: true
                        }
                    });
                    query.where((qb) => {
                        qb.andWhere({
                            email,
                            code,
                            status: contracts_1.InviteStatusEnum.INVITED
                        });
                        qb.andWhere([
                            {
                                expireDate: (0, typeorm_1.MoreThanOrEqual)(new Date())
                            },
                            {
                                expireDate: (0, typeorm_1.IsNull)()
                            }
                        ]);
                    });
                    return await query.getOneOrFail();
                }
            }
        }
        catch (error) {
            console.error(`Can't validate code '${code}' for email '${email}'`, error);
            throw new common_1.BadRequestException();
        }
    }
    createToken(email) {
        const token = (0, jsonwebtoken_1.sign)({ email }, config_1.environment.JWT_SECRET, {});
        return token;
    }
    /**
     * Find All Invites Using Pagination
     *
     * @param options
     * @returns
     */
    async findAllInvites(options) {
        try {
            // Extract special filters from where clause to handle separately
            // These fields need custom handling and should not be spread directly from restWhere
            const { isExpired, email, invitedByUser, role, projects, teams, ...restWhere } = options?.where || {};
            /**
             * Build expireDate filter based on isExpired value.
             * Values may come as "true"/"false" strings from query params or as actual booleans,
             * so we check for both types to ensure proper handling.
             */
            const isExpiredBool = isExpired === true || isExpired === 'true';
            const isNotExpiredBool = isExpired === false || isExpired === 'false';
            // Build email filter with LIKE operator for partial matching
            const emailFilter = email
                ? { email: (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :email`, { email: `%${email}%` }) }
                : {};
            // Build role filter with array support (converts single value to array)
            const roleFilter = (0, utils_1.isNotEmpty)(role) ? { role: { name: (0, typeorm_1.In)(Array.isArray(role) ? role : [role]) } } : {};
            // Build projects filter with defensive array handling
            const projectIds = projects?.id ?? projects;
            const projectsFilter = (0, utils_1.isNotEmpty)(projectIds)
                ? { projects: { id: (0, typeorm_1.In)(Array.isArray(projectIds) ? projectIds : [projectIds]) } }
                : {};
            // Build teams filter with defensive array handling
            const teamIds = teams?.id ?? teams;
            const teamsFilter = (0, utils_1.isNotEmpty)(teamIds)
                ? { teams: { id: (0, typeorm_1.In)(Array.isArray(teamIds) ? teamIds : [teamIds]) } }
                : {};
            /**
             * Builds the base where condition shared by all filter variations.
             * This reduces code duplication when handling firstName/lastName search.
             */
            const buildBaseCondition = () => ({
                tenantId: context_1.RequestContext.currentTenantId(),
                ...((0, utils_1.isNotEmpty)(restWhere) ? restWhere : {}),
                ...emailFilter,
                ...roleFilter,
                ...projectsFilter,
                ...teamsFilter
            });
            /**
             * Builds invitedByUser filter condition for a specific field (firstName or lastName).
             */
            const buildInvitedByUserCondition = (field) => ({
                invitedByUser: {
                    [field]: (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :invitedByUser`, {
                        invitedByUser: `%${invitedByUser}%`
                    })
                }
            });
            /**
             * Build where conditions array.
             * When filtering by invitedByUser, we need OR conditions to search both firstName and lastName.
             * When filtering for non-expired invites, we also include invites with null expireDate (Never expire).
             */
            const buildWhereConditions = () => {
                const conditions = [];
                const baseCondition = buildBaseCondition();
                if (isExpiredBool) {
                    // Filter expired invites (expireDate < now)
                    const expiredCondition = { ...baseCondition, expireDate: (0, typeorm_1.LessThan)(new Date()) };
                    if (invitedByUser) {
                        // Search in both firstName and lastName
                        conditions.push({ ...expiredCondition, ...buildInvitedByUserCondition('firstName') });
                        conditions.push({ ...expiredCondition, ...buildInvitedByUserCondition('lastName') });
                    }
                    else {
                        conditions.push(expiredCondition);
                    }
                }
                else if (isNotExpiredBool) {
                    // Filter non-expired invites (expireDate >= now OR expireDate is null for "Never expire")
                    const notExpiredCondition = { ...baseCondition, expireDate: (0, typeorm_1.MoreThanOrEqual)(new Date()) };
                    const neverExpireCondition = { ...baseCondition, expireDate: (0, typeorm_1.IsNull)() };
                    if (invitedByUser) {
                        // Search in both firstName and lastName for both conditions
                        conditions.push({ ...notExpiredCondition, ...buildInvitedByUserCondition('firstName') });
                        conditions.push({ ...notExpiredCondition, ...buildInvitedByUserCondition('lastName') });
                        conditions.push({ ...neverExpireCondition, ...buildInvitedByUserCondition('firstName') });
                        conditions.push({ ...neverExpireCondition, ...buildInvitedByUserCondition('lastName') });
                    }
                    else {
                        conditions.push(notExpiredCondition);
                        conditions.push(neverExpireCondition);
                    }
                }
                else {
                    // No expireDate filter
                    if (invitedByUser) {
                        conditions.push({ ...baseCondition, ...buildInvitedByUserCondition('firstName') });
                        conditions.push({ ...baseCondition, ...buildInvitedByUserCondition('lastName') });
                    }
                    else {
                        conditions.push(baseCondition);
                    }
                }
                return conditions;
            };
            return await super.findAll({
                ...(options && options.skip
                    ? {
                        skip: options.take * (options.skip - 1)
                    }
                    : {}),
                ...(options && options.take
                    ? {
                        take: options.take
                    }
                    : {}),
                ...(options && options.relations
                    ? {
                        relations: options.relations
                    }
                    : {}),
                where: buildWhereConditions()
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Finds invites associated with the current user.
     * Retrieves invite items and total count based on the current user's email, status, and expiry date.
     * Supports different ORMs (Object-Relational Mappers): MikroORM and TypeORM.
     *
     * @returns An object containing an array of invite items and the total count of invites.
     */
    async getCurrentUserInvites() {
        try {
            let total;
            let items = [];
            const user = context_1.RequestContext.currentUser();
            // Define common parameters for querying
            const options = {
                select: {
                    id: true,
                    expireDate: true,
                    teams: {
                        id: true,
                        name: true
                    }
                },
                where: [
                    {
                        email: user.email,
                        status: contracts_1.InviteStatusEnum.INVITED,
                        expireDate: (0, typeorm_1.MoreThanOrEqual)(new Date()),
                        isActive: true,
                        isArchived: false
                    },
                    {
                        email: user.email,
                        status: contracts_1.InviteStatusEnum.INVITED,
                        expireDate: (0, typeorm_1.IsNull)(),
                        isActive: true,
                        isArchived: false
                    }
                ],
                relations: { teams: true }
            };
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    const { where, mikroOptions } = (0, utils_2.parseTypeORMFindToMikroOrm)(options);
                    [items, total] = (await this.mikroOrmInviteRepository.findAndCount(where, mikroOptions));
                    items = items.map((entity) => this.serialize(entity));
                    break;
                case utils_2.MultiORMEnum.TypeORM:
                    [items, total] = await this.typeOrmInviteRepository.findAndCount(options);
                    break;
                default:
                    throw new Error(`Not implemented for ${this.ormType}`);
            }
            return { items, total };
        }
        catch (error) {
            // Handle the error here, e.g., logging, returning an error response, etc.
            console.error('An error occurred in get current user invites:', error);
            throw new common_1.BadRequestException(error); // Re-throwing the error for higher-level handling if needed
        }
    }
    /**
     * Handle the response to an invitation action.
     *
     * @param id The ID of the invitation.
     * @param action The action to be performed (accept or reject).
     * @param origin The origin from which the request originated.
     * @param languageCode The language code for localization.
     * @returns A promise that resolves to the updated invitation.
     */
    async handleInvitationResponse(id, action, origin, languageCode) {
        try {
            const user = context_1.RequestContext.currentUser();
            const currentTenantId = context_1.RequestContext.currentTenantId();
            const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
            let invitation;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const item = await this.mikroOrmRepository.findOne({
                        id,
                        email: user.email,
                        status: contracts_1.InviteStatusEnum.INVITED,
                        $or: [{ expireDate: { $gte: new Date() } }, { expireDate: null }]
                    }, {
                        populate: ['teams', 'tenant', 'role']
                    });
                    invitation = item ? this.serialize(item) : null;
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    query.setFindOptions({
                        select: {
                            id: true,
                            code: true,
                            token: true,
                            email: true,
                            fullName: true,
                            organizationId: true,
                            invitedByUserId: true,
                            tenantId: true,
                            teams: {
                                id: true,
                                name: true
                            }
                        },
                        relations: {
                            teams: true,
                            tenant: true,
                            role: true
                        }
                    });
                    query.where((qb) => {
                        qb.andWhere({
                            id,
                            email: user.email,
                            status: contracts_1.InviteStatusEnum.INVITED
                        });
                        qb.andWhere([
                            {
                                expireDate: (0, typeorm_1.MoreThanOrEqual)(new Date())
                            },
                            {
                                expireDate: (0, typeorm_1.IsNull)()
                            }
                        ]);
                    });
                    invitation = await query.getOne();
                    break;
                }
            }
            if (!invitation) {
                throw new common_1.NotFoundException('You do not have any invitation.');
            }
            const { fullName, email, tenant, tenantId, role, organizationId, invitedByUserId, id: inviteId, token, code, teams } = invitation;
            let invitedTenantUser;
            if (currentTenantId !== tenantId) {
                invitedTenantUser = await this.typeOrmUserRepository.findOne({
                    where: { email, tenantId },
                    relations: { tenant: true, role: true }
                });
            }
            /**
             * ACCEPTED
             */
            if (action === contracts_1.InviteActionEnum.ACCEPTED) {
                /**
                 * Accepted Case - 1
                 * Current user is belong to invited tenant
                 */
                if (user.tenantId === tenantId) {
                    await this.commandBus.execute(new commands_1.InviteAcceptCommand({
                        user,
                        email,
                        token,
                        code,
                        originalUrl: origin
                    }, languageCode));
                }
                /**
                 * Accepted Case - 2
                 * Current user is already part of invited tenant as separate user
                 */
                if (invitedTenantUser) {
                    // Claim BEFORE adding the employee to the team — see claimInvite. Without it two
                    // parallel acceptances both add the membership and both mark the invite accepted.
                    if (!(await this.claimInvite(inviteId))) {
                        throw new common_1.BadRequestException('Invite has already been accepted');
                    }
                    try {
                        let employee;
                        switch (this.ormType) {
                            case utils_2.MultiORMEnum.MikroORM:
                                employee = await this.mikroOrmEmployeeRepository.findOneOrFail({ userId: invitedTenantUser.id });
                                break;
                            case utils_2.MultiORMEnum.TypeORM:
                            default:
                                employee = await this.typeOrmEmployeeRepository.findOneOrFail({
                                    where: { userId: invitedTenantUser.id }
                                });
                                break;
                        }
                        if (employee) {
                            const [team] = teams;
                            /**
                             * Add employee to invited team
                             */
                            switch (this.ormType) {
                                case utils_2.MultiORMEnum.MikroORM: {
                                    const em = this.mikroOrmOrganizationTeamEmployeeRepository.getEntityManager();
                                    const teamEmployee = em.create('OrganizationTeamEmployee', {
                                        employeeId: employee.id,
                                        organizationTeamId: team.id,
                                        roleId: invitedTenantUser.roleId,
                                        tenantId,
                                        organizationId
                                    });
                                    await em.persistAndFlush(teamEmployee);
                                    break;
                                }
                                case utils_2.MultiORMEnum.TypeORM:
                                default:
                                    await this.typeOrmOrganizationTeamEmployeeRepository.save({
                                        employeeId: employee.id,
                                        organizationTeamId: team.id,
                                        roleId: invitedTenantUser.roleId,
                                        tenantId,
                                        organizationId
                                    });
                                    break;
                            }
                            await this.updateInviteStatus(inviteId, contracts_1.InviteStatusEnum.ACCEPTED, invitedTenantUser.id);
                        }
                    }
                    catch (error) {
                        // Nothing consumed the invite after all — hand it back.
                        await this.releaseInvite(inviteId);
                        throw error;
                    }
                }
                /**
                 * Accepted Case - 3
                 * Current user is not belong to invited tenant & current user email with invited tenant is not present
                 */
                if (user.tenantId !== tenantId && !invitedTenantUser) {
                    // Claim BEFORE creating the user — see claimInvite. Everything up to here is a
                    // read, so without the claim two parallel acceptances of one invite would each
                    // create their own tenant user.
                    if (!(await this.claimInvite(inviteId))) {
                        throw new common_1.BadRequestException('Invite has already been accepted');
                    }
                    try {
                        const [team] = teams;
                        const names = fullName?.split(' ');
                        const newTenantUser = await this.createUser({
                            user: {
                                firstName: (names && names.length && names[0]) || '',
                                lastName: (names && names.length && names[1]) || '',
                                email: email,
                                tenant: tenant,
                                role: role
                            },
                            organizationId,
                            inviteId,
                            createdByUserId: invitedByUserId
                        }, team.id, languageCode);
                        await this.updateInviteStatus(inviteId, contracts_1.InviteStatusEnum.ACCEPTED, newTenantUser.id);
                    }
                    catch (error) {
                        // Nothing consumed the invite after all — hand it back.
                        await this.releaseInvite(inviteId);
                        throw error;
                    }
                }
            }
            /**
             * REJECTED
             */
            if (action === contracts_1.InviteActionEnum.REJECTED) {
                await this.updateInviteStatus(id, contracts_1.InviteStatusEnum.REJECTED);
            }
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    return await this.mikroOrmRepository.findOne({ id });
                case utils_2.MultiORMEnum.TypeORM:
                default:
                    return await this.typeOrmRepository.findOne({
                        where: { id },
                        select: { status: true }
                    });
            }
        }
        catch (error) {
            // Handle the error here, e.g., logging, returning an error response, etc.
            console.error('An error occurred when accept invitation by ID:', error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Create a new user.
     *
     * @param input The input data for user registration and integration configuration.
     * @param organizationTeamId The ID of the organization team to associate the user with.
     * @param languageCode The language code for localization.
     * @returns A promise that resolves to the created user.
     */
    async createUser(input, organizationTeamId, languageCode) {
        let tenant = input.user.tenant;
        if (input.createdByUserId) {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const creatingUser = await this.mikroOrmUserRepository.findOneOrFail({ id: input.createdByUserId }, { populate: ['tenant'] });
                    tenant = creatingUser.tenant;
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const creatingUser = await this.typeOrmUserRepository.findOneOrFail({
                        where: { id: input.createdByUserId },
                        relations: { tenant: true }
                    });
                    tenant = creatingUser.tenant;
                    break;
                }
            }
        }
        /**
         * Register new user
         */
        let entity;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const em = this.mikroOrmUserRepository.getEntityManager();
                entity = em.create('User', {
                    ...input.user,
                    tenant,
                    ...(input.password ? { hash: await this.authService.getPasswordHash(input.password) } : {})
                });
                await em.persistAndFlush(entity);
                break;
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const create = this.typeOrmUserRepository.create({
                    ...input.user,
                    tenant,
                    ...(input.password ? { hash: await this.authService.getPasswordHash(input.password) } : {})
                });
                entity = await this.typeOrmUserRepository.save(create);
                break;
            }
        }
        /**
         * Email automatically verified after accept invitation
         */
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                await this.mikroOrmUserRepository.nativeUpdate({ id: entity.id }, { ...(input.inviteId ? { emailVerifiedAt: (0, utils_2.freshTimestamp)() } : {}) });
                break;
            case utils_2.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmUserRepository.update(entity.id, {
                    ...(input.inviteId ? { emailVerifiedAt: (0, utils_2.freshTimestamp)() } : {})
                });
                break;
        }
        /**
         * Find latest register user with role
         */
        let user;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                user = await this.mikroOrmUserRepository.findOne({ id: entity.id }, { populate: ['role'] });
                break;
            case utils_2.MultiORMEnum.TypeORM:
            default:
                user = await this.typeOrmUserRepository.findOne({
                    where: { id: entity.id },
                    relations: { role: true }
                });
                break;
        }
        if (input.organizationId) {
            /**
             * Add user to invited Organization
             */
            await this.userOrganizationService.addUserToOrganization(user, input.organizationId);
            /**
             * Create employee associated to invited organization and tenant
             */
            let employee;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmEmployeeRepository.getEntityManager();
                    employee = em.create('Employee', {
                        organizationId: input.organizationId,
                        tenantId: tenant.id,
                        userId: user.id,
                        startedWorkOn: (0, utils_2.freshTimestamp)()
                    });
                    await em.persistAndFlush(employee);
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default:
                    employee = await this.typeOrmEmployeeRepository.save({
                        organizationId: input.organizationId,
                        tenantId: tenant.id,
                        userId: user.id,
                        startedWorkOn: (0, utils_2.freshTimestamp)()
                    });
                    break;
            }
            /**
             * Add employee to invited team
             */
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const em = this.mikroOrmOrganizationTeamEmployeeRepository.getEntityManager();
                    const teamEmployee = em.create('OrganizationTeamEmployee', {
                        employeeId: employee.id,
                        organizationTeamId,
                        tenantId: user.tenantId,
                        organizationId: input.organizationId,
                        roleId: user.roleId
                    });
                    await em.persistAndFlush(teamEmployee);
                    break;
                }
                case utils_2.MultiORMEnum.TypeORM:
                default:
                    await this.typeOrmOrganizationTeamEmployeeRepository.save({
                        employeeId: employee.id,
                        organizationTeamId,
                        tenantId: user.tenantId,
                        organizationId: input.organizationId,
                        roleId: user.roleId
                    });
                    break;
            }
        }
        // Extract integration information
        let integration = (0, underscore_1.pick)(input, ['appName', 'appLogo', 'appSignature', 'appLink', 'companyLink', 'companyName']);
        this.emailService.welcomeUser(input.user, languageCode, input.organizationId, input.originalUrl, integration);
        return user;
    }
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
    async claimInvite(inviteId, userId) {
        const updateData = { status: contracts_1.InviteStatusEnum.ACCEPTED };
        if (userId)
            updateData.userId = userId;
        const where = (0, claim_criteria_1.inviteClaimWhere)(inviteId);
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return (await this.mikroOrmRepository.nativeUpdate(where, updateData)) > 0;
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const { affected } = await this.typeOrmRepository.update(where, updateData);
                return (affected ?? 0) > 0;
            }
        }
    }
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
    async rejectInvite(inviteId) {
        const where = (0, claim_criteria_1.inviteRejectWhere)(inviteId);
        const updateData = { status: contracts_1.InviteStatusEnum.REJECTED };
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                return (await this.mikroOrmRepository.nativeUpdate(where, updateData)) > 0;
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const { affected } = await this.typeOrmRepository.update(where, updateData);
                return (affected ?? 0) > 0;
            }
        }
    }
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
    async releaseInvite(inviteId) {
        const where = (0, claim_criteria_1.inviteReleaseWhere)(inviteId);
        const updateData = { status: contracts_1.InviteStatusEnum.INVITED, userId: null };
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM:
                    await this.mikroOrmRepository.nativeUpdate(where, updateData);
                    break;
                case utils_2.MultiORMEnum.TypeORM:
                default:
                    await this.typeOrmRepository.update(where, updateData);
                    break;
            }
        }
        catch (error) {
            console.error(`Failed to release invite ${inviteId} after a failed acceptance:`, error);
        }
    }
    /**
     * Update invite status using the active ORM.
     *
     * @param inviteId - The invite ID to update
     * @param status - The new invite status
     * @param userId - Optional user ID to associate with the invite
     */
    async updateInviteStatus(inviteId, status, userId) {
        const updateData = { status };
        if (userId)
            updateData.userId = userId;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM:
                await this.mikroOrmRepository.nativeUpdate({ id: inviteId }, updateData);
                break;
            case utils_2.MultiORMEnum.TypeORM:
            default:
                await this.typeOrmRepository.update(inviteId, updateData);
                break;
        }
    }
};
exports.InviteService = InviteService;
exports.InviteService = InviteService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_invite_repository_1.TypeOrmInviteRepository,
        mikro_orm_invite_repository_1.MikroOrmInviteRepository,
        type_orm_user_repository_1.TypeOrmUserRepository,
        mikro_orm_user_repository_1.MikroOrmUserRepository,
        type_orm_employee_repository_1.TypeOrmEmployeeRepository,
        mikro_orm_employee_repository_1.MikroOrmEmployeeRepository,
        type_orm_organization_team_employee_repository_1.TypeOrmOrganizationTeamEmployeeRepository,
        mikro_orm_organization_team_employee_repository_1.MikroOrmOrganizationTeamEmployeeRepository,
        config_1.ConfigService,
        email_service_1.EmailService,
        organization_contact_service_1.OrganizationContactService,
        organization_department_service_1.OrganizationDepartmentService,
        organization_project_service_1.OrganizationProjectService,
        organization_service_1.OrganizationService,
        organization_team_service_1.OrganizationTeamService,
        role_service_1.RoleService,
        user_service_1.UserService,
        auth_service_1.AuthService,
        cqrs_1.CommandBus,
        user_organization_services_1.UserOrganizationService])
], InviteService);
//# sourceMappingURL=invite.service.js.map