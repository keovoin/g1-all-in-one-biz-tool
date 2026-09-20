"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualitiesBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_personal_qualities_bulk_create_command_1 = require("../candidate-personal-qualities.bulk.create.command");
const candidate_personal_qualities_service_1 = require("../../candidate-personal-qualities.service");
let CandidatePersonalQualitiesBulkCreateHandler = class CandidatePersonalQualitiesBulkCreateHandler {
    constructor(candidatePersonalQualitiesService) {
        this.candidatePersonalQualitiesService = candidatePersonalQualitiesService;
    }
    async execute(command) {
        const { interviewId, personalQualities } = command;
        let personalQuality;
        const createInput = [];
        for (const item of personalQualities) {
            personalQuality = { name: item, interviewId: interviewId };
            createInput.push(personalQuality);
        }
        return await this.candidatePersonalQualitiesService.createBulk(createInput);
    }
};
exports.CandidatePersonalQualitiesBulkCreateHandler = CandidatePersonalQualitiesBulkCreateHandler;
exports.CandidatePersonalQualitiesBulkCreateHandler = CandidatePersonalQualitiesBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_personal_qualities_bulk_create_command_1.CandidatePersonalQualitiesBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_personal_qualities_service_1.CandidatePersonalQualitiesService])
], CandidatePersonalQualitiesBulkCreateHandler);
//# sourceMappingURL=candidate-personal-qualities.bulk.create.handler.js.map