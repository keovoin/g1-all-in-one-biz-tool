"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesBulkUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_technologies_service_1 = require("../../candidate-technologies.service");
const candidate_technologies_bulk_update_command_1 = require("../candidate-technologies.bulk.update.command");
let CandidateTechnologiesBulkUpdateHandler = class CandidateTechnologiesBulkUpdateHandler {
    constructor(candidateTechnologiesService) {
        this.candidateTechnologiesService = candidateTechnologiesService;
    }
    async execute(command) {
        const { technologies } = command;
        // TO DO
        technologies.forEach((item) => this.candidateTechnologiesService.update(item.id, { ...item }));
        return;
    }
};
exports.CandidateTechnologiesBulkUpdateHandler = CandidateTechnologiesBulkUpdateHandler;
exports.CandidateTechnologiesBulkUpdateHandler = CandidateTechnologiesBulkUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_technologies_bulk_update_command_1.CandidateTechnologiesBulkUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_technologies_service_1.CandidateTechnologiesService])
], CandidateTechnologiesBulkUpdateHandler);
//# sourceMappingURL=candidate-technologies.bulk.update.handler.js.map