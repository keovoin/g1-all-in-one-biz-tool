"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteResendHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invite_service_1 = require("../../invite.service");
const invite_resend_command_1 = require("../invite.resend.command");
let InviteResendHandler = class InviteResendHandler {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    async execute(command) {
        const { input, languageCode } = command;
        return await this.inviteService.resendEmail(input, languageCode);
    }
};
exports.InviteResendHandler = InviteResendHandler;
exports.InviteResendHandler = InviteResendHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_resend_command_1.InviteResendCommand),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteResendHandler);
//# sourceMappingURL=invite.resend.handler.js.map