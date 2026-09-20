"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersInterviewBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_interviewers_service_1 = require("../../candidate-interviewers.service");
const candidate_interviewers_interview_bulk_delete_command_1 = require("../candidate-interviewers.interview.bulk.delete.command");
let CandidateInterviewersInterviewBulkDeleteHandler = class CandidateInterviewersInterviewBulkDeleteHandler {
    constructor(candidateInterviewersService) {
        this.candidateInterviewersService = candidateInterviewersService;
    }
    async execute(command) {
        const { id: interviewId } = command;
        const interviewers = await this.candidateInterviewersService.getInterviewersByInterviewId(interviewId);
        if (!interviewers?.length) {
            return;
        }
        const interviewerIds = interviewers.map((i) => i.id);
        await this.candidateInterviewersService.deleteMany(interviewerIds);
    }
};
exports.CandidateInterviewersInterviewBulkDeleteHandler = CandidateInterviewersInterviewBulkDeleteHandler;
exports.CandidateInterviewersInterviewBulkDeleteHandler = CandidateInterviewersInterviewBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_interviewers_interview_bulk_delete_command_1.CandidateInterviewersInterviewBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_interviewers_service_1.CandidateInterviewersService])
], CandidateInterviewersInterviewBulkDeleteHandler);
//# sourceMappingURL=candidate-interviewers.interview.bulk.delete.handler.js.map