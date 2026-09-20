"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_technologies_bulk_delete_command_1 = require("../candidate-technologies.bulk.delete.command");
const candidate_technologies_service_1 = require("../../candidate-technologies.service");
let CandidateTechnologiesBulkDeleteHandler = class CandidateTechnologiesBulkDeleteHandler {
    constructor(candidateTechnologiesService) {
        this.candidateTechnologiesService = candidateTechnologiesService;
    }
    async execute(command) {
        const { id, technologies } = command;
        if (technologies) {
            await this.candidateTechnologiesService.deleteMany(technologies.map((item) => item.id));
        }
        else {
            const technologies = await this.candidateTechnologiesService.getTechnologiesByInterviewId(id);
            await this.candidateTechnologiesService.deleteMany(technologies.map((item) => item.id));
        }
        return;
    }
};
exports.CandidateTechnologiesBulkDeleteHandler = CandidateTechnologiesBulkDeleteHandler;
exports.CandidateTechnologiesBulkDeleteHandler = CandidateTechnologiesBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_technologies_bulk_delete_command_1.CandidateTechnologiesBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_technologies_service_1.CandidateTechnologiesService])
], CandidateTechnologiesBulkDeleteHandler);
//# sourceMappingURL=candidate-technologies.bulk.delete.handler.js.map