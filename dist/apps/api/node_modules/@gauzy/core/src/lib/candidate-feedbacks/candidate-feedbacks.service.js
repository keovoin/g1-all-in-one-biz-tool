"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateFeedbacksService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_1 = require("./../core/context");
const crud_1 = require("./../core/crud");
const mikro_orm_candidate_feedback_repository_1 = require("./repository/mikro-orm-candidate-feedback.repository");
const type_orm_candidate_feedback_repository_1 = require("./repository/type-orm-candidate-feedback.repository");
let CandidateFeedbacksService = class CandidateFeedbacksService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateFeedbackRepository, mikroOrmCandidateFeedbackRepository) {
        super(typeOrmCandidateFeedbackRepository, mikroOrmCandidateFeedbackRepository);
    }
    /**
     *
     * @param interviewId
     * @returns
     */
    async getFeedbacksByInterviewId(interviewId) {
        return await super.find({
            where: {
                interviewId,
                tenantId: context_1.RequestContext.currentTenantId()
            }
        });
    }
    /**
     *
     * @param feedbacks
     * @returns
     */
    calcRating(feedbacks) {
        const rate = [];
        feedbacks.forEach((fb) => {
            rate.push(Number(fb.rating));
        });
        const fbSum = rate.reduce((sum, current) => {
            return sum + current;
        });
        return fbSum / feedbacks.length;
    }
};
exports.CandidateFeedbacksService = CandidateFeedbacksService;
exports.CandidateFeedbacksService = CandidateFeedbacksService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_feedback_repository_1.TypeOrmCandidateFeedbackRepository,
        mikro_orm_candidate_feedback_repository_1.MikroOrmCandidateFeedbackRepository])
], CandidateFeedbacksService);
//# sourceMappingURL=candidate-feedbacks.service.js.map