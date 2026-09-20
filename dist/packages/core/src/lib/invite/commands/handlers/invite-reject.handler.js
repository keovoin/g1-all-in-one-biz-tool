"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteRejectHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const invite_reject_command_1 = require("../invite-reject.command");
const invite_service_1 = require("../../invite.service");
/**
 * Reject invite handler
 */
let InviteRejectHandler = class InviteRejectHandler {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    /**
     * Reject invite
     * @param command - The command containing the invite rejection data.
     * @returns The rejected invite.
     */
    async execute(command) {
        const { input } = command;
        const { email, token, code } = input;
        if (!email) {
            throw new common_1.BadRequestException('Email is required');
        }
        if (!token && !code) {
            throw new common_1.BadRequestException('Either token or code must be provided');
        }
        try {
            let invite;
            // Validate invite by token or code
            if (token) {
                invite = await this.inviteService.validateByToken({ email, token });
            }
            else if (code) {
                invite = await this.inviteService.validateByCode({ email, code });
            }
            if (!invite) {
                throw new common_1.NotFoundException('Invite does not exist');
            }
            // Guarded transition: an unguarded write by id would let this reject overwrite an
            // invite that a concurrent acceptance has already consumed and registered a user for.
            if (!(await this.inviteService.rejectInvite(invite.id))) {
                throw new common_1.ConflictException('Invite has already been accepted or rejected');
            }
            return invite;
        }
        catch (error) {
            // Preserve deliberate HTTP responses — the 409 from a lost race and the 404 from a
            // missing invite must not be flattened into a generic 400 by this catch-all.
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.InviteRejectHandler = InviteRejectHandler;
exports.InviteRejectHandler = InviteRejectHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_reject_command_1.InviteRejectCommand),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteRejectHandler);
//# sourceMappingURL=invite-reject.handler.js.map