"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionUpdateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const reaction_service_1 = require("../../reaction.service");
const reaction_update_command_1 = require("../reaction.update.command");
let ReactionUpdateHandler = class ReactionUpdateHandler {
    constructor(reactionService) {
        this.reactionService = reactionService;
    }
    /**
     * Executes the ReactionUpdateCommand to update a reaction.
     *
     * @param command - The command object containing the reaction update details.
     * @returns A Promise that resolves to the updated reaction or an UpdateResult.
     */
    async execute(command) {
        try {
            const { id, input } = command;
            return await this.reactionService.update(id, input);
        }
        catch (error) {
            console.error('[ReactionUpdate] Error while updating reaction:', error);
            throw new common_1.HttpException(`Error while executing ReactionUpdateCommand: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ReactionUpdateHandler = ReactionUpdateHandler;
exports.ReactionUpdateHandler = ReactionUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(reaction_update_command_1.ReactionUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [reaction_service_1.ReactionService])
], ReactionUpdateHandler);
//# sourceMappingURL=reaction.update.handler.js.map