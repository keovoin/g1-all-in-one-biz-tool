"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_technologies_bulk_create_command_1 = require("../candidate-technologies.bulk.create.command");
const candidate_technologies_service_1 = require("../../candidate-technologies.service");
let CandidateTechnologiesBulkCreateHandler = class CandidateTechnologiesBulkCreateHandler {
    constructor(candidateTechnologiesService) {
        this.candidateTechnologiesService = candidateTechnologiesService;
    }
    async execute(command) {
        const { interviewId, technologies } = command;
        let technology;
        const createInput = [];
        for (const item of technologies) {
            technology = { name: item, interviewId: interviewId };
            createInput.push(technology);
        }
        return await this.candidateTechnologiesService.createBulk(createInput);
    }
};
exports.CandidateTechnologiesBulkCreateHandler = CandidateTechnologiesBulkCreateHandler;
exports.CandidateTechnologiesBulkCreateHandler = CandidateTechnologiesBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_technologies_bulk_create_command_1.CandidateTechnologiesBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_technologies_service_1.CandidateTechnologiesService])
], CandidateTechnologiesBulkCreateHandler);
//# sourceMappingURL=candidate-technologies.bulk.create.handler.js.map