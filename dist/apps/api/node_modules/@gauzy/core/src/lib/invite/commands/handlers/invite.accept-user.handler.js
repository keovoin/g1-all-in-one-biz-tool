"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteAcceptUserHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const auth_service_1 = require("../../../auth/auth.service");
const invite_service_1 = require("../../invite.service");
const invite_accept_user_command_1 = require("../invite.accept-user.command");
const organization_service_1 = require("../../../organization/organization.service");
const type_orm_user_repository_1 = require("../../../user/repository/type-orm-user.repository");
/**
 * Use this command for registering all non-employee users.
 * This command first registers a user, then creates a user_organization relation.
 * If the above two steps are successful, it finally sets the invitation status to accepted
 */
let InviteAcceptUserHandler = class InviteAcceptUserHandler {
    constructor(typeOrmUserRepository, inviteService, authService, organizationService) {
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.inviteService = inviteService;
        this.authService = authService;
        this.organizationService = organizationService;
    }
    async execute(command) {
        const { input, languageCode } = command;
        const { inviteId } = input;
        const invite = await this.inviteService.findOneByIdString(inviteId);
        if (!invite) {
            throw Error('Invite does not exist');
        }
        const organization = await this.organizationService.findOneByIdString(invite.organizationId);
        if (!organization.invitesAllowed) {
            throw Error('Organization no longer allows invites');
        }
        // Claim the invite BEFORE registering anyone. Everything above this line is a read, so two
        // parallel acceptances of the same invite are still both live here; the conditional flip to
        // ACCEPTED is what picks a single winner. Marking the invite accepted only at the end — as
        // this handler used to — meant both racers passed validation and both ran a full
        // registration off one invite.
        if (!(await this.inviteService.claimInvite(inviteId))) {
            throw new common_1.ConflictException('Invite has already been accepted');
        }
        let user;
        try {
            // Inner try/catch is find-or-register control flow, not error handling: a missing user
            // is the signal to create one.
            try {
                const { tenantId, email } = invite;
                user = await this.typeOrmUserRepository.findOneOrFail({
                    where: {
                        email,
                        tenantId
                    },
                    order: {
                        createdAt: 'DESC'
                    }
                });
            }
            catch (error) {
                const { id: organizationId, tenantId } = organization;
                /**
                 * User register after accept invitation
                 */
                user = await this.authService.register({
                    ...input,
                    user: {
                        ...input.user,
                        tenant: {
                            id: tenantId
                        }
                    },
                    organizationId,
                    inviteId
                }, languageCode);
            }
        }
        catch (error) {
            // Registration failed, so nothing consumed the invite after all — hand it back rather
            // than stranding it as ACCEPTED with no user attached.
            await this.inviteService.releaseInvite(inviteId);
            throw error;
        }
        const { id } = user;
        await this.inviteService.update(inviteId, {
            userId: id
        });
        return user;
    }
};
exports.InviteAcceptUserHandler = InviteAcceptUserHandler;
exports.InviteAcceptUserHandler = InviteAcceptUserHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_accept_user_command_1.InviteAcceptUserCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_repository_1.TypeOrmUserRepository,
        invite_service_1.InviteService,
        auth_service_1.AuthService,
        organization_service_1.OrganizationService])
], InviteAcceptUserHandler);
//# sourceMappingURL=invite.accept-user.handler.js.map