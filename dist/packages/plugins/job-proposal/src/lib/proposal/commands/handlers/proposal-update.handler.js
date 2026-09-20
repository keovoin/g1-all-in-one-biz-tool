"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProposalUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const proposal_update_command_1 = require("../proposal-update.command");
const proposal_service_1 = require("../../proposal.service");
let ProposalUpdateHandler = class ProposalUpdateHandler {
    constructor(_proposalService) {
        this._proposalService = _proposalService;
    }
    /**
     * Executes the ProposalUpdateCommand to update a proposal.
     *
     * @param command The ProposalUpdateCommand containing the id and input data for the update.
     * @returns A Promise that resolves to the updated Proposal entity.
     */
    async execute(command) {
        const { id, input } = command;
        return await this._proposalService.create({ ...input, id });
    }
};
exports.ProposalUpdateHandler = ProposalUpdateHandler;
exports.ProposalUpdateHandler = ProposalUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(proposal_update_command_1.ProposalUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [proposal_service_1.ProposalService])
], ProposalUpdateHandler);
//# sourceMappingURL=proposal-update.handler.js.map