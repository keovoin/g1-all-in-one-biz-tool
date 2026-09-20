"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingBulkCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_criterions_rating_bulk_create_command_1 = require("../candidate-criterions-rating.bulk.create.command");
const candidate_criterion_rating_service_1 = require("../../candidate-criterion-rating.service");
let CandidateCriterionsRatingBulkCreateHandler = class CandidateCriterionsRatingBulkCreateHandler {
    constructor(candidateCriterionsRatingService) {
        this.candidateCriterionsRatingService = candidateCriterionsRatingService;
    }
    async execute(command) {
        const { feedbackId, technologies, qualities } = command;
        let technologyRating;
        const technologyCreateInput = [];
        for (const item of technologies) {
            technologyRating = {
                rating: item.rating,
                technologyId: item.id,
                feedbackId: feedbackId,
                organizationId: item.organizationId,
                tenantId: item.tenantId
            };
            technologyCreateInput.push(technologyRating);
        }
        let qualityRating;
        const qualityCreateInput = [];
        for (const item of qualities) {
            qualityRating = {
                rating: item.rating,
                personalQualityId: item.id,
                feedbackId: feedbackId,
                organizationId: item.organizationId,
                tenantId: item.tenantId
            };
            qualityCreateInput.push(qualityRating);
        }
        return await this.candidateCriterionsRatingService.createBulk(technologyCreateInput, qualityCreateInput);
    }
};
exports.CandidateCriterionsRatingBulkCreateHandler = CandidateCriterionsRatingBulkCreateHandler;
exports.CandidateCriterionsRatingBulkCreateHandler = CandidateCriterionsRatingBulkCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_criterions_rating_bulk_create_command_1.CandidateCriterionsRatingBulkCreateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_criterion_rating_service_1.CandidateCriterionsRatingService])
], CandidateCriterionsRatingBulkCreateHandler);
//# sourceMappingURL=candidate-criterions-rating.bulk.create.handler.js.map