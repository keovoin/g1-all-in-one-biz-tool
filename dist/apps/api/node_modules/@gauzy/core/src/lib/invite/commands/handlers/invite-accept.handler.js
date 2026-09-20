"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteAcceptHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const auth_service_1 = require("./../../../auth/auth.service");
const user_service_1 = require("./../../../user/user.service");
const employee_service_1 = require("./../../../employee/employee.service");
const invite_service_1 = require("./../../invite.service");
const invite_accept_candidate_command_1 = require("../invite.accept-candidate.command");
const invite_accept_employee_command_1 = require("../invite.accept-employee.command");
const invite_accept_user_command_1 = require("../invite.accept-user.command");
const invite_accept_command_1 = require("../invite-accept.command");
const internal_1 = require("./../../../core/entities/internal");
const type_orm_user_repository_1 = require("./../../../user/repository/type-orm-user.repository");
let InviteAcceptHandler = class InviteAcceptHandler {
    constructor(typeOrmUserRepository, commandBus, inviteService, authService, userService, employeeService) {
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.commandBus = commandBus;
        this.inviteService = inviteService;
        this.authService = authService;
        this.userService = userService;
        this.employeeService = employeeService;
    }
    /**
     * Accepts an invitation based on the provided command.
     * @param command The command containing the invite acceptance data.
     * @returns The authorized user.
     */
    async execute(command) {
        try {
            const { languageCode } = command;
            // Work on a copy: the command's input is the caller's (readonly) DTO, and everything below
            // deletes from it and pins fields on its nested `user`. The copy is two levels deep on
            // purpose — those are the only levels written to — and a missing `user` is left missing
            // so the pin below still fails instead of registering an account with no user at all.
            const input = {
                ...command.input,
                ...(command.input.user && { user: { ...command.input.user } })
            };
            const { email, token, code } = input;
            // Drop the fields the INVITE owns before anything downstream reads them. The HTTP entry
            // point whitelists the body with `AcceptInviteDTO`, but this command is also reachable
            // through the command bus, and `AuthService.register` spreads what it is handed into
            // repository `create()` calls: a top-level `id` there is a primary key, which turns the
            // employee `save()` into an UPDATE of somebody else's row, and `featureAsEmployee`
            // self-provisions an employee profile that `/auth/register` only lets an admin create.
            // `inviteId` and `organizationId` are re-set from the invitation a few lines below and
            // in each sub-handler, so removing them here cannot break a legitimate accept.
            const inviteOwnedFields = input;
            for (const field of [
                'id',
                'featureAsEmployee',
                'organizationId',
                'createdByUserId',
                'isImporting',
                'sourceId'
            ]) {
                delete inviteOwnedFields[field];
            }
            let invite;
            // Validate invite by token or code.
            //
            // Discriminate on the VALUE, not on key presence: with a validated DTO in front of this
            // handler the class may declare both properties, and `'token' in input` would then take
            // the token branch for a code-only acceptance (the Ever Teams flow) and fail it.
            if (email && token) {
                invite = await this.inviteService.validateByToken({ email, token });
            }
            else if (email && code) {
                invite = await this.inviteService.validateByCode({ email, code });
            }
            if (!invite) {
                throw Error('Invite does not exist');
            }
            // Assign role to user
            const { id: inviteId } = invite;
            const { role, tenant, tenantId } = await this.inviteService.findOneByIdString(inviteId, {
                relations: { role: true, tenant: true }
            });
            // Pin BOTH the relation and its foreign key to the role stored on the invite. The request
            // body is attacker-controlled on this @Public() route, and the flat `roleId` column wins
            // over the `role` relation when the user row is persisted — so setting only `role` here
            // would let an invitee accept with `user.roleId` of any role (e.g. SUPER_ADMIN).
            input['user']['role'] = role;
            input['user']['roleId'] = role.id;
            // The account is created for the INVITED address (the one the token/code was validated
            // against) — never for a different, auto-verified address supplied in the body.
            input['user']['email'] = invite.email;
            // The INVITE decides which tenant the account is created in. `AuthService.register` reads
            // `input.user.tenant`, which is body-supplied on this @Public() route — leaving it in place
            // let an invitee for tenant A register into tenant B by naming B's tenant in the payload.
            if (tenant || tenantId) {
                input['user']['tenant'] = tenant ?? { id: tenantId };
                input['user']['tenantId'] = tenant?.id ?? tenantId;
            }
            input['inviteId'] = inviteId;
            // Invite accept for employee, candidate & user
            let user;
            switch (role.name) {
                case contracts_1.RolesEnum.EMPLOYEE:
                    user = await this.commandBus.execute(new invite_accept_employee_command_1.InviteAcceptEmployeeCommand(input, languageCode));
                    return await this._authorizeUser(user);
                case contracts_1.RolesEnum.CANDIDATE:
                    user = await this.commandBus.execute(new invite_accept_candidate_command_1.InviteAcceptCandidateCommand(input, languageCode));
                    return await this._authorizeUser(user);
                default:
                    user = await this.commandBus.execute(new invite_accept_user_command_1.InviteAcceptUserCommand(input, languageCode));
                    return await this._authorizeUser(user);
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * After accept invite authorize user
     *
     * @param user
     * @returns
     */
    async _authorizeUser(user) {
        try {
            const { id, email } = user;
            await this.typeOrmUserRepository.findOneOrFail({
                where: {
                    id,
                    email,
                    isActive: true,
                    isArchived: false
                },
                relations: {
                    role: { rolePermissions: true }
                },
                order: { createdAt: 'DESC' }
            });
            // If users are inactive
            if (user.isActive === false) {
                throw new common_1.UnauthorizedException();
            }
            // Retrieve the employee details associated with the user.
            const employee = await this.employeeService.findOneByUserId(user.id);
            // Check if the employee is active and not archived. If not, throw an error.
            if (employee && (!employee.isActive || employee.isArchived)) {
                throw new common_1.UnauthorizedException();
            }
            // Generate both access and refresh tokens concurrently for efficiency.
            const [access_token, refresh_token] = await Promise.all([
                this.authService.getJwtAccessToken(user),
                this.authService.getJwtRefreshToken(user)
            ]);
            // Store the current refresh token with the user for later validation.
            await this.userService.setCurrentRefreshToken(refresh_token, user.id);
            // Return the user object with user details, tokens, and optionally employee info if it exists.
            return {
                user: new internal_1.User({
                    ...user,
                    ...(employee && { employee })
                }),
                token: access_token,
                refresh_token: refresh_token
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.InviteAcceptHandler = InviteAcceptHandler;
exports.InviteAcceptHandler = InviteAcceptHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_accept_command_1.InviteAcceptCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_repository_1.TypeOrmUserRepository,
        cqrs_1.CommandBus,
        invite_service_1.InviteService,
        auth_service_1.AuthService,
        user_service_1.UserService,
        employee_service_1.EmployeeService])
], InviteAcceptHandler);
//# sourceMappingURL=invite-accept.handler.js.map