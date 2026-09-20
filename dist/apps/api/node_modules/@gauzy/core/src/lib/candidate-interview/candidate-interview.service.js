"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const context_1 = require("./../core/context");
const crud_1 = require("./../core/crud");
const type_orm_candidate_interview_repository_1 = require("./repository/type-orm-candidate-interview.repository");
const mikro_orm_candidate_interview_repository_1 = require("./repository/mikro-orm-candidate-interview.repository");
let CandidateInterviewService = class CandidateInterviewService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateInterviewRepository, mikroOrmCandidateInterviewRepository) {
        super(typeOrmCandidateInterviewRepository, mikroOrmCandidateInterviewRepository);
    }
    /**
     *
     * @param candidateId
     * @returns
     */
    async findByCandidateId(candidateId) {
        return await super.find({
            where: {
                candidateId,
                tenantId: context_1.RequestContext.currentTenantId()
            }
        });
    }
};
exports.CandidateInterviewService = CandidateInterviewService;
exports.CandidateInterviewService = CandidateInterviewService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_interview_repository_1.TypeOrmCandidateInterviewRepository,
        mikro_orm_candidate_interview_repository_1.MikroOrmCandidateInterviewRepository])
], CandidateInterviewService);
//# sourceMappingURL=candidate-interview.service.js.map