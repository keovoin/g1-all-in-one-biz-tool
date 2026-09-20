"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_interviewers_bulk_create_command_1 = require("../candidate-interviewers.bulk.create.command");
const candidate_interviewers_service_1 = require("../../candidate-interviewers.service");
let CandidateInterviewersBulkCreateHandler = class CandidateInterviewersBulkCreateHandler {
    constructor(candidateInterviewersService) {
        this.candidateInterviewersService = candidateInterviewersService;
    }
    async execute(command) {
        const { input } = command;
        let interviewer;
        const createInput = [];
        const { employeeIds, interviewId, organizationId, tenantId } = input;
        for (const employeeId of employeeIds) {
            interviewer = { interviewId, employeeId, organizationId, tenantId };
            createInput.push(interviewer);
        }
        return await this.candidateInterviewersService.createBulk(createInput);
    }
};
exports.CandidateInterviewersBulkCreateHandler = CandidateInterviewersBulkCreateHandler;
exports.CandidateInterviewersBulkCreateHandler = CandidateInterviewersBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_interviewers_bulk_create_command_1.CandidateInterviewersBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_interviewers_service_1.CandidateInterviewersService])
], CandidateInterviewersBulkCreateHandler);
//# sourceMappingURL=candidate-interviewers.bulk.create.handler.js.map