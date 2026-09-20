"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactionCreateHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const request_context_1 = require("../../../core/context/request-context");
const reaction_service_1 = require("../../reaction.service");
const reaction_create_command_1 = require("../reaction.create.command");
let ReactionCreateHandler = class ReactionCreateHandler {
    constructor(reactionService) {
        this.reactionService = reactionService;
    }
    /**
     * Executes the ReactionCreateCommand to create a new reaction.
     * It extracts necessary properties from the command input and the current request context,
     * then delegates the creation process to the reactionService.
     *
     * @param command - The command containing the reaction creation input.
     * @returns A Promise resolving to the newly created reaction.
     * @throws HttpException with BAD_REQUEST status if reaction creation fails.
     */
    async execute(command) {
        try {
            const { input } = command;
            // Resolve tenantId from the current request context, or fall back to the input tenantId
            const tenantId = request_context_1.RequestContext.currentTenantId() ?? input.tenantId;
            // Destructure the required properties from the input
            const { organizationId, entity, entityId, emoji } = input;
            // Delegate reaction creation to the reactionService
            return await this.reactionService.create({
                entity,
                entityId,
                emoji,
                actorType: contracts_1.ActorTypeEnum.User,
                organizationId,
                tenantId
            });
        }
        catch (error) {
            console.log('[ReactionExecute] Error while executing ReactionCreateCommand:', error);
            throw new common_1.HttpException(`Error while executing ReactionCreateCommand: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.ReactionCreateHandler = ReactionCreateHandler;
exports.ReactionCreateHandler = ReactionCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(reaction_create_command_1.ReactionCreateCommand),
    tslib_1.__metadata("design:paramtypes", [reaction_service_1.ReactionService])
], ReactionCreateHandler);
//# sourceMappingURL=reaction.create.handler.js.map