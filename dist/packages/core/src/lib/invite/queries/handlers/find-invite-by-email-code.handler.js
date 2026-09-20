"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindInviteByEmailCodeHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const invite_service_1 = require("./../../invite.service");
const find_invite_by_email_code_query_1 = require("../find-invite-by-email-code.query");
let FindInviteByEmailCodeHandler = class FindInviteByEmailCodeHandler {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    async execute(query) {
        const { params } = query;
        try {
            return await this.inviteService.validateByCode(params);
        }
        catch (error) {
            console.error(error, params);
            throw new common_1.BadRequestException();
        }
    }
};
exports.FindInviteByEmailCodeHandler = FindInviteByEmailCodeHandler;
exports.FindInviteByEmailCodeHandler = FindInviteByEmailCodeHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(find_invite_by_email_code_query_1.FindInviteByEmailCodeQuery),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService])
], FindInviteByEmailCodeHandler);
//# sourceMappingURL=find-invite-by-email-code.handler.js.map