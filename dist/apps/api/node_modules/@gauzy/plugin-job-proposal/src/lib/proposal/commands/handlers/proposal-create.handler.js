"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const proposal_create_command_1 = require("../proposal-create.command");
const proposal_service_1 = require("../../proposal.service");
let ProposalCreateHandler = class ProposalCreateHandler {
    constructor(_proposalService) {
        this._proposalService = _proposalService;
    }
    /**
     * Executes a command to create a proposal.
     *
     * @param command The command object containing the input data for creating the proposal.
     * @returns A Promise that resolves to the created Proposal object.
     */
    async execute(command) {
        const { input } = command;
        return await this._proposalService.create(input);
    }
};
exports.ProposalCreateHandler = ProposalCreateHandler;
exports.ProposalCreateHandler = ProposalCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(proposal_create_command_1.ProposalCreateCommand),
    tslib_1.__metadata("design:paramtypes", [proposal_service_1.ProposalService])
], ProposalCreateHandler);
//# sourceMappingURL=proposal-create.handler.js.map