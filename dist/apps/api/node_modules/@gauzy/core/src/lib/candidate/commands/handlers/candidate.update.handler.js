"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const candidate_service_1 = require("../../candidate.service");
const candidate_update_command_1 = require("../candidate.update.command");
let CandidateUpdateHandler = class CandidateUpdateHandler {
    constructor(candidateService) {
        this.candidateService = candidateService;
    }
    async execute(command) {
        const { input } = command;
        const { id } = input;
        try {
            //We are using create here because create calls the method save()
            //We need save() to save ManyToMany relations
            return await this.candidateService.create({ ...input, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.CandidateUpdateHandler = CandidateUpdateHandler;
exports.CandidateUpdateHandler = CandidateUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_update_command_1.CandidateUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_service_1.CandidateService])
], CandidateUpdateHandler);
//# sourceMappingURL=candidate.update.handler.js.map