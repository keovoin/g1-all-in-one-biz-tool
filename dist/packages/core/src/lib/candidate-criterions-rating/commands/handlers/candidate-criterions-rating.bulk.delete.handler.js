"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingBulkDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_criterions_rating_bulk_delete_command_1 = require("../candidate-criterions-rating.bulk.delete.command");
const candidate_criterion_rating_service_1 = require("../../candidate-criterion-rating.service");
let CandidateCriterionsRatingBulkDeleteHandler = class CandidateCriterionsRatingBulkDeleteHandler {
    constructor(candidateCriterionsRatingService) {
        this.candidateCriterionsRatingService = candidateCriterionsRatingService;
    }
    async execute(command) {
        const { id: feedbackId } = command;
        const criterions = await this.candidateCriterionsRatingService.getCriterionsByFeedbackId(feedbackId);
        if (!criterions?.length) {
            return;
        }
        const criterionIds = criterions.map((c) => c.id);
        await this.candidateCriterionsRatingService.deleteMany(criterionIds);
    }
};
exports.CandidateCriterionsRatingBulkDeleteHandler = CandidateCriterionsRatingBulkDeleteHandler;
exports.CandidateCriterionsRatingBulkDeleteHandler = CandidateCriterionsRatingBulkDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_criterions_rating_bulk_delete_command_1.CandidateCriterionsRatingBulkDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_criterion_rating_service_1.CandidateCriterionsRatingService])
], CandidateCriterionsRatingBulkDeleteHandler);
//# sourceMappingURL=candidate-criterions-rating.bulk.delete.handler.js.map