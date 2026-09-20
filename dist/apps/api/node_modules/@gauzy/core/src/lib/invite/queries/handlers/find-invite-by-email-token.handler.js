"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindInviteByEmailTokenHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const invite_service_1 = require("../../invite.service");
const find_invite_by_email_token_query_1 = require("../find-invite-by-email-token.query");
let FindInviteByEmailTokenHandler = class FindInviteByEmailTokenHandler {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    async execute(query) {
        const { params } = query;
        try {
            return await this.inviteService.validateByToken(params);
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
};
exports.FindInviteByEmailTokenHandler = FindInviteByEmailTokenHandler;
exports.FindInviteByEmailTokenHandler = FindInviteByEmailTokenHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_invite_by_email_token_query_1.FindInviteByEmailTokenQuery),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService])
], FindInviteByEmailTokenHandler);
//# sourceMappingURL=find-invite-by-email-token.handler.js.map