"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteAcceptCandidateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const auth_service_1 = require("../../../auth/auth.service");
const invite_service_1 = require("../../invite.service");
const invite_accept_candidate_command_1 = require("../invite.accept-candidate.command");
const type_orm_user_repository_1 = require("../../../user/repository/type-orm-user.repository");
const type_orm_candidate_repository_1 = require("../../../candidate/repository/type-orm-candidate.repository");
/**
 * Use this command for registering candidates.
 * This command first registers a user, then creates an candidate entry for the organization.
 * If the above two steps are successful, it finally sets the invitation status to accepted
 */
let InviteAcceptCandidateHandler = class InviteAcceptCandidateHandler {
    constructor(typeOrmUserRepository, typeOrmCandidateRepository, inviteService, authService) {
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.typeOrmCandidateRepository = typeOrmCandidateRepository;
        this.inviteService = inviteService;
        this.authService = authService;
    }
    async execute(command) {
        const { input, languageCode } = command;
        const { inviteId } = input;
        const invite = await this.inviteService.findOneByIdString(inviteId, {
            relations: {
                departments: {
                    candidates: true
                },
                organization: true
            }
        });
        if (!invite) {
            throw Error('Invite does not exist');
        }
        const { organization } = invite;
        if (!organization.invitesAllowed) {
            throw Error('Organization no longer allows invites');
        }
        // Claim the invite BEFORE registering anyone — see InviteService.claimInvite. Everything
        // above is a read, so two parallel acceptances are both still live at this point.
        if (!(await this.inviteService.claimInvite(inviteId))) {
            throw new common_1.ConflictException('Invite has already been accepted');
        }
        let user;
        try {
            // Inner try/catch is find-or-register control flow, not error handling.
            try {
                const { tenantId, email } = invite;
                user = await this.typeOrmUserRepository.findOneOrFail({
                    where: {
                        email,
                        tenantId,
                        role: {
                            name: contracts_1.RolesEnum.CANDIDATE
                        }
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
                try {
                    /**
                     * Create candidate after create user
                     */
                    const create = this.typeOrmCandidateRepository.create({
                        user,
                        organization,
                        tenantId,
                        appliedDate: invite.actionDate || null,
                        organizationDepartments: invite.departments || []
                    });
                    await this.typeOrmCandidateRepository.save(create);
                }
                catch (error) {
                    throw new common_1.BadRequestException(error);
                }
            }
        }
        catch (error) {
            // Nothing consumed the invite after all — hand it back rather than stranding it as
            // ACCEPTED with no candidate attached.
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
exports.InviteAcceptCandidateHandler = InviteAcceptCandidateHandler;
exports.InviteAcceptCandidateHandler = InviteAcceptCandidateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_accept_candidate_command_1.InviteAcceptCandidateCommand),
    tslib_1.__metadata("design:paramtypes", [type_orm_user_repository_1.TypeOrmUserRepository,
        type_orm_candidate_repository_1.TypeOrmCandidateRepository,
        invite_service_1.InviteService,
        auth_service_1.AuthService])
], InviteAcceptCandidateHandler);
//# sourceMappingURL=invite.accept-candidate.handler.js.map