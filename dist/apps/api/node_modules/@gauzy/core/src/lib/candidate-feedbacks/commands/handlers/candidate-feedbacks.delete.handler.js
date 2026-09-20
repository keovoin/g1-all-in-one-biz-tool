"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackDeleteHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const candidate_feedbacks_delete_command_1 = require("../candidate-feedbacks.delete.command");
const candidate_feedbacks_service_1 = require("../../candidate-feedbacks.service");
const candidate_interview_service_1 = require("../../../candidate-interview/candidate-interview.service");
let FeedbackDeleteHandler = class FeedbackDeleteHandler {
    constructor(candidateFeedbackService, candidateInterviewService) {
        this.candidateFeedbackService = candidateFeedbackService;
        this.candidateInterviewService = candidateInterviewService;
    }
    async execute(command) {
        const { feedbackId, interviewId } = command;
        const feedback = await this.delete(feedbackId);
        if (feedback && interviewId) {
            const id = interviewId;
            const feedbacks = await this.candidateFeedbackService.getFeedbacksByInterviewId(id);
            let interviewRating;
            if (feedbacks.length > 0) {
                interviewRating = this.candidateFeedbackService.calcRating(feedbacks);
                await this.candidateInterviewService.create({
                    id: id,
                    rating: interviewRating
                });
            }
            else {
                await this.candidateInterviewService.create({
                    id: id,
                    rating: 0
                });
            }
            return;
        }
    }
    async delete(id) {
        return this.candidateFeedbackService.delete(id);
    }
};
exports.FeedbackDeleteHandler = FeedbackDeleteHandler;
exports.FeedbackDeleteHandler = FeedbackDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(candidate_feedbacks_delete_command_1.FeedbackDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [candidate_feedbacks_service_1.CandidateFeedbacksService,
        candidate_interview_service_1.CandidateInterviewService])
], FeedbackDeleteHandler);
//# sourceMappingURL=candidate-feedbacks.delete.handler.js.map