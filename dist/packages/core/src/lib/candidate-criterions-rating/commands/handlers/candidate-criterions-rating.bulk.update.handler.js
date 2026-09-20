"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateCriterionsRatingBulkUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_criterion_rating_service_1 = require("../../candidate-criterion-rating.service");
const candidate_criterions_rating_bulk_update_command_1 = require("../candidate-criterions-rating.bulk.update.command");
let CandidateCriterionsRatingBulkUpdateHandler = class CandidateCriterionsRatingBulkUpdateHandler {
    constructor(candidateCriterionsRatingService) {
        this.candidateCriterionsRatingService = candidateCriterionsRatingService;
    }
    async execute(command) {
        const { data } = command;
        return this.candidateCriterionsRatingService.updateBulk(this.setRating(data.personalQualities, data.criterionsRating.filter((tech) => tech.personalQualityId)), this.setRating(data.technologies, data.criterionsRating.filter((tech) => tech.technologyId)));
    }
    setRating(ratings, data) {
        for (let i = 0; i < ratings.length; i++) {
            data[i].rating = ratings[i];
        }
        return data;
    }
};
exports.CandidateCriterionsRatingBulkUpdateHandler = CandidateCriterionsRatingBulkUpdateHandler;
exports.CandidateCriterionsRatingBulkUpdateHandler = CandidateCriterionsRatingBulkUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_criterions_rating_bulk_update_command_1.CandidateCriterionsRatingBulkUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_criterion_rating_service_1.CandidateCriterionsRatingService])
], CandidateCriterionsRatingBulkUpdateHandler);
//# sourceMappingURL=candidate-criterions-rating.bulk.update.handler.js.map