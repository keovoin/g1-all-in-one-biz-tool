"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewersEmployeeBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const candidate_interviewers_employee_bulk_delete_command_1 = require("../candidate-interviewers.employee.bulk.delete.command");
const candidate_interviewers_service_1 = require("../../candidate-interviewers.service");
let CandidateInterviewersEmployeeBulkDeleteHandler = class CandidateInterviewersEmployeeBulkDeleteHandler {
    constructor(candidateInterviewersService) {
        this.candidateInterviewersService = candidateInterviewersService;
    }
    /**
     * Execute the command to delete interviewers by employee ID.
     */
    async execute(command) {
        const { input } = command;
        if (!input?.length) {
            return;
        }
        // Extract employee IDs from input
        const employeeIds = input.map(({ employeeId }) => employeeId).filter((id) => !!id);
        if (!employeeIds.length) {
            return;
        }
        // Fetch all interviewers for the given employee IDs in a single query
        const interviewers = await this.candidateInterviewersService.find({
            where: {
                employeeId: (0, typeorm_1.In)(employeeIds)
            }
        });
        // Extract interviewer IDs
        const interviewerIds = interviewers.map((interviewer) => interviewer.id);
        if (!interviewerIds.length) {
            return;
        }
        await this.candidateInterviewersService.deleteMany(interviewerIds);
    }
};
exports.CandidateInterviewersEmployeeBulkDeleteHandler = CandidateInterviewersEmployeeBulkDeleteHandler;
exports.CandidateInterviewersEmployeeBulkDeleteHandler = CandidateInterviewersEmployeeBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_interviewers_employee_bulk_delete_command_1.CandidateInterviewersEmployeeBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_interviewers_service_1.CandidateInterviewersService])
], CandidateInterviewersEmployeeBulkDeleteHandler);
//# sourceMappingURL=candidate-interviewers.employee.bulk.delete.handler.js.map