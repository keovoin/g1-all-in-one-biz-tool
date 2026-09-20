"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const utils_1 = require("@gauzy/utils");
const candidate_feedbacks_update_command_1 = require("../candidate-feedbacks.update.command");
const candidate_feedbacks_service_1 = require("../../candidate-feedbacks.service");
const candidate_interview_service_1 = require("../../../candidate-interview/candidate-interview.service");
let FeedbackUpdateHandler = class FeedbackUpdateHandler {
    constructor(candidateFeedbackService, candidateInterviewService) {
        this.candidateFeedbackService = candidateFeedbackService;
        this.candidateInterviewService = candidateInterviewService;
    }
    async execute(command) {
        const { id } = command;
        const { entity } = command;
        const feedback = await this.update(id, entity);
        if (feedback) {
            const interviewId = entity.interviewer ? entity.interviewer.interviewId : null;
            if (interviewId) {
                const feedbacks = await this.candidateFeedbackService.getFeedbacksByInterviewId(interviewId);
                let interviewRating;
                if ((0, utils_1.isNotEmpty)(feedbacks)) {
                    interviewRating = this.candidateFeedbackService.calcRating(feedbacks);
                    await this.candidateInterviewService.create({
                        id: interviewId,
                        rating: interviewRating
                    });
                }
            }
            return feedback;
        }
    }
    async update(id, entity) {
        return this.candidateFeedbackService.create({ ...entity, id });
    }
};
exports.FeedbackUpdateHandler = FeedbackUpdateHandler;
exports.FeedbackUpdateHandler = FeedbackUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_feedbacks_update_command_1.FeedbackUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_feedbacks_service_1.CandidateFeedbacksService,
        candidate_interview_service_1.CandidateInterviewService])
], FeedbackUpdateHandler);
//# sourceMappingURL=candidate-feedbacks.update.handler.js.map