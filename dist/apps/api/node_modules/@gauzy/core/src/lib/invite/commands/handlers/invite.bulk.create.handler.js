"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const invite_service_1 = require("./../../invite.service");
const invite_bulk_create_command_1 = require("./../invite.bulk.create.command");
let InviteBulkCreateHandler = class InviteBulkCreateHandler {
    constructor(inviteService) {
        this.inviteService = inviteService;
    }
    /**
     * Executes the bulk invite creation command.
     *
     * @param command - The InviteBulkCreateCommand containing the input data and language code.
     * @returns A promise that resolves with the result of the bulk invite creation.
     */
    async execute(command) {
        const { input, languageCode } = command;
        return await this.inviteService.createBulk(input, languageCode);
    }
};
exports.InviteBulkCreateHandler = InviteBulkCreateHandler;
exports.InviteBulkCreateHandler = InviteBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(invite_bulk_create_command_1.InviteBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [invite_service_1.InviteService])
], InviteBulkCreateHandler);
//# sourceMappingURL=invite.bulk.create.handler.js.map