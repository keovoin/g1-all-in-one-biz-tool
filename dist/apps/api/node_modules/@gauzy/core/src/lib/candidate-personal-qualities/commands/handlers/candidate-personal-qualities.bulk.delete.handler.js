"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualitiesBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_personal_qualities_bulk_delete_command_1 = require("../candidate-personal-qualities.bulk.delete.command");
const candidate_personal_qualities_service_1 = require("../../candidate-personal-qualities.service");
let CandidatePersonalQualitiesBulkDeleteHandler = class CandidatePersonalQualitiesBulkDeleteHandler {
    constructor(candidatePersonalQualitiesService) {
        this.candidatePersonalQualitiesService = candidatePersonalQualitiesService;
    }
    async execute(command) {
        const { id, personalQualities } = command;
        if (personalQualities) {
            await this.candidatePersonalQualitiesService.deleteMany(personalQualities.map((item) => item.id));
        }
        else {
            const qualities = await this.candidatePersonalQualitiesService.getPersonalQualitiesByInterviewId(id);
            await this.candidatePersonalQualitiesService.deleteMany(qualities.map((item) => item.id));
        }
        return;
    }
};
exports.CandidatePersonalQualitiesBulkDeleteHandler = CandidatePersonalQualitiesBulkDeleteHandler;
exports.CandidatePersonalQualitiesBulkDeleteHandler = CandidatePersonalQualitiesBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_personal_qualities_bulk_delete_command_1.CandidatePersonalQualitiesBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_personal_qualities_service_1.CandidatePersonalQualitiesService])
], CandidatePersonalQualitiesBulkDeleteHandler);
//# sourceMappingURL=candidate-personal-qualities.bulk.delete.handler.js.map